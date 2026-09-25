import './config/env';
import './lib/axiom';
import DiscordJs, { Events, GatewayIntentBits } from 'discord.js';
import { handleInteraction } from './events/interactionCreate';
import { onReady } from './events/ready/onReady';
import { onVoiceStateUpdate } from './events/voiceStateUpdate/onVoiceStateUpdate';

const client = new DiscordJs.Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

client.once(Events.ClientReady, async () => {
  await onReady(client);
});

client.on(Events.InteractionCreate, async interaction => {
  await handleInteraction(interaction);
});

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
  await onVoiceStateUpdate(oldState, newState);
});

client.login(process.env.TOKEN_DISCORD);
