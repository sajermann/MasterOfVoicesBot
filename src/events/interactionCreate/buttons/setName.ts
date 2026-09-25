import {
  ActionRowBuilder,
  type ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import { VoiceRoomService } from '../../../services/VoiceRoomService';

/**
 * Opens the modal for the user to set or change the voice room name.
 */
export async function handleSetNameButton(
  interaction: ButtonInteraction,
): Promise<void> {
  const userId = interaction.user.id;
  const draft = VoiceRoomService.getDraft(userId);

  const defaultPlaceholder = `Sala de ${
    interaction.user.displayName || interaction.user.username
  }`;

  const modal = new ModalBuilder()
    .setCustomId('modal_room_name')
    .setTitle('Nome da Sala de Voz');

  const nameInput = new TextInputBuilder()
    .setCustomId('input_room_name')
    .setLabel('Nome da Sala (Opcional)')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder(defaultPlaceholder)
    .setRequired(false)
    .setMaxLength(50);

  if (draft.customName) {
    nameInput.setValue(draft.customName);
  }

  const row = new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput);
  modal.addComponents(row);

  await interaction.showModal(modal);
}
