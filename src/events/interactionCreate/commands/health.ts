import { type ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import { DevServices } from '../../../services/DevServices';
import {
  scheduleAutoDelete,
  withAutoDeleteNotice,
} from '../../../utils/scheduleAutoDelete';

export async function handleHealthCommand(
  interaction: ChatInputCommandInteraction,
): Promise<void> {
  const discordUserId = interaction.user.id;
  const discordDisplayName = interaction.user.displayName;

  console.log(
    `[SlashCommand: health] Request started by user: ${discordDisplayName} (${discordUserId})`,
  );

  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  try {
    const healthData = await DevServices.getHealth();

    if (!healthData) {
      console.warn(
        `[SlashCommand: health] Finished - unable to retrieve health data for user: ${discordDisplayName} (${discordUserId})`,
      );
      await interaction.editReply({
        content: withAutoDeleteNotice(
          'Não foi possível obter os dados de status do sistema.',
        ),
      });
      scheduleAutoDelete(interaction);
      return;
    }

    const formattedJson = JSON.stringify(healthData, null, 2);
    await interaction.editReply({
      content: withAutoDeleteNotice(`\`\`\`json\n${formattedJson}\n\`\`\``),
    });
    scheduleAutoDelete(interaction);
    console.log(
      `[SlashCommand: health] Finished - health status delivered successfully to user: ${discordDisplayName} (${discordUserId})`,
    );
  } catch (error) {
    console.error(
      `[SlashCommand: health] Finished with error for user: ${discordDisplayName} (${discordUserId}):`,
      error,
    );
    const message =
      error instanceof Error ? error.message : 'Erro desconhecido.';
    await interaction.editReply({
      content: withAutoDeleteNotice(
        `Erro ao verificar status do sistema: ${message}`,
      ),
    });
    scheduleAutoDelete(interaction);
  }
}
