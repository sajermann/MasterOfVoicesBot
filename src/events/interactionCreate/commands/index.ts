import type { ChatInputCommandInteraction } from 'discord.js';
import { handleHealthCommand } from './health';

export async function handleCommandInteraction(
  interaction: ChatInputCommandInteraction,
): Promise<void> {
  const { commandName } = interaction;

  if (commandName === 'health') {
    await handleHealthCommand(interaction);
    return;
  }
}
