import type { Interaction } from 'discord.js';
import { handleButtonInteraction } from './buttons';
import { handleCommandInteraction } from './commands';
import { handleModalInteraction } from './modals';
import { handleSelectMenuInteraction } from './selectMenus';

/**
 * Roteador principal de interações do Discord.
 * Despacha eventos para comandos slash, botões, menus de seleção e modais.
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

    // 2. Botões
    if (interaction.isButton()) {
      await handleButtonInteraction(interaction);
      return;
    }

    // 3. Menus de seleção (String e User Select Menus)
    if (interaction.isAnySelectMenu()) {
      await handleSelectMenuInteraction(interaction);
      return;
    }

    // 4. Modais
    if (interaction.isModalSubmit()) {
      await handleModalInteraction(interaction);
      return;
    }
  } catch (error) {
    console.error('[handleInteraction] Erro ao processar interação:', error);
  }
}
