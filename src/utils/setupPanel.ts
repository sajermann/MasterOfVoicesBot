import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type Client,
  EmbedBuilder,
  type Message,
} from 'discord.js';
import { formatDateAndHour } from './formatDate';

const CHANNEL_BOT_ID = process.env.CHANNEL_BOT_ID || '';

export async function setupPanel(client: Client): Promise<void> {
  console.log(
    `[SetupPanel] Initializing persistent panel in channel: ${CHANNEL_BOT_ID}...`,
  );
  try {
    const channel = await client.channels.fetch(CHANNEL_BOT_ID);
    if (!channel?.isTextBased() || !('bulkDelete' in channel)) {
      console.error(
        `[SetupPanel] Finished with error - channel ${CHANNEL_BOT_ID} not found, not text-based, or does not support bulk delete.`,
      );
      return;
    }

    // 1. Fetch the latest messages from the channel
    const messages = await channel.messages.fetch({ limit: 50 });
    console.log(
      `[SetupPanel] Fetched ${messages.size} message(s) from channel ${CHANNEL_BOT_ID}`,
    );

    const currentDate = formatDateAndHour(new Date());

    // Build the panel layout (Embed + Button)
    const embed = new EmbedBuilder()
      .setTitle('Fort Bot - Telemetria')
      .setDescription(
        `Bem-vindo!\n\nEscolha uma opção abaixo\n\n*Bot Restarted: ${currentDate}*`,
      )
      .setColor(0x5865f2);

    const myStatsButton = new ButtonBuilder()
      .setCustomId('btn_my_stats')
      .setLabel('My Stats')
      .setStyle(ButtonStyle.Success)
      .setEmoji('📊');

    const linkButton = new ButtonBuilder()
      .setCustomId('btn_link_me')
      .setLabel('Link Me')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('🔗');

    const unlinkButton = new ButtonBuilder()
      .setCustomId('btn_unlink_me')
      .setLabel('Unlink Me')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('🔓');

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      myStatsButton,
      linkButton,
      unlinkButton,
    );

    // 2. Check if the channel already has messages
    // If there is only 1 message and it belongs to the bot, just edit it to keep the chat clean
    const existingMessage = messages.find(
      (msg: Message) => msg.author.id === client.user?.id,
    );

    if (messages.size === 1 && existingMessage) {
      // Chat is clean and the message belongs to the bot: just update the content
      await existingMessage.edit({
        embeds: [embed],
        components: [row],
      });
      console.log(
        `[SetupPanel] Finished - existing panel updated successfully in channel: ${CHANNEL_BOT_ID}`,
      );
    } else {
      // If there are multiple messages or clutter in the chat: clear all and send a fresh panel
      if (messages.size > 0) {
        console.log(
          `[SetupPanel] Clearing ${messages.size} old message(s) in channel: ${CHANNEL_BOT_ID}...`,
        );
        await channel.bulkDelete(messages, true);
      }

      await channel.send({
        embeds: [embed],
        components: [row],
      });
      console.log(
        `[SetupPanel] Finished - chat cleared and fresh panel published successfully in channel: ${CHANNEL_BOT_ID}`,
      );
    }
  } catch (error) {
    console.error(
      `[SetupPanel] Finished with error setting up panel on startup:`,
      error,
    );
  }
}
