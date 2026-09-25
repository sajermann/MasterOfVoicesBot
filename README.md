# Master of Voices Bot 🎙️

[![Discord.js](https://img.shields.io/badge/Discord.js-v14.27-5865F2?logo=discord&logoColor=white)](https://discord.js.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Biome](https://img.shields.io/badge/Linter-Biome-60A5FA?logo=biome&logoColor=white)](https://biomejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-339933?logo=node.js&logoColor=white)](https://nodejs.org/)

---

## 🇧🇷 Português

### 🎯 Objetivo
O **Master of Voices** é um bot de Discord moderno, autônomo e altamente eficiente desenvolvido para gerenciar canais de áudio temporários e privados de forma dinâmica. Seu principal propósito é fornecer aos membros de um servidor a liberdade de criar salas de voz personalizadas sob demanda (com controle de vagas, permissões restritas a amigos selecionados e nome customizado) através de um painel interativo fixo, com auto-deleção instantânea quando a sala for desocupada, mantendo o servidor 100% organizado e livre de canais abandonados.

---

### ⚡ Funcionalidades e Recursos

#### 1. Painel Interativo no Canal Fixo (`setupPanel`)
- Mantém um painel de controle fixo e persistente no canal configurado (`CHANNEL_BOT_ID`).
- Comportamento idempotente: se já existir uma mensagem do bot no canal, o painel é atualizado (`edit`) e mensagens excedentes são removidas; caso contrário, uma nova mensagem é publicada.
- Oferece o botão interativo principal:
  - **🔒 Criar Sala Privada (`btn_open_room`):** Abre um menu de configuração efêmero (visível apenas para quem clicou), onde o usuário monta a sala sob medida antes de criá-la.

#### 2. Fluxo Intuitivo de Configuração de Salas (Ephemeral Menu)
- **👥 Limite de Vagas (`select_room_limit`):** Menu de seleção suspensa nativo (`StringSelectMenu`) com opções rápidas: Duo (2 vagas), Trio (3 vagas), Squad (4 vagas) ou Ilimitado (0).
- **🔒 Controle de Acesso e Convidados (`select_room_members`):** Utiliza o seletor nativo de usuários do Discord (`UserSelectMenu` com suporte a 0 a 10 membros). Se nenhum usuário for selecionado, a sala é gerada como **Pública** (`🔊`); se membros forem marcados, a sala torna-se **Privada** (`🔒`), aplicando regras estritas de permissão.
- **✏️ Nome Customizado (`btn_set_room_name` / `modal_room_name`):** Abre um modal interativo (`ModalBuilder`) com campo de texto (`TextInput`) para o usuário batizar sua sala (ex: *"Call dos Cria"*). Caso não informe, adota automaticamente o padrão `Sala de <NomeDoUsuário>`.
- **✅ Rascunho em Memória e Confirmação (`btn_confirm_create_room`):** Mantém o estado temporário do rascunho por usuário e, após a confirmação, constrói a sala na categoria designada (`CATEGORY_VOICE_ID`).

#### 3. Automação e Ciclo de Vida Inteligente (`VoiceRoomService`)
- **Auto-Move do Criador:** Se o usuário já estiver conectado em qualquer canal de voz da guilda ao confirmar a criação, o bot o move automaticamente para a nova sala criada.
- **Proteção Contra Abandono (Timeout de 2 Minutos):** Caso o criador ainda não esteja conectado a uma chamada de áudio, um temporizador de 2 minutos é agendado. Se ninguém entrar na sala dentro desse prazo, ela é excluída automaticamente, evitando canais órfãos.
- **Detecção de Desocupação em Tempo Real (`onVoiceStateUpdate`):** Monitora a saída e troca de canais de voz. Assim que o último membro deixa a sala temporária, o canal é excluído do Discord de forma imediata.
- **Recuperação e Limpeza na Inicialização (`cleanupAbandonedRooms`):** Ao iniciar ou reiniciar o bot, varre os canais de voz da categoria e prefixados (`🔒` e `🔊`), excluindo salas temporárias que ficaram órfãs e reassumindo o rastreamento das que ainda possuem pessoas conectadas.

#### 4. Gerenciamento Granular de Permissões
- **Salas Privadas (`🔒`):**
  - Regra `@everyone`: Negação explícita de `ViewChannel` e `Connect` (invisível e inacessível para outros membros).
  - Regra para o Dono: Acesso total para visualizar, conectar, falar e mover membros (`MoveMembers`).
  - Regra para Convidados Selecionados: Permissão para visualizar, conectar e falar.
- **Salas Públicas (`🔊`):** Visíveis e acessíveis para `@everyone`, com o criador mantendo o controle administrativo para mover membros.
- O bot garante que suas próprias permissões (`ManageChannels`, `MoveMembers`, `Connect`, etc.) sejam sempre preservadas sobre a sala criada.

#### 5. Comandos Slash (`/`)
- **`/health`**: Retorna um diagnóstico detalhado em JSON contendo a versão atual da aplicação, timestamp da última atualização e o ambiente de execução (`Development` ou `Production`), acompanhado de agendamento de auto-deleção da resposta.
- **`deploy:commands`**: Script isolado utilizando a REST API v10 do Discord para registrar ou atualizar comandos na guilda instantaneamente sem necessidade de reiniciar a aplicação principal.

#### 6. Gerenciamento Inteligente de Mensagens (`Auto-Delete`)
- Respostas efêmeras com aviso formatado e contagem de tempo para expiração (`withAutoDeleteNotice` e `scheduleAutoDelete`), garantindo uma interface limpa sem poluição visual.

#### 7. Observabilidade e Telemetria em Tempo Real
- Integração nativa com a plataforma **Axiom** (`@axiomhq/js`).
- Interceptação global e não-bloqueante dos métodos de `console` (`log`, `info`, `warn`, `error`, `debug`) com serialização segura via `util.format`, captura automática de stack traces de erros e envio assíncrono em lote (com flush preventivo em `beforeExit`, `SIGINT` e `SIGTERM`).

---

### 📁 Estrutura do Projeto

```
MasterOfVoicesDiscordBot/
├── src/
│   ├── commands/                    # Definições de Slash Commands e script de deploy
│   │   ├── deploy.ts                # Registro de comandos na guilda via REST API v10
│   │   └── health.ts                # Construtor do Slash Command /health
│   │
│   ├── config/                      # Configurações do ambiente de execução
│   │   └── env.ts                   # Carregamento dinâmico de variáveis (.env.development / .env.production)
│   │
│   ├── events/                      # Arquitetura Event-Driven desacoplada
│   │   ├── ready/
│   │   │   └── onReady.ts           # Inicialização: limpeza de salas órfãs e setup do painel
│   │   │
│   │   ├── interactionCreate/       # Roteamento central de interações do Discord
│   │   │   ├── index.ts             # Despachante principal de eventos
│   │   │   ├── buttons/             # Handlers de botões interativos
│   │   │   │   ├── confirmCreateRoom.ts # Criação da sala, aplicação de permissões e auto-move
│   │   │   │   ├── index.ts         # Roteador de botões
│   │   │   │   ├── openRoom.ts      # Montagem e exibição do menu de configuração efêmero
│   │   │   │   └── setName.ts       # Abertura do modal para nome customizado
│   │   │   ├── commands/            # Handlers de Slash Commands
│   │   │   │   ├── health.ts        # Execução do comando /health com dados do ambiente
│   │   │   │   └── index.ts         # Roteador de comandos slash
│   │   │   ├── modals/              # Handlers de submissão de formulários modais
│   │   │   │   ├── index.ts         # Roteador de modais
│   │   │   │   └── roomNameModal.ts # Processamento do nome digitado da sala
│   │   │   └── selectMenus/         # Handlers de menus de seleção
│   │   │       ├── index.ts         # Roteador de select menus
│   │   │       ├── roomLimitSelect.ts # Atualização do limite de vagas (Duo, Trio, Squad, etc.)
│   │   │       └── roomMembersSelect.ts # Atualização de membros convidados para sala privada
│   │   │
│   │   └── voiceStateUpdate/        # Monitoramento contínuo dos estados de canais de voz
│   │       └── onVoiceStateUpdate.ts # Detecção de abandono, desocupação e deleção de canais vazios
│   │
│   ├── lib/                         # Clientes externos, wrappers e utilitários de infraestrutura
│   │   ├── axiom.ts                 # Cliente Axiom e transporte de logs via hook do console
│   │   └── zlib-sync-polyfill.js    # Polyfill de compressão para compatibilidade
│   │
│   ├── repositories/                # Camada de abstração e persistência de dados
│   │   └── contracts/               # Contratos e interfaces de repositórios
│   │
│   ├── services/                    # Camada de regras de negócio e orquestração de serviços
│   │   ├── contracts/               # Interfaces e contratos de serviços
│   │   ├── DevServices.ts           # Extração de status e metadados da aplicação (/health)
│   │   └── VoiceRoomService.ts      # Ciclo de vida completo das salas temporárias
│   │
│   ├── types/                       # Interfaces TypeScript e contratos compartilhados
│   │   └── index.ts                 # Definições globais de tipos
│   │
│   ├── utils/                       # Utilitários auxiliares compartilhados
│   │   ├── formatDate.ts            # Formatação humanizada de datas e horários
│   │   ├── index.ts                 # Exportação central de utilitários
│   │   ├── scheduleAutoDelete.ts    # Gerenciamento de auto-deleção com aviso visual
│   │   └── setupPanel.ts            # Criação e manutenção idempotente do painel fixo
│   │
│   └── index.ts                     # Ponto de entrada do bot e registro de eventos do cliente
│
├── .env.development                 # Variáveis de ambiente para desenvolvimento local
├── .env.production                  # Variáveis de ambiente para produção
├── .github/
│   └── workflows/
│       └── main.yml                 # Pipeline CI/CD para versionamento automático
├── biome.json                       # Configuração de linting e formatação com Biome
├── Dockerfile                       # Imagem multi-stage de produção em container
├── docker-compose.yml               # Orquestração do container do bot
├── package.json                     # Manifesto do projeto, dependências e scripts
├── tsconfig.json                    # Configurações do compilador TypeScript
└── webpack.config.js                # Bundle de produção otimizado com Webpack
```

---

### 🛠️ Scripts Disponíveis

| Comando | Descrição |
| :--- | :--- |
| `npm start` | Executa o bot em modo de desenvolvimento com `tsx watch` e hot-reload |
| `npm run deploy:commands` | Registra e atualiza os Slash Commands na guilda do Discord |
| `npm run build` | Compila o bundle de produção otimizado com Webpack na pasta `build/` |
| `npm run preview` | Executa o bundle compilado em `build/index.js` |
| `npm test` | Executa a suíte de testes com Jest e cobertura |

---

### 🔑 Variáveis de Ambiente

Crie um arquivo `.env.development` (para desenvolvimento local) ou `.env.production` (para produção) na raiz do projeto com as seguintes variáveis:

| Variável | Obrigatória | Por que é necessária? |
| :--- | :---: | :--- |
| `TOKEN_DISCORD` | Sim | Token secreto de autenticação do bot no Discord Developer Portal, necessário para conectar o cliente à API do Discord. |
| `CLIENT_ID_DISCORD` | Sim | ID da aplicação do bot, utilizado para o registro e deploy de Slash Commands via REST API. |
| `SERVER_ID_DISCORD` | Sim | ID do servidor (guilda) onde os comandos são registrados de forma imediata durante o deploy. |
| `CHANNEL_BOT_ID` | Sim | ID do canal de texto fixo onde o bot monta e mantém atualizado o painel interativo de criação de salas. |
| `CATEGORY_VOICE_ID` | Não | ID da categoria no Discord onde os novos canais de voz temporários serão criados e organizados. |
| `ADMIN_USER_ID_DISCORD` | Não | ID do usuário administrador no Discord para operações privilegiadas. |
| `MS_DELETE_COMMON_MESSAGE` | Não (Padrão: 15000) | Tempo em milissegundos antes de apagar avisos comuns e mensagens efêmeras do bot. |
| `MS_DELETE_STATS_MESSAGE` | Não (Padrão: 60000) | Tempo em milissegundos de expiração antes de apagar mensagens de status ou relatórios. |
| `AXIOM_API_KEY` | Sim* | Token de autenticação da plataforma Axiom, necessário para envio de telemetria e rastreamento de logs em tempo real. |
| `AXIOM_DATASET_NAME` | Sim* | Nome do dataset no Axiom onde os eventos e logs estruturados do bot serão gravados e monitorados. |

---

## 🇺🇸 English

### 🎯 Purpose
**Master of Voices** is a modern, autonomous, and high-efficiency Discord bot engineered to dynamically manage temporary, private voice channels. Its primary mission is to empower server members to spin up customized on-demand voice rooms (with customizable capacity, friend-exclusive permissions, and personalized room names) through a persistent interactive dashboard, automatically self-destructing empty channels to keep the Discord server 100% clean and clutter-free.

---

### ⚡ Features & Capabilities

#### 1. Permanent Interactive Dashboard (`setupPanel`)
- Maintains a clean, persistent control panel in the dedicated text channel (`CHANNEL_BOT_ID`).
- Idempotent lifecycle: if a previous message from the bot exists, it updates it in-place (`edit`) and clears any stray bot messages; otherwise, it sends a fresh panel message.
- Provides the main entry button:
  - **🔒 Criar Sala Privada (`btn_open_room`):** Generates an ephemeral setup menu (visible exclusively to the caller), allowing the user to configure room settings before provisioning.

#### 2. Intuitive Ephemeral Room Setup Workflow
- **👥 Capacity Limit (`select_room_limit`):** Native dropdown selector (`StringSelectMenu`) with preset slots: Duo (2 people), Trio (3 people), Squad (4 people), or Unlimited (0).
- **🔒 Access Control & Guests (`select_room_members`):** Powered by Discord's native `UserSelectMenu` (0 to 10 users). Leaving the selection empty creates an **Open / Public** room (`🔊`), while picking specific users turns it into a **Private** room (`🔒`) with restrictive permissions.
- **✏️ Custom Room Name (`btn_set_room_name` / `modal_room_name`):** Displays a pop-up modal (`ModalBuilder`) with a text input (`TextInput`) for naming the channel (e.g., *"Squad Gaming"*). Defaults to `Sala de <DisplayName>` if left blank.
- **✅ In-Memory Drafts & Creation (`btn_confirm_create_room`):** Safely stores user draft configurations in memory and provisions the voice room within the configured category (`CATEGORY_VOICE_ID`) upon confirmation.

#### 3. Intelligent Voice Lifecycle & Auto-Cleanup (`VoiceRoomService`)
- **Automatic Creator Move:** If the room creator is already connected to any voice channel in the guild when confirming, the bot instantly moves them to the newly created room.
- **Abandonment Protection (2-Minute Timer):** If the creator is not currently connected to voice upon creation, a 2-minute timer starts. If no one joins the room within that window, the channel is automatically deleted.
- **Real-Time Emptiness Detection (`onVoiceStateUpdate`):** Listens to member voice transitions. The exact moment the last participant disconnects, the temporary channel is cleanly removed from the server.
- **Startup Cleanup & Recovery (`cleanupAbandonedRooms`):** During bot initialization (`ClientReady`), it inspects existing voice channels in the category or with `🔒`/`🔊` prefixes, deleting abandoned empty rooms and resuming monitoring for active ones.

#### 4. Granular Permission Overwrites
- **Private Rooms (`🔒`):**
  - `@everyone`: Explicit deny for `ViewChannel` and `Connect` (hidden and locked for everyone else).
  - Room Owner: Full control to view, connect, speak, and move members (`MoveMembers`).
  - Whitelisted Members: Explicit grant for `ViewChannel`, `Connect`, and `Speak`.
- **Public Rooms (`🔊`):** Open to `@everyone` for viewing and connecting, while the owner retains member moderation capabilities.
- Bot permissions (`ManageChannels`, `MoveMembers`, `Connect`, etc.) are always preserved on the created channel.

#### 5. Slash Commands (`/`)
- **`/health`**: Returns detailed diagnostic JSON containing application version, last update timestamp, and current environment (`Development`/`Production`), automatically scheduled for ephemeral deletion.
- **`deploy:commands`**: Standalone deployment script utilizing Discord REST API v10 to immediately register and update slash commands on the target guild.

#### 6. Automated Message Cleanup (`Auto-Delete`)
- Sends ephemeral responses equipped with visual expiration counters (`withAutoDeleteNotice` and `scheduleAutoDelete`) to prevent channel clutter.

#### 7. Real-Time Observability & Telemetry
- Native integration with **Axiom** (`@axiomhq/js`).
- Transparent global hooking of standard `console` streams (`log`, `info`, `warn`, `error`, `debug`) with safe formatting via `util.format`, automatic error stack trace capture, and non-blocking batch dispatching with graceful shutdown hooks (`beforeExit`, `SIGINT`, `SIGTERM`).

---

### 📁 Architecture & File Structure

```
MasterOfVoicesDiscordBot/
├── src/
│   ├── commands/                    # Slash command definitions & deployment script
│   │   ├── deploy.ts                # Discord guild command registration via REST API v10
│   │   └── health.ts                # /health slash command builder
│   │
│   ├── config/                      # Environment variables loader
│   │   └── env.ts                   # Environment file resolution (.env.development / .env.production)
│   │
│   ├── events/                      # Decoupled Event-Driven architecture
│   │   ├── ready/
│   │   │   └── onReady.ts           # ClientReady event: room cleanup and dashboard initializer
│   │   │
│   │   ├── interactionCreate/       # Central interaction routing and handlers
│   │   │   ├── index.ts             # Central event dispatcher
│   │   │   ├── buttons/             # Interactive button handlers
│   │   │   │   ├── confirmCreateRoom.ts # Room provisioning, permissions, and auto-move
│   │   │   │   ├── index.ts         # Button interaction router
│   │   │   │   ├── openRoom.ts      # Ephemeral room setup menu builder
│   │   │   │   └── setName.ts       # Custom name modal trigger
│   │   │   ├── commands/            # Slash command execution handlers
│   │   │   │   ├── health.ts        # /health execution with system diagnostic data
│   │   │   │   └── index.ts         # Command interaction router
│   │   │   ├── modals/              # Modal submission handlers
│   │   │   │   ├── index.ts         # Modal interaction router
│   │   │   │   └── roomNameModal.ts # Custom room name processor
│   │   │   └── selectMenus/         # Select menu handlers
│   │   │       ├── index.ts         # Select menu router
│   │   │       ├── roomLimitSelect.ts # Capacity limit updater
│   │   │       └── roomMembersSelect.ts # Private room whitelist updater
│   │   │
│   │   └── voiceStateUpdate/        # Real-time voice state monitor
│   │       └── onVoiceStateUpdate.ts # Abandonment, emptiness, and auto-deletion listener
│   │
│   ├── lib/                         # External clients, wrappers, and polyfills
│   │   ├── axiom.ts                 # Axiom telemetry client and console logging hook
│   │   └── zlib-sync-polyfill.js    # Compression polyfill for compatibility
│   │
│   ├── repositories/                # Data persistence layer
│   │   └── contracts/               # Repository interfaces and contracts
│   │
│   ├── services/                    # Business logic and domain services
│   │   ├── contracts/               # Service interfaces and contracts
│   │   ├── DevServices.ts           # Diagnostic checks and package metadata (/health)
│   │   └── VoiceRoomService.ts      # Temporary voice room lifecycle manager
│   │
│   ├── types/                       # TypeScript interfaces & type definitions
│   │   └── index.ts                 # Global type definitions
│   │
│   ├── utils/                       # Shared utility helpers
│   │   ├── formatDate.ts            # Date and timestamp formatting helpers
│   │   ├── index.ts                 # Central utilities export barrel
│   │   ├── scheduleAutoDelete.ts    # Message auto-delete scheduling utility
│   │   └── setupPanel.ts            # Idempotent permanent dashboard setup
│   │
│   └── index.ts                     # Slim entry point and client event listeners
│
├── .env.development                 # Local development environment variables
├── .env.production                  # Production environment variables
├── .github/
│   └── workflows/
│       └── main.yml                 # Automated versioning and release CI/CD workflow
├── biome.json                       # Biome linter and formatter configuration
├── Dockerfile                       # Multi-stage production container definition
├── docker-compose.yml               # Container orchestration configuration
├── package.json                     # Project manifest, dependencies, and scripts
├── tsconfig.json                    # TypeScript compiler configuration
└── webpack.config.js                # Webpack production bundler configuration
```

---

### 🛠️ Available Scripts

| Script | Purpose |
| :--- | :--- |
| `npm start` | Runs the bot in development mode using `tsx watch` with hot reloading |
| `npm run deploy:commands` | Deploys/updates Slash Commands to the designated Discord Guild |
| `npm run build` | Compiles the production bundle via Webpack into `build/` |
| `npm run preview` | Runs the compiled Webpack bundle from `build/index.js` |
| `npm test` | Runs the test suite with Jest coverage reports |

---

### 🔑 Environment Variables

Create a `.env.development` (for local development) or `.env.production` (for production) file in the project root with the following variables:

| Variable | Required | Why is it needed? |
| :--- | :---: | :--- |
| `TOKEN_DISCORD` | Yes | Secret bot authorization token from Discord Developer Portal, required to authenticate the client with Discord API. |
| `CLIENT_ID_DISCORD` | Yes | Discord Application ID, used by REST routes to register and deploy Slash Commands. |
| `SERVER_ID_DISCORD` | Yes | Discord Server (Guild) ID where slash commands are instantly registered and updated. |
| `CHANNEL_BOT_ID` | Yes | Dedicated text channel ID where the permanent button dashboard is posted and continuously updated. |
| `CATEGORY_VOICE_ID` | Optional | Voice category ID in Discord where temporary rooms will be organized and created. |
| `ADMIN_USER_ID_DISCORD` | Optional | Administrator Discord User ID for restricted or privileged bot operations. |
| `MS_DELETE_COMMON_MESSAGE` | Optional (Def: 15000) | Milliseconds before common notices or ephemeral messages are automatically deleted. |
| `MS_DELETE_STATS_MESSAGE` | Optional (Def: 60000) | Milliseconds before status reports or longer notifications are automatically deleted. |
| `AXIOM_API_KEY` | Yes* | Axiom API token required for asynchronous telemetry and real-time structured logging. |
| `AXIOM_DATASET_NAME` | Yes* | Dataset name inside Axiom where bot events and logs are ingested and monitored. |
