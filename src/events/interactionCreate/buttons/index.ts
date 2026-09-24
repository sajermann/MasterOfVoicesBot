import type { ButtonInteraction } from 'discord.js';
import { handleConfirmCreateRoom } from './confirmCreateRoom';
import { handleOpenRoom } from './openRoom';
import { handleSetNameButton } from './setName';

/**
 * Despacha as interações de botão para seus respectivos manipuladores.
 */
export async function handleButtonInteraction(
  interaction: ButtonInteraction,
): Promise<void> {
  const { customId } = interaction;

  if (customId === 'btn_open_room') {
    await handleOpenRoom(interaction);
    return;
  }

  if (customId === 'btn_set_room_name') {
    await handleSetNameButton(interaction);
    return;
  }

  if (customId === 'btn_confirm_create_room') {
    await handleConfirmCreateRoom(interaction);
    return;
  }
}
