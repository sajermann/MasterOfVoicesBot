import type { ModalSubmitInteraction } from 'discord.js';
import { handleRoomNameModal } from './roomNameModal';

/**
 * Dispatches modal submission interactions.
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
