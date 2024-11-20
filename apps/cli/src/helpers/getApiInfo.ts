import type { ApiInfo } from '@shared/types';
import { logger } from '@utils/general';
import axios from 'axios';

export async function getApiInfo(host: string) {
  const res = await axios<ApiInfo>(`${host}/info/api-info`);
  logger().info(
    `Rate limits : ${res.data.RATE_LIMITS} , Rate Limits window : ${res.data.RATE_WINDOW} MS, Max file size : ${res.data.MAX_FILE_SIZE} MB`,
  );
}
