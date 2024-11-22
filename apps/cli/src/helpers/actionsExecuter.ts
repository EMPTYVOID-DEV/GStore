import axios from 'axios';
import ora from 'ora';
import { readdir } from 'fs/promises';
import Path from 'path';
import fsExtra from 'fs-extra';
import type { ApiInfo, ApiKey, ConfigJson, FileEntry, TracksJson } from '../shared/types.js';
import { pathToFile, byteToMega, errorExit, getFileInfo, loadJson, logger, validateSchema } from '../shared/utils.js';
import { tracksSchema } from '../shared/zodSchemas.js';

export class ActionsExecuter {
  private config: ConfigJson;
  private tracks: TracksJson['tracks'] = [];
  private apiInfo: ApiInfo = { MAX_FILE_SIZE: -1, RATE_LIMITS: -1, RATE_WINDOW: -1 };
  private tracking = false;

  constructor(config: ConfigJson) {
    this.config = config;
  }

  async loadTrackingFile() {
    if (!this.config.trackingFile) return;
    const tracks = await loadJson(this.config.trackingFile, 'Tracking');
    const parsedTracks = validateSchema<TracksJson>(tracks, tracksSchema);
    this.tracking = true;
    this.tracks = parsedTracks.tracks;
  }

  async flashTracks() {
    if (!this.tracking) return;
    const content = JSON.stringify({ tracks: this.tracks });
    await fsExtra.writeFile(this.config.trackingFile!, content);
  }

  async verifyKey(): Promise<void> {
    try {
      const { data } = await axios.get<ApiKey>(`${this.config.host}/info/key-info/${this.config.key}`);
      if (new Date() >= new Date(data.expiresAt)) errorExit('Key expired');
      logger().info(`Key name: ${data.name}, Store: ${data.storeId}, Permissions: ${data.permissions.join(', ')}`);
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
      try {
        const actionContext = actions[actionName];
        switch (actionContext.name) {
          case 'create':
            await this.createFile(actionContext.data);
            break;
          case 'createDir':
            await this.createDir(actionContext.data);
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

  private existsInTracks(path: string): boolean {
    return this.tracking && this.tracks.some((track) => track.path === path);
  }

  private async createDir(data: { path: string; isPublic: boolean; tags: string[]; ignore: string[] }) {
    const { path, isPublic, tags, ignore } = data;

    const exists = await fsExtra.exists(path);
    if (!exists) throw new Error(`Directory does not exist: ${path}`);

    const entries = await readdir(path, { withFileTypes: true });
    for (const entry of entries) {
      if (ignore.includes(entry.name)) continue;

      if (entry.isFile()) {
        const fullPath = Path.join(path, entry.name);
        await this.createFile({ path: fullPath, isPublic, tags });
        logger().success(`\n ${entry.name} created successfully`);
      }
    }
  }

  private async createFile(data: { path: string; isPublic: boolean; tags: string[] }): Promise<void> {
    const { path, isPublic, tags } = data;

    if (this.existsInTracks(path)) throw new Error(`File is already tracked: ${path}`);

    const exists = await fsExtra.exists(path);
    if (!exists) throw new Error(`File does not exist: ${path}`);

    const stat = await getFileInfo(path);
    if (byteToMega(stat.size) > this.apiInfo.MAX_FILE_SIZE) throw new Error(`File exceeds maximum size: ${path}`);

    const formData = new FormData();
    const file = await pathToFile(path, stat.fileName, stat.mimeType);
    formData.append('file', file);
    formData.append('isPublic', String(isPublic));
    tags.forEach((tag) => formData.append('tags', tag));

    const { data: response } = await axios.post<FileEntry>(`${this.config.host}/files/create`, formData, {
      headers: { Authorization: `Bearer ${this.config.key}` },
    });

    this.tracks.push({ path, id: response.id });
  }

  private async updateFile(data: { id: string; path?: string; name?: string; tags?: string[] }) {
    const { id, path, name, tags } = data;

    if (!path && !tags && !name) throw new Error('At least one file property must be updated');

    const formData = new FormData();

    if (path) {
      const exists = await fsExtra.exists(path);
      if (!exists) throw new Error(`File does not exist: ${path}`);

      const stat = await getFileInfo(path);
      if (byteToMega(stat.size) > this.apiInfo.MAX_FILE_SIZE) throw new Error('File exceeds maximum allowed size');

      const file = await pathToFile(path, stat.fileName, stat.mimeType);
      formData.append('file', file);
    }

    if (name) formData.append('name', name);
    if (tags) tags.forEach((tag) => formData.append('tags', tag));

    await axios.put(`${this.config.host}/files/update/${id}`, formData, {
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
      const status = error.response?.status;
      if (status === 403) logger().error(`Insufficient permissions for ${action}`);
      else if (status === 404) logger().error(`Resource not found for ${action}`);
      else if (status === 429) logger().error('Rate limits reached');
      else if (status === 400) {
        const errorMessage = (error.response?.data as { errors: { message: string }[] }).errors.map((err) => err.message).join('\n');
        logger().error(errorMessage);
      } else logger().error(`API error during ${action}`);
    } else if (error instanceof Error) {
      logger().error(`Error during ${action}: ${error.message}`);
    } else {
      logger().error(`Unexpected error during ${action}`);
    }
  }
}
