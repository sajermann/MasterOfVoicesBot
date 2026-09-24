import type { ModalSubmitInteraction } from 'discord.js';
import { handleRoomNameModal } from './roomNameModal';

/**
 * Despacha as interações de submissão de modal.
 */
export async function handleModalInteraction(
  interaction: ModalSubmitInteraction,
): Promise<void> {
  const { customId } = interaction;

  if (customId === 'modal_room_name') {
    await handleRoomNameModal(interaction);
    return;
  }
}
