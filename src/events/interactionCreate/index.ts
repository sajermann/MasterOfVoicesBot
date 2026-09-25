import type { Interaction } from 'discord.js';
import { handleButtonInteraction } from './buttons';
import { handleCommandInteraction } from './commands';
import { handleModalInteraction } from './modals';
import { handleSelectMenuInteraction } from './selectMenus';

/**
 * Main Discord interaction router.
 * Dispatches events to slash commands, buttons, select menus, and modals.
 */
export async function handleInteraction(
  interaction: Interaction,
): Promise<void> {
  try {
    // 1. Slash commands
    if (interaction.isChatInputCommand()) {
      await handleCommandInteraction(interaction);
      return;
    }

    // 2. Buttons
    if (interaction.isButton()) {
      await handleButtonInteraction(interaction);
      return;
    }

    // 3. Select menus (String and User Select Menus)
    if (interaction.isAnySelectMenu()) {
      await handleSelectMenuInteraction(interaction);
      return;
    }

    // 4. Modals
    if (interaction.isModalSubmit()) {
      await handleModalInteraction(interaction);
      return;
    }
  } catch (error) {
    console.error('[handleInteraction] Erro ao processar interação:', error);
  }
}
