import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type Client,
  EmbedBuilder,
  type Message,
} from 'discord.js';

export async function setupPanel(client: Client): Promise<void> {
  const channelId = process.env.CHANNEL_BOT_ID || '';

  if (!channelId) {
    console.warn(
      '[SetupPanel] CHANNEL_BOT_ID não configurado. Painel fixo ignorado.',
    );
    return;
  }

  console.log(
    `[SetupPanel] Inicializando painel fixo de salas de voz no canal: ${channelId}...`,
  );

  try {
    const channel = await client.channels.fetch(channelId);
    if (!channel?.isTextBased() || !('send' in channel)) {
      console.error(
        `[SetupPanel] Canal ${channelId} não encontrado, não é de texto ou não permite envio de mensagens.`,
      );
      return;
    }

    // 1. Constrói o Embed e o Botão do Painel
    const embed = new EmbedBuilder()
      .setTitle('🎙️ Salas de Voz Privadas')
      .setDescription(
        'Crie sua própria sala de voz temporária e totalmente privada com apenas um clique!\n\n' +
          '**Como funciona:**\n' +
          '1️⃣ Clique no botão **Criar Sala Privada** abaixo.\n' +
          '2️⃣ Escolha o limite máximo de pessoas que poderão entrar.\n' +
          '3️⃣ Selecione no menu nativo quais amigos terão permissão de acesso.\n' +
          '4️⃣ Ao confirmar, sua sala é criada e você é movido automaticamente.\n\n' +
          '🧹 *Quando o último participante sair da sala, ela será excluída automaticamente.*',
      )
      .setColor(0x5865f2)
      .setFooter({
        text: 'Master of Voices • Salas Temporárias',
      });

    const openRoomButton = new ButtonBuilder()
      .setCustomId('btn_open_room')
      .setLabel('Criar Sala Privada')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('🔒');

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      openRoomButton,
    );

    // 2. Busca mensagens recentes no canal para verificar se já existe o painel
    const messages = await channel.messages.fetch({ limit: 50 });
    const botMessages = messages.filter(
      (msg: Message) => msg.author.id === client.user?.id,
    );

    const existingMessage = botMessages.first();

    if (existingMessage) {
      // Se já existe uma mensagem do bot, edita-a para não duplicar no chat
      await existingMessage.edit({
        embeds: [embed],
        components: [row],
      });
      console.log(
        `[SetupPanel] Painel existente atualizado com sucesso no canal: ${channelId}`,
      );

      // Remove eventuais mensagens excedentes do bot no canal
      const extraMessages = botMessages.filter(
        (msg: Message) => msg.id !== existingMessage.id,
      );
      for (const [, extra] of extraMessages) {
        await extra.delete().catch(() => null);
      }
    } else {
      // Se não existe, envia uma nova mensagem com o painel fixo
      await channel.send({
        embeds: [embed],
        components: [row],
      });
      console.log(
        `[SetupPanel] Novo painel fixo criado com sucesso no canal: ${channelId}`,
      );
    }
  } catch (error) {
    console.error('[SetupPanel] Erro ao configurar painel fixo:', error);
  }
}
