import type { StringSelectMenuInteraction } from 'discord.js';
import { VoiceRoomService } from '../../../services/VoiceRoomService';
import { buildRoomConfigPayload } from '../buttons/openRoom';

/**
 * Trata a seleção do limite de vagas da sala de voz via StringSelectMenu.
 */
export async function handleRoomLimitSelect(
  interaction: StringSelectMenuInteraction,
): Promise<void> {
  const userId = interaction.user.id;
  const selectedLimit = Number.parseInt(interaction.values[0], 10);

  const updatedDraft = VoiceRoomService.updateDraftLimit(
    userId,
    Number.isNaN(selectedLimit) ? 2 : selectedLimit,
  );

  const payload = buildRoomConfigPayload(updatedDraft, interaction.user);
  await interaction.update(payload);
}
