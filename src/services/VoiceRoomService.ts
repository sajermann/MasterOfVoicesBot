import {
  type AnyThreadChannel,
  ChannelType,
  type Client,
  type Guild,
  PermissionFlagsBits,
  type User,
  type VoiceBasedChannel,
} from 'discord.js';

export interface RoomCreationDraft {
  limit: number;
  memberIds: string[];
  customName?: string;
  updatedAt: number;
}

// Armazena os IDs dos canais de voz temporários ativos gerenciados pelo bot
const activeRooms = new Set<string>();

// Armazena timeouts de abandono (caso ninguém entre na sala recém-criada)
const abandonmentTimers = new Map<string, NodeJS.Timeout>();

// Armazena os rascunhos de criação de sala por usuário
const userDrafts = new Map<string, RoomCreationDraft>();

export const VoiceRoomService = {
  /**
   * Obtém ou inicializa o rascunho de configuração de sala para um usuário.
   */
  getDraft(userId: string): RoomCreationDraft {
    const existing = userDrafts.get(userId);
    if (existing) {
      return existing;
    }

    const defaultDraft: RoomCreationDraft = {
      limit: 2,
      memberIds: [],
      updatedAt: Date.now(),
    };
    userDrafts.set(userId, defaultDraft);
    return defaultDraft;
  },

  /**
   * Atualiza o limite de vagas no rascunho do usuário.
   */
  updateDraftLimit(userId: string, limit: number): RoomCreationDraft {
    const draft = VoiceRoomService.getDraft(userId);
    draft.limit = limit;
    draft.updatedAt = Date.now();
    userDrafts.set(userId, draft);
    return draft;
  },

  /**
   * Atualiza a lista de membros convidados no rascunho do usuário.
   */
  updateDraftMembers(userId: string, memberIds: string[]): RoomCreationDraft {
    const draft = VoiceRoomService.getDraft(userId);
    draft.memberIds = memberIds;
    draft.updatedAt = Date.now();
    userDrafts.set(userId, draft);
    return draft;
  },

  /**
   * Atualiza o nome personalizado no rascunho do usuário.
   */
  updateDraftName(userId: string, name?: string): RoomCreationDraft {
    const draft = VoiceRoomService.getDraft(userId);
    draft.customName = name?.trim() || undefined;
    draft.updatedAt = Date.now();
    userDrafts.set(userId, draft);
    return draft;
  },

  /**
   * Limpa o rascunho do usuário após confirmação ou cancelamento.
   */
  clearDraft(userId: string): void {
    userDrafts.delete(userId);
  },

  /**
   * Verifica se o canal ou ID fornecido pertence a uma sala temporária.
   */
  isTemporaryRoom(channelOrId: VoiceBasedChannel | string): boolean {
    if (typeof channelOrId === 'string') {
      return activeRooms.has(channelOrId);
    }
    const categoryId = process.env.CATEGORY_VOICE_ID?.trim();
    return (
      activeRooms.has(channelOrId.id) ||
      channelOrId.name.startsWith('🔒') ||
      channelOrId.name.startsWith('🔊') ||
      (Boolean(categoryId) && channelOrId.parentId === categoryId)
    );
  },

  /**
   * Cancela o timer de abandono caso algum usuário entre na sala.
   */
  cancelAbandonmentTimer(channelId: string): void {
    const timer = abandonmentTimers.get(channelId);
    if (timer) {
      clearTimeout(timer);
      abandonmentTimers.delete(channelId);
    }
  },

  /**
   * Limpa todas as salas temporárias vazias na inicialização do bot
   * e reassume o rastreamento das que ainda possuírem membros ativos.
   */
  async cleanupAbandonedRooms(client: Client): Promise<void> {
    console.log('[VoiceRoomService] Running startup cleanup of voice rooms...');
    const categoryId = process.env.CATEGORY_VOICE_ID?.trim();

    for (const [, guild] of client.guilds.cache) {
      try {
        const channels = await guild.channels.fetch();
        for (const [, channel] of channels) {
          if (!channel || channel.type !== ChannelType.GuildVoice) continue;

          const isTempRoom =
            channel.name.startsWith('🔒') ||
            channel.name.startsWith('🔊') ||
            (Boolean(categoryId) && channel.parentId === categoryId);

          if (isTempRoom) {
            if (channel.members.size === 0) {
              console.log(
                `[VoiceRoomService] Deleting empty abandoned room on startup: "${channel.name}" (${channel.id})`,
              );
              await VoiceRoomService.deleteRoom(channel);
            } else {
              // A sala ainda tem participantes: readiciona no activeRooms
              activeRooms.add(channel.id);
              console.log(
                `[VoiceRoomService] Recovered active temporary room: "${channel.name}" (${channel.id}) with ${channel.members.size} member(s).`,
              );
            }
          }
        }
      } catch (guildError) {
        console.error(
          `[VoiceRoomService] Error inspecting channels for guild ${guild.name} (${guild.id}):`,
          guildError,
        );
      }
    }
    console.log('[VoiceRoomService] Startup voice room cleanup completed.');
  },

  /**
   * Cria um canal de voz temporário (público ou privado) com permissões restritas.
   */
  async createVoiceRoom(
    guild: Guild,
    owner: User,
    limit: number,
    memberIds: string[],
    customName?: string,
  ): Promise<{ channel: VoiceBasedChannel; movedOwner: boolean }> {
    const categoryId = process.env.CATEGORY_VOICE_ID?.trim() || undefined;
    const isPrivate = memberIds.length > 0;

    // Filtra membros autorizados sem duplicar o dono
    const allowedMembers = Array.from(
      new Set(memberIds.filter(id => id !== owner.id)),
    );

    const permissionOverwrites = [];

    if (isPrivate) {
      // Sala Privada:
      // 1. @everyone: nega visualização e conexão
      // 2. Dono da sala: permite ver, conectar, falar e mover membros
      // 3. Membros selecionados: permite ver, conectar e falar
      permissionOverwrites.push(
        {
          id: guild.roles.everyone.id,
          deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect],
        },
        {
          id: owner.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.Connect,
            PermissionFlagsBits.Speak,
            PermissionFlagsBits.MoveMembers,
          ],
        },
        ...allowedMembers.map(id => ({
          id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.Connect,
            PermissionFlagsBits.Speak,
          ],
        })),
      );
    } else {
      // Sala Aberta / Pública:
      // 1. @everyone: permite ver, conectar e falar
      // 2. Dono da sala: permite ver, conectar, falar e mover membros
      permissionOverwrites.push(
        {
          id: guild.roles.everyone.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.Connect,
            PermissionFlagsBits.Speak,
          ],
        },
        {
          id: owner.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.Connect,
            PermissionFlagsBits.Speak,
            PermissionFlagsBits.MoveMembers,
          ],
        },
      );
    }

    if (guild.members.me?.id) {
      permissionOverwrites.push({
        id: guild.members.me.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.Connect,
          PermissionFlagsBits.Speak,
          PermissionFlagsBits.ManageChannels,
          PermissionFlagsBits.MoveMembers,
        ],
      });
    }

    const prefix = isPrivate ? '🔒' : '🔊';
    const baseName =
      customName?.trim() || `Sala de ${owner.displayName || owner.username}`;
    const channelName = `${prefix} ${baseName}`;

    const voiceChannel = (await guild.channels.create({
      name: channelName,
      type: ChannelType.GuildVoice,
      userLimit: limit <= 0 ? 0 : limit,
      parent: categoryId,
      permissionOverwrites,
    })) as VoiceBasedChannel;

    activeRooms.add(voiceChannel.id);
    console.log(
      `[VoiceRoomService] Created temporary voice room ${voiceChannel.name} (${voiceChannel.id}) for owner ${owner.tag}`,
    );

    // Move o dono automaticamente se ele já estiver em algum canal de voz
    let movedOwner = false;
    try {
      const ownerMember = await guild.members.fetch(owner.id);
      if (ownerMember?.voice?.channelId) {
        await ownerMember.voice.setChannel(voiceChannel);
        movedOwner = true;
        console.log(
          `[VoiceRoomService] Owner ${owner.tag} automatically moved to ${voiceChannel.name}`,
        );
      }
    } catch (moveError) {
      console.warn(
        `[VoiceRoomService] Could not move owner ${owner.tag} to voice room:`,
        moveError,
      );
    }

    // Se o dono não foi movido imediatamente, define um timeout de abandono (2 minutos)
    if (!movedOwner) {
      const timer = setTimeout(async () => {
        try {
          const ch = (await guild.channels
            .fetch(voiceChannel.id)
            .catch(() => null)) as VoiceBasedChannel | null;
          if (ch && ch.members.size === 0) {
            console.log(
              `[VoiceRoomService] Room ${ch.name} (${ch.id}) was abandoned without participants. Deleting...`,
            );
            await VoiceRoomService.deleteRoom(ch);
          }
        } catch (err) {
          console.error(
            `[VoiceRoomService] Error running abandonment cleanup for ${voiceChannel.id}:`,
            err,
          );
        }
      }, 120_000);

      abandonmentTimers.set(voiceChannel.id, timer);
    }

    return { channel: voiceChannel, movedOwner };
  },

  /**
   * Exclui um canal de voz temporário e remove do rastreamento.
   */
  async deleteRoom(
    channel: VoiceBasedChannel | AnyThreadChannel | null,
  ): Promise<void> {
    if (!channel || !('delete' in channel)) return;

    VoiceRoomService.cancelAbandonmentTimer(channel.id);
    activeRooms.delete(channel.id);

    try {
      await channel.delete(
        'Sala temporária vazia encerrada automaticamente pelo bot.',
      );
      console.log(
        `[VoiceRoomService] Voice room ${channel.name} (${channel.id}) deleted successfully.`,
      );
    } catch (error) {
      console.error(
        `[VoiceRoomService] Failed to delete voice room ${channel.id}:`,
        error,
      );
    }
  },
};
