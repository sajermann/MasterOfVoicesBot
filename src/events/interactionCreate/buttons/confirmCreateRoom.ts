import { type ButtonInteraction, EmbedBuilder, MessageFlags } from 'discord.js';
import { VoiceRoomService } from '../../../services/VoiceRoomService';

/**
 * Handles the click on Confirm Creation button to create the private room with configured permissions.
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

  // Disable interaction while creating the channel
  await interaction.deferUpdate();

  try {
    const { channel, movedOwner } = await VoiceRoomService.createVoiceRoom(
      guild,
      interaction.user,
      draft.limit,
      draft.memberIds,
      draft.customName,
    );

    // Clear the draft after successful creation
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
