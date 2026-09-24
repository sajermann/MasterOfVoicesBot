import type { VoiceState } from 'discord.js';
import { VoiceRoomService } from '../../services/VoiceRoomService';

/**
 * Monitora atualizações de estado de voz para gerenciar as salas temporárias.
 * Cancela timers de abandono quando membros entram e deleta a sala quando todos saem.
 */
export async function onVoiceStateUpdate(
  oldState: VoiceState,
  newState: VoiceState,
): Promise<void> {
  // 1. Se alguém entrou em uma sala temporária, cancela o timer de abandono
  if (
    newState.channelId &&
    VoiceRoomService.isTemporaryRoom(newState.channelId)
  ) {
    VoiceRoomService.cancelAbandonmentTimer(newState.channelId);
  }

  // 2. Se alguém saiu ou mudou de canal de voz
  if (oldState.channelId && oldState.channelId !== newState.channelId) {
    const leftChannel = oldState.channel;

    if (leftChannel && VoiceRoomService.isTemporaryRoom(leftChannel)) {
      // Verifica se a sala ficou completamente vazia
      if (leftChannel.members.size === 0) {
        console.log(
          `[VoiceStateUpdate] Temporary room "${leftChannel.name}" (${leftChannel.id}) is now empty. Deleting...`,
        );
        await VoiceRoomService.deleteRoom(leftChannel);
      }
    }
  }
}
