import {
  ActionRowBuilder,
  ButtonBuilder,
  type ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
  type InteractionReplyOptions,
  type InteractionUpdateOptions,
  MessageFlags,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  type User,
  UserSelectMenuBuilder,
} from 'discord.js';
import {
  type RoomCreationDraft,
  VoiceRoomService,
} from '../../../services/VoiceRoomService';

/**
 * Monta o payload (Embed + Componentes) para configuração da sala de voz.
 */
export function buildRoomConfigPayload(
  draft: RoomCreationDraft,
  user?: User,
): InteractionReplyOptions & InteractionUpdateOptions {
  const defaultName = `Sala de ${user?.displayName || user?.username || 'Você'}`;
  const formattedName = draft.customName
    ? `\`${draft.customName}\``
    : `*\`${defaultName}\` (Padrão)*`;

  const embed = new EmbedBuilder()
    .setTitle('🛠️ Configurar Sala de Voz')
    .setDescription(
      'Personalize as opções da sua sala temporária antes de criá-la:\n\n' +
        `• **Nome:** ${formattedName}\n` +
        `• **Vagas:** \`${draft.limit === 0 ? 'Ilimitado' : `${draft.limit} pessoas`}\`\n` +
        `• **Acesso:** ${
          draft.memberIds.length > 0
            ? `🔒 Privada (${draft.memberIds.map(id => `<@${id}>`).join(', ')})`
            : '🔊 Aberta para todos (Pública)'
        }\n\n` +
        (draft.memberIds.length > 0
          ? '*Apenas você e os membros selecionados poderão ver e entrar na sala.*'
          : '*Deixe o seletor vazio para criar uma sala aberta ou selecione membros para torná-la privada.*'),
    )
    .setColor(0x5865f2)
    .setFooter({
      text: 'Selecione as opções abaixo e clique em Confirmar Criação',
    });

  // 1. Menu de seleção de vagas (StringSelectMenu)
  const limitSelect = new StringSelectMenuBuilder()
    .setCustomId('select_room_limit')
    .setPlaceholder(
      draft.limit === 0
        ? 'Limite atual: Ilimitado'
        : `Limite atual: ${draft.limit} pessoas`,
    )
    .addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel('Duo (2 pessoas)')
        .setValue('2')
        .setDescription('Ideal para jogar em dupla')
        .setEmoji('👥')
        .setDefault(draft.limit === 2),
      new StringSelectMenuOptionBuilder()
        .setLabel('Trio (3 pessoas)')
        .setValue('3')
        .setDescription('Ideal para trios')
        .setEmoji('👥')
        .setDefault(draft.limit === 3),
      new StringSelectMenuOptionBuilder()
        .setLabel('Squad (4 pessoas)')
        .setValue('4')
        .setDescription('Ideal para esquadrões')
        .setEmoji('👥')
        .setDefault(draft.limit === 4),
      new StringSelectMenuOptionBuilder()
        .setLabel('Ilimitado')
        .setValue('0')
        .setDescription('Ideal para quem quiser entrar (sem limite)')
        .setEmoji('👥')
        .setDefault(draft.limit === 0),
    );

  // 2. Menu de seleção de membros do servidor (UserSelectMenu nativo)
  const membersSelect = new UserSelectMenuBuilder()
    .setCustomId('select_room_members')
    .setPlaceholder('Vazio = Aberta | Selecione para tornar privada')
    .setMinValues(0)
    .setMaxValues(10);

  // 3. Botão para definir nome personalizado
  const setNameButton = new ButtonBuilder()
    .setCustomId('btn_set_room_name')
    .setLabel(draft.customName ? 'Alterar Nome' : 'Definir Nome')
    .setStyle(ButtonStyle.Secondary)
    .setEmoji('✏️');

  // 4. Botão de confirmação de criação
  const confirmButton = new ButtonBuilder()
    .setCustomId('btn_confirm_create_room')
    .setLabel('Confirmar Criação')
    .setStyle(ButtonStyle.Success)
    .setEmoji('✅');

  const rowLimit =
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(limitSelect);
  const rowMembers =
    new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(membersSelect);
  const rowButtons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    setNameButton,
    confirmButton,
  );

  return {
    embeds: [embed],
    components: [rowLimit, rowMembers, rowButtons],
  };
}

/**
 * Trata o clique no botão do painel fixo para abrir o menu de configuração efêmero.
 */
export async function handleOpenRoom(
  interaction: ButtonInteraction,
): Promise<void> {
  const userId = interaction.user.id;
  const draft = VoiceRoomService.getDraft(userId);

  const payload = buildRoomConfigPayload(draft, interaction.user);

  await interaction.reply({
    ...payload,
    flags: MessageFlags.Ephemeral,
  });
}
