import type { Client } from 'discord.js';
import { VoiceRoomService } from '../../services/VoiceRoomService';
import { setupPanel } from '../../utils/setupPanel';

export async function onReady(client: Client): Promise<void> {
  console.log(
    `[Bot] Ready event fired. Logged in as ${client.user?.tag} (${client.user?.id})`,
  );
  try {
    // 1. Limpa salas temporárias que possam ter ficado órfãs durante o restart
    await VoiceRoomService.cleanupAbandonedRooms(client);

    // 2. Garante a existência e atualização do painel fixo de criação
    await setupPanel(client);

    console.log('[Bot] Startup completed successfully');
  } catch (error) {
    console.error('[Bot] Error during startup ready handler:', error);
  }
}
