import './config/env';
import './lib/axiom';
import DiscordJs, { Events, GatewayIntentBits } from 'discord.js';
import { handleInteraction } from './events/interactionCreate';
import { onReady } from './events/ready/onReady';

const client = new DiscordJs.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, async () => {
  await onReady(client);
});

client.on(Events.InteractionCreate, async interaction => {
  await handleInteraction(interaction);
});

client.login(process.env.TOKEN_DISCORD);
