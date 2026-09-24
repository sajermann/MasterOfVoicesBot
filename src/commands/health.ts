import { SlashCommandBuilder } from 'discord.js';

export const healthCommand = new SlashCommandBuilder()
  .setName('health')
  .setDescription('Exibe o status de saúde e conectividade do sistema');
