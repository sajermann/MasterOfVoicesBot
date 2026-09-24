import type { Client } from 'discord.js';
import { setupPanel } from '../../utils/setupPanel';

const CHANNEL_BOT_ID = process.env.CHANNEL_BOT_ID || '';

export async function onReady(client: Client): Promise<void> {
  console.log(
    `[Bot] Ready event fired. Logged in as ${client.user?.tag} (${client.user?.id})`,
  );
  try {
    console.log(`[Bot] Initializing panel in channel: ${CHANNEL_BOT_ID}...`);
    await setupPanel(client);
    console.log('[Bot] Startup completed successfully');
  } catch (error) {
    console.error('[Bot] Error during startup ready handler:', error);
  }
}
