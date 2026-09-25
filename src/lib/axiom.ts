import util from 'node:util';
import { Axiom } from '@axiomhq/js';

// Keep original references to continue logging to the terminal
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
 * Initializes Axiom integration and configures the hook for console methods.
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
        // Use the original console to prevent infinite loops
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
 * Intercepts console calls to send to Axiom and maintain terminal output.
 */
function hookConsole(datasetName: string) {
  const levels: LogLevel[] = ['log', 'info', 'warn', 'error', 'debug'];

  levels.forEach(level => {
    const originalMethod = originalConsole[level];

    console[level] = (...args: unknown[]) => {
      // 1. Maintain standard output to the terminal
      originalMethod(...args);

      // 2. If the Axiom client is not available, exit here
      if (!axiomClient) return;

      try {
        // util.format handles formatted strings (%s, %d), objects, and circular references safely
        const formattedMessage = util.format(...args);

        // Detect if any argument is an Error to capture detailed stack trace
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
 * Ensures queued logs in the batch are flushed before process exit.
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

// Auto-initialize on import
initAxiom();
