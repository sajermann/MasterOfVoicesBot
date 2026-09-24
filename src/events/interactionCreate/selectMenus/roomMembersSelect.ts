import type { UserSelectMenuInteraction } from 'discord.js';
import { VoiceRoomService } from '../../../services/VoiceRoomService';
import { buildRoomConfigPayload } from '../buttons/openRoom';

/**
 * Trata a seleção dos membros que terão permissão na sala via UserSelectMenu.
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
