import { promises } from 'node:fs';
import { resolve } from 'node:path';
import { formatDateAndHour } from '../utils/formatDate';

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

// biome-ignore lint/complexity/noStaticOnlyClass: utility service with static methods
export class DevServices {
  private static restartedAt = formatDateAndHour(new Date());
  private static async getPackageData(): Promise<{
    version: string;
    lastUpdate: string;
  } | null> {
    try {
      const filePath = IS_DEVELOPMENT
        ? resolve(__dirname, '../../package.json')
        : resolve(process.cwd(), 'package.json');
      return JSON.parse(await promises.readFile(filePath, 'utf-8'));
    } catch (error) {
      console.error('[DevServices] Error reading package.json:', error);
      return null;
    }
  }

  static async getHealth() {
    const packageData = await DevServices.getPackageData();
    if (!packageData) return null;

    const config = {
      version: packageData.version,
      updatedAt: formatDateAndHour(new Date(packageData.lastUpdate)),
      restartedAt: DevServices.restartedAt,
      ambient: IS_DEVELOPMENT ? 'Development' : 'Production',
    };

    return {
      ...config,
    };
  }
}
