import { REST, Routes } from 'discord.js';
import { healthCommand } from './health';

const TOKEN_DISCORD = process.env.TOKEN_DISCORD || '';
const CLIENT_ID_DISCORD = process.env.CLIENT_ID_DISCORD || '';
const SERVER_ID_DISCORD = process.env.SERVER_ID_DISCORD || '';

export interface CommandEntry {
  command: { name: string; toJSON: () => unknown };
  skip?: boolean;
}

export const commands: CommandEntry[] = [
  {
    command: healthCommand,
    skip: false,
  },
];

const activeCommands = commands
  .filter(item => !item.skip)
  .map(item => item.command.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN_DISCORD);

(async () => {
  try {
    const activeNames = commands
      .filter(item => !item.skip)
      .map(item => `/${item.command.name}`)
      .join(', ');

    const skippedNames = commands
      .filter(item => item.skip)
      .map(item => `/${item.command.name}`)
      .join(', ');

    console.log(`[DeployCommands] Registering slash commands on guild...`);
    console.log(`[DeployCommands] Active commands: ${activeNames || 'none'}`);
    if (skippedNames) {
      console.log(`[DeployCommands] Skipped commands: ${skippedNames}`);
    }

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID_DISCORD, SERVER_ID_DISCORD),
      { body: activeCommands },
    );

    console.log(
      '[DeployCommands] Finished - commands registered successfully on guild!',
    );
  } catch (error) {
    console.error(
      '[DeployCommands] Finished with error registering commands:',
      error,
    );
  }
})();
