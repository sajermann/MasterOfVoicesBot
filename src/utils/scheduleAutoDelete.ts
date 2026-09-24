export interface DeletableInteraction {
  deleteReply: () => Promise<unknown>;
}

/**
 * Returns the default delay in milliseconds for common messages,
 * reading from process.env.MS_DELETE_COMMON_MESSAGE with fallback to 15000.
 */
export function getCommonDeleteTimeout(): number {
  return Number(process.env.MS_DELETE_COMMON_MESSAGE) || 15000;
}

/**
 * Returns the delay in milliseconds for stats messages,
 * reading from process.env.MS_DELETE_STATS_MESSAGE with fallback to 60000.
 */
export function getStatsDeleteTimeout(): number {
  return Number(process.env.MS_DELETE_STATS_MESSAGE) || 60000;
}

/**
 * Appends a self-destruct notice to the message content in italics with an icon.
 */
export function withAutoDeleteNotice(content: string, ms?: number): string {
  const timeoutMs = ms ?? getCommonDeleteTimeout();
  const seconds = Math.round(timeoutMs / 1000);
  return `${content}\n\n*⏳ Esta mensagem será apagada em ${seconds} segundos.*`;
}

/**
 * Schedules an interaction reply to be deleted after a specified delay.
 * Defaults to process.env.MS_DELETE_COMMON_MESSAGE (or 15000ms).
 */
export function scheduleAutoDelete(
  interaction: DeletableInteraction,
  ms?: number,
): void {
  const timeoutMs = ms ?? getCommonDeleteTimeout();

  setTimeout(async () => {
    try {
      await interaction.deleteReply();
    } catch {
      // Ignore error if message was already deleted by the user
    }
  }, timeoutMs);
}
