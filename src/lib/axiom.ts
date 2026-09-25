import util from 'node:util';
import { Axiom } from '@axiomhq/js';

// Mantém as referências originais para continuar exibindo no terminal
export const originalConsole = {
  log: console.log.bind(console),
  info: console.info.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
  debug: console.debug.bind(console),
};

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

let axiomClient: Axiom | null = null;
let isInitialized = false;
let isFlushing = false;

/**
 * Inicializa a integração com o Axiom e configura o hook dos métodos de console.
 */
export function initAxiom(): Axiom | null {
  if (isInitialized) return axiomClient;
  isInitialized = true;

  const apiKey = process.env.AXIOM_API_KEY;
  const datasetName = process.env.AXIOM_DATASET_NAME;

  if (!apiKey || !datasetName) {
    originalConsole.warn(
      '[Axiom] AXIOM_API_KEY ou AXIOM_DATASET_NAME não encontrados no ambiente. Telemetria remota desativada.',
    );
    return null;
  }

  try {
    axiomClient = new Axiom({
      token: apiKey,
      onError: err => {
        // Usa o console original para evitar loop infinito
        originalConsole.error('[Axiom Error]:', err?.message || err);
      },
    });

    hookConsole(datasetName);
    setupProcessHandlers();

    return axiomClient;
  } catch (error) {
    originalConsole.error('[Axiom Initialization Error]:', error);
    return null;
  }
}

/**
 * Intercepta as chamadas do console para enviar ao Axiom e manter no terminal.
 */
function hookConsole(datasetName: string) {
  const levels: LogLevel[] = ['log', 'info', 'warn', 'error', 'debug'];

  levels.forEach(level => {
    const originalMethod = originalConsole[level];

    console[level] = (...args: unknown[]) => {
      // 1. Mantém a impressão normal no terminal
      originalMethod(...args);

      // 2. Se o cliente Axiom não estiver disponível, encerra aqui
      if (!axiomClient) return;

      try {
        // util.format lida com strings formatadas (%s, %d), objetos e referências circulares com segurança
        const formattedMessage = util.format(...args);

        // Detecta se algum argumento é um Error para capturar stack trace detalhado
        const errorArg = args.find((arg): arg is Error => arg instanceof Error);

        axiomClient.ingest(datasetName, [
          {
            _time: new Date().toISOString(),
            level,
            message: formattedMessage,
            environment: process.env.NODE_ENV || 'development',
            service: 'master-of-voices-discord-bot',
            ...(errorArg && {
              error: {
                name: errorArg.name,
                message: errorArg.message,
                stack: errorArg.stack,
              },
            }),
          },
        ]);
      } catch (err) {
        originalConsole.error('[Axiom Transporter Error]:', err);
      }
    };
  });
}

/**
 * Garante que logs enfileirados no batch sejam enviados antes do encerramento do processo.
 */
export async function flushAxiom(): Promise<void> {
  if (axiomClient && !isFlushing) {
    isFlushing = true;
    try {
      await axiomClient.flush();
    } catch (err) {
      originalConsole.error('[Axiom Flush Error]:', err);
    } finally {
      isFlushing = false;
    }
  }
}

function setupProcessHandlers() {
  process.once('beforeExit', async () => {
    await flushAxiom();
  });

  const handleTermination = async () => {
    await flushAxiom();
    process.exit(0);
  };

  process.once('SIGINT', handleTermination);
  process.once('SIGTERM', handleTermination);
}

// Auto-inicializa na importação
initAxiom();
