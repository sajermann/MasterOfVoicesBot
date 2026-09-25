import type { VoiceState } from 'discord.js';
import { VoiceRoomService } from '../../services/VoiceRoomService';

/**
 * Monitors voice state updates to manage temporary rooms.
 * Cancels abandonment timers when members join and deletes the room when all leave.
 */
export async function onVoiceStateUpdate(
  oldState: VoiceState,
  newState: VoiceState,
): Promise<void> {
  // 1. If someone joined a temporary room, cancel the abandonment timer
  if (
    newState.channelId &&
    VoiceRoomService.isTemporaryRoom(newState.channelId)
  ) {
    VoiceRoomService.cancelAbandonmentTimer(newState.channelId);
  }

  // 2. If someone left or switched voice channels
  if (oldState.channelId && oldState.channelId !== newState.channelId) {
    const leftChannel = oldState.channel;

    if (leftChannel && VoiceRoomService.isTemporaryRoom(leftChannel)) {
      // Check if the room became completely empty
      if (leftChannel.members.size === 0) {
        console.log(
          `[VoiceStateUpdate] Temporary room "${leftChannel.name}" (${leftChannel.id}) is now empty. Deleting...`,
        );
        await VoiceRoomService.deleteRoom(leftChannel);
      }
    }
  }
}
