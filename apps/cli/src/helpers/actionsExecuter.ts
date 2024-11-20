import type { ApiKey, Config } from '@shared/types';
import { errorExit, logger } from '@utils/general';
import axios, { AxiosError } from 'axios';

export class ActionsExecuter {
  config: Config;
  constructor(config: Config) {
    this.config = config;
  }
  async verifyKey() {
    try {
      const { data } = await axios<ApiKey>(`${this.config.host}/info/key-info/${this.config.key}`);
      if (new Date() >= new Date(data.expiresAt)) errorExit('Key expired');
      logger().info(`Key name : ${data.name}  , Manipulated store : ${data.storeId} , Key permissions : ${data.permissions.join(',')}`);
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status == 404) errorExit('Key not found');
      else errorExit('Something went wrong');
    }
  }
}
