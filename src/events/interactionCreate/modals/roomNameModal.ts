import { MessageFlags, type ModalSubmitInteraction } from 'discord.js';
import { VoiceRoomService } from '../../../services/VoiceRoomService';
import { buildRoomConfigPayload } from '../buttons/openRoom';

/**
 * Trata o envio do modal de personalização do nome da sala.
 */
export async function handleRoomNameModal(
  interaction: ModalSubmitInteraction,
): Promise<void> {
  const userId = interaction.user.id;
  const inputName =
    interaction.fields.getTextInputValue('input_room_name')?.trim() || '';

  const updatedDraft = VoiceRoomService.updateDraftName(
    userId,
    inputName.length > 0 ? inputName : undefined,
  );

  const payload = buildRoomConfigPayload(updatedDraft, interaction.user);

  if (interaction.isFromMessage()) {
    await interaction.update(payload);
  } else {
    await interaction.reply({
      ...payload,
      flags: MessageFlags.Ephemeral,
    });
  }
}
