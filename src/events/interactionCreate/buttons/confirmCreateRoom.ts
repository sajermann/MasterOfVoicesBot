import { type ButtonInteraction, EmbedBuilder, MessageFlags } from 'discord.js';
import { VoiceRoomService } from '../../../services/VoiceRoomService';

/**
 * Trata o clique no botão Confirmar Criação para criar a sala privada com as permissões configuradas.
 */
export async function handleConfirmCreateRoom(
  interaction: ButtonInteraction,
): Promise<void> {
  const guild = interaction.guild;
  if (!guild) {
    await interaction.reply({
      content: 'Este comando só pode ser utilizado dentro de um servidor.',
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const userId = interaction.user.id;
  const draft = VoiceRoomService.getDraft(userId);

  // Desativa interação enquanto cria o canal
  await interaction.deferUpdate();

  try {
    const { channel, movedOwner } = await VoiceRoomService.createVoiceRoom(
      guild,
      interaction.user,
      draft.limit,
      draft.memberIds,
      draft.customName,
    );

    // Limpa o rascunho após a criação bem-sucedida
    VoiceRoomService.clearDraft(userId);

    const isPrivate = draft.memberIds.length > 0;
    const successEmbed = new EmbedBuilder()
      .setTitle('🎉 Sala Criada com Sucesso!')
      .setDescription(
        `Sua sala de voz está pronta: <#${channel.id}>\n\n` +
          `• **Nome:** \`${channel.name}\`\n` +
          `• **Vagas:** \`${draft.limit === 0 ? 'Ilimitado' : `${draft.limit} pessoas`}\`\n` +
          `• **Acesso:** ${
            isPrivate
              ? `🔒 Privada (${draft.memberIds.map(id => `<@${id}>`).join(', ')})`
              : '🔊 Aberta para todos (Pública)'
          }\n\n` +
          (movedOwner
            ? '🔊 *Você foi movido automaticamente para o canal!*'
            : '👉 *Conecte-se à sala para utilizá-la.*') +
          '\n\n*⏳ Esta sala será apagada automaticamente assim que todos saírem.*',
      )
      .setColor(0x57f287);

    await interaction.editReply({
      embeds: [successEmbed],
      components: [],
    });
  } catch (error) {
    console.error(
      `[ConfirmCreateRoom] Error creating voice room for ${interaction.user.tag}:`,
      error,
    );

    const errorEmbed = new EmbedBuilder()
      .setTitle('❌ Erro ao Criar Sala')
      .setDescription(
        'Ocorreu um erro ao tentar criar a sala de voz. Verifique se o bot possui a permissão `Gerenciar Canais` e tente novamente.',
      )
      .setColor(0xed4245);

    await interaction.editReply({
      embeds: [errorEmbed],
      components: [],
    });
  }
}
