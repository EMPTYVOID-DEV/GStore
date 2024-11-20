import type { ApiInfo, ApiKey, Config, FileEntry } from '@shared/types';
import { byteToMega, errorExit, logger } from '@shared/utils';
import axios from 'axios';
import ora from 'ora';

export class ActionsExecuter {
  private config: Config;
  private tracks: { id: string; path: string }[] = [];
  private apiInfo: ApiInfo = { MAX_FILE_SIZE: -1, RATE_LIMITS: -1, RATE_WINDOW: -1 };

  constructor(config: Config) {
    this.config = config;
  }

  async verifyKey(): Promise<void> {
    try {
      const { data } = await axios.get<ApiKey>(`${this.config.host}/info/key-info/${this.config.key}`);
      if (new Date() >= new Date(data.expiresAt)) errorExit('Key expired');
      logger().info(`Key name: ${data.name}, Store: ${data.storeId}, Permissions: ${data.permissions.join(',')}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) errorExit('Key not found');
      errorExit('Failed to verify the key');
    }
  }

  async fetchApiInfo(): Promise<void> {
    try {
      const { data } = await axios.get<ApiInfo>(`${this.config.host}/info/api-info`);
      logger().info(`Rate Limits: ${data.RATE_LIMITS}, Window: ${data.RATE_WINDOW}ms, Max File Size: ${data.MAX_FILE_SIZE}MB`);
      this.apiInfo = data;
    } catch {
      errorExit('Failed to fetch API information');
    }
  }

  async execute(): Promise<void> {
    const { actions } = this.config;

    for (const actionName in actions) {
      const spinner = ora(`Executing ${actionName}`).start();
      const actionContext = actions[actionName];

      try {
        switch (actionContext.name) {
          case 'create':
            await this.createFile(actionContext.data);
            break;
          case 'delete':
            await this.deleteFile(actionContext.data);
            break;
          case 'update':
            await this.updateFile(actionContext.data);
            break;
        }

        spinner.succeed(`${actionName} executed successfully`);
      } catch (error) {
        spinner.fail(`${actionName} failed`);
        this.handleError(error, actionName);
      }
    }
  }

  private async createFile(data: { path: string; isPublic: boolean; tags: string[] }): Promise<void> {
    const { path, isPublic, tags } = data;

    const file = Bun.file(path);
    const exists = await file.exists();
    if (!exists) throw new Error(`File not found: ${path}`);
    if (byteToMega(file.size) > this.apiInfo.MAX_FILE_SIZE) throw new Error('File exceeds maximum allowed size');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('isPublic', String(isPublic));
    tags.forEach((tag) => formData.append('tags', tag));

    const { data: fileEntry } = await axios.post<FileEntry>(`${this.config.host}/files/create`, formData, {
      headers: { Authorization: `Bearer ${this.config.key}` },
    });

    this.tracks.push({ path, id: fileEntry.id });
  }

  private async updateFile(data: { id: string; path?: string; name?: string; tags?: string[] }) {
    const { id, path, name, tags } = data;

    if (!path && !tags && !name) throw new Error('You must at least update one of the file informations');

    const formData = new FormData();

    if (path) {
      const file = Bun.file(path);
      const exists = await file.exists();
      if (!exists) throw new Error(`File not found: ${path}`);
      if (byteToMega(file.size) > this.apiInfo.MAX_FILE_SIZE) throw new Error('File exceeds maximum allowed size');
      formData.append('file', file);
    }

    if (name) formData.append('name', name);
    if (tags) tags.forEach((tag) => formData.append('tags', tag));

    await axios.put<FileEntry>(`${this.config.host}/files/update/${id}`, formData, {
      headers: { Authorization: `Bearer ${this.config.key}` },
    });
  }

  private async deleteFile(data: { id: string }): Promise<void> {
    const { id } = data;

    await axios.delete(`${this.config.host}/files/delete/${id}`, {
      headers: { Authorization: `Bearer ${this.config.key}` },
    });

    this.tracks = this.tracks.filter((track) => track.id !== id);
  }

  private handleError(error: unknown, action: string): void {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) logger().error(`Insufficient permissions for ${action}`);
      else if (error.response?.status === 404) logger().error(`Resource not found for ${action}`);
      else if (error.response?.status === 429) logger().error(`Rate limits reached`);
      else logger().error(`API error during ${action}`);
    } else if (error instanceof Error) {
      logger().error(`Error during ${action}: ${error.message}`);
    } else {
      logger().error(`Unexpected error during ${action}`);
    }
  }
}
