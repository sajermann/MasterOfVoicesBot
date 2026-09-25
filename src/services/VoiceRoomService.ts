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

// Stores active temporary voice channel IDs managed by the bot
const activeRooms = new Set<string>();

// Stores abandonment timeouts (in case no one joins the newly created room)
const abandonmentTimers = new Map<string, NodeJS.Timeout>();

// Stores room creation drafts per user
const userDrafts = new Map<string, RoomCreationDraft>();

export const VoiceRoomService = {
  /**
   * Retrieves or initializes the room configuration draft for a user.
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
   * Updates capacity limit in user's draft.
   */
  updateDraftLimit(userId: string, limit: number): RoomCreationDraft {
    const draft = VoiceRoomService.getDraft(userId);
    draft.limit = limit;
    draft.updatedAt = Date.now();
    userDrafts.set(userId, draft);
    return draft;
  },

  /**
   * Updates invited members list in user's draft.
   */
  updateDraftMembers(userId: string, memberIds: string[]): RoomCreationDraft {
    const draft = VoiceRoomService.getDraft(userId);
    draft.memberIds = memberIds;
    draft.updatedAt = Date.now();
    userDrafts.set(userId, draft);
    return draft;
  },

  /**
   * Updates custom name in user's draft.
   */
  updateDraftName(userId: string, name?: string): RoomCreationDraft {
    const draft = VoiceRoomService.getDraft(userId);
    draft.customName = name?.trim() || undefined;
    draft.updatedAt = Date.now();
    userDrafts.set(userId, draft);
    return draft;
  },

  /**
   * Clears user draft after confirmation or cancellation.
   */
  clearDraft(userId: string): void {
    userDrafts.delete(userId);
  },

  /**
   * Checks if the provided channel or ID belongs to a temporary room.
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
   * Cancels abandonment timer if a user joins the room.
   */
  cancelAbandonmentTimer(channelId: string): void {
    const timer = abandonmentTimers.get(channelId);
    if (timer) {
      clearTimeout(timer);
      abandonmentTimers.delete(channelId);
    }
  },

  /**
   * Cleans up all empty temporary rooms on bot startup
   * and resumes tracking for those that still have active members.
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
              // Room still has participants: re-add to activeRooms
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
   * Creates a temporary voice channel (public or private) with restricted permissions.
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

    // Filter allowed members without duplicating owner
    const allowedMembers = Array.from(
      new Set(memberIds.filter(id => id !== owner.id)),
    );

    const permissionOverwrites = [];

    if (isPrivate) {
      // Private Room:
      // 1. @everyone: denies view and connect
      // 2. Room owner: allows view, connect, speak, and move members
      // 3. Selected members: allows view, connect, and speak
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
      // Open / Public Room:
      // 1. @everyone: allows view, connect, and speak
      // 2. Room owner: allows view, connect, speak, and move members
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

    // Automatically move owner if they are already in a voice channel
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

    // If owner was not moved immediately, set abandonment timeout (2 minutes)
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
   * Deletes a temporary voice channel and removes it from tracking.
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
