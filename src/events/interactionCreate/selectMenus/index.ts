import type { AnySelectMenuInteraction } from 'discord.js';
import { handleRoomLimitSelect } from './roomLimitSelect';
import { handleRoomMembersSelect } from './roomMembersSelect';

/**
 * Despacha as interações de menus de seleção (String e User Select Menus).
 */
export async function handleSelectMenuInteraction(
  interaction: AnySelectMenuInteraction,
): Promise<void> {
  const { customId } = interaction;

  if (customId === 'select_room_limit' && interaction.isStringSelectMenu()) {
    await handleRoomLimitSelect(interaction);
    return;
  }

  if (customId === 'select_room_members' && interaction.isUserSelectMenu()) {
    await handleRoomMembersSelect(interaction);
    return;
  }
}
