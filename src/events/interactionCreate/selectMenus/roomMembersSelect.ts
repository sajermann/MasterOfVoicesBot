import type { UserSelectMenuInteraction } from 'discord.js';
import { VoiceRoomService } from '../../../services/VoiceRoomService';
import { buildRoomConfigPayload } from '../buttons/openRoom';

/**
 * Handles the selection of members who will have access to the room via UserSelectMenu.
 */
export async function handleRoomMembersSelect(
  interaction: UserSelectMenuInteraction,
): Promise<void> {
  const userId = interaction.user.id;
  const selectedMemberIds = interaction.values;

  const updatedDraft = VoiceRoomService.updateDraftMembers(
    userId,
    selectedMemberIds,
  );

  const payload = buildRoomConfigPayload(updatedDraft, interaction.user);
  await interaction.update(payload);
}
