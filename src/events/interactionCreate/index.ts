import type { Interaction } from 'discord.js';
import { handleCommandInteraction } from './commands';

export async function handleInteraction(
  interaction: Interaction,
): Promise<void> {
  // 1. Slash commands
  if (interaction.isChatInputCommand()) {
    await handleCommandInteraction(interaction);
    return;
  }
}
