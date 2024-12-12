import axios, { type AxiosInstance } from 'axios';
import { readdir } from 'fs/promises';
import Path from 'path';
import fsExtra from 'fs-extra';
import type { ApiInfo, ApiKey, ConfigJson, FileEntry, TracksJson } from '@shared/types.js';
import { pathToFile, byteToMega, errorExit, getFileInfo, loadJson, logger, validateSchema } from '@shared/utils.js';
import { tracksSchema } from '@shared/zodSchemas.js';

export class ActionsExecuter {
  private config: ConfigJson;
  private tracks: TracksJson['tracks'] = [];
  private apiInfo: ApiInfo = {
    MAX_FILE_SIZE: -1,
    RATE_LIMITS: -1,
    RATE_WINDOW: -1,
  };
  private tracking = false;
  private axios: AxiosInstance;

  constructor(config: ConfigJson) {
    this.config = config;
    this.axios = axios.create({
      baseURL: config.host,
      headers: { Authorization: `bearer ${config.key}` },
    });
  }

  async loadTrackingFile() {
    if (!this.config.trackingFile) return;
    const json = await loadJson(this.config.trackingFile, 'Tracking');
    const parsedTracks = validateSchema<TracksJson>(json, tracksSchema);
    this.tracking = true;
    this.tracks = parsedTracks.tracks;
    await this.refreshTrackedFiles();
  }

  async flashTracks() {
    if (!this.tracking) return;
    await fsExtra.writeFile(this.config.trackingFile!, JSON.stringify({ tracks: this.tracks }));
  }

  async verifyKey() {
    logger().info('Verifying the api key');
    try {
      const { data } = await this.axios.get<ApiKey>(`/info/key-info/${this.config.key}`);
      if (new Date() >= new Date(data.expiresAt)) {
        errorExit('Key expired');
      }
      logger().success(`Key name: ${data.name}, Store: ${data.storeId}, Permissions: ${data.permissions.join(', ')}`);
    } catch (error) {
      this.handleError(error, 'Verifying api key');
    }
  }

  async fetchApiInfo() {
    logger().info('Fetching api key information');
    try {
      const { data } = await this.axios.get<ApiInfo>('/info/api-info');
      logger().success(`Rate Limits: ${data.RATE_LIMITS}, Window: ${data.RATE_WINDOW}ms, Max File Size: ${data.MAX_FILE_SIZE}MB`);
      this.apiInfo = data;
    } catch (error) {
      this.handleError(error, 'Fetching api info');
    }
  }

  async execute() {
    const { actions } = this.config;
    for (const actionName in actions) {
      logger().info(`Executing ${actionName}`);
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
          case 'backup':
            await this.backup(actionContext.data);
            break;
        }
        logger().success(`${actionName} executed successfully`);
      } catch (error) {
        logger().error(`${actionName} failed`);
        this.handleError(error, actionName);
      }
    }
  }

  private async backup(data: { path: string; isPublic: boolean; tags: string[] }) {
    if (!this.tracking) {
      throw new Error('Tracking file is not specified, skipping the action...');
    }

    const { path, isPublic, tags } = data;
    if (!(await fsExtra.exists(path))) {
      throw new Error(`Directory does not exist: ${path}`);
    }

    const entries = await readdir(path, { withFileTypes: true }).then((entry) =>
      entry.filter((el) => el.isFile()).map((el) => Path.join(path, el.name)),
    );

    const relatedTracks = this.tracks.filter((el) => el.path.startsWith(path));

    const { deletedTracks, newTracks } = this.diffRemoteLocal(relatedTracks, entries);

    await this.backupDeletes(deletedTracks);
    await this.backupInserts(newTracks, isPublic, tags);
  }

  private async createDir(data: { path: string; isPublic: boolean; tags: string[] }) {
    const { path, isPublic, tags } = data;
    if (!(await fsExtra.exists(path))) {
      throw new Error(`Directory does not exist: ${path}`);
    }

    const entries = await readdir(path, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile()) {
        const fullPath = Path.join(path, entry.name);
        await this.createFile({ path: fullPath, isPublic, tags });
        logger().success(`${fullPath} created successfully`);
      }
    }
  }

  private async createFile(data: { path: string; isPublic: boolean; tags: string[] }) {
    const { path, isPublic, tags } = data;

    if (!(await fsExtra.exists(path))) {
      throw new Error(`File does not exist: ${path}`);
    }

    const stat = await getFileInfo(path);
    if (byteToMega(stat.size) > this.apiInfo.MAX_FILE_SIZE) {
      throw new Error(`File exceeds maximum size: ${path}`);
    }

    const formData = new FormData();
    const file = await pathToFile(path, stat.fileName, stat.mimeType);
    formData.append('file', file);
    formData.append('isPublic', String(isPublic));
    tags.forEach((tag) => formData.append('tags', tag));

    const { data: entry } = await this.axios.post<FileEntry>('/files/create', formData);
    return entry;
  }

  private async updateFile(data: { id: string; path?: string; name?: string; tags?: string[] }) {
    const { id, path, name, tags } = data;

    if (!path && !tags && !name) {
      throw new Error('At least one file property must be updated');
    }

    const formData = new FormData();

    if (path) {
      if (!(await fsExtra.exists(path))) {
        throw new Error(`File does not exist: ${path}`);
      }

      const stat = await getFileInfo(path);
      if (byteToMega(stat.size) > this.apiInfo.MAX_FILE_SIZE) {
        throw new Error('File exceeds maximum allowed size');
      }

      const file = await pathToFile(path, stat.fileName, stat.mimeType);
      formData.append('file', file);
    }

    if (name) formData.append('name', name);
    if (tags) tags.forEach((tag) => formData.append('tags', tag));

    await this.axios.put(`/files/update/${id}`, formData);
  }

  private async deleteFile(data: { id: string }) {
    await this.axios.delete(`/files/delete/${data.id}`);
  }

  private async refreshTrackedFiles() {
    const updatedTracks = [];
    for (const track of this.tracks) {
      try {
        const { data } = await this.axios.get<{ exists: boolean }>(`/files/search/${track.id}`);
        if (data.exists) {
          updatedTracks.push(track);
        }
      } catch (error) {
        this.handleError(error, 'Refreshing tracked files');
      }
    }
    this.tracks = updatedTracks;
  }

  private diffRemoteLocal(remote: TracksJson['tracks'], local: string[]) {
    return {
      newTracks: local.filter((path) => !remote.find((el) => el.path === path)),
      deletedTracks: remote.filter((track) => !local.includes(track.path)),
    };
  }

  private async backupDeletes(deletedTracks: TracksJson['tracks']) {
    logger().info('1-Syncing deletes');
    for (const track of deletedTracks) {
      await this.deleteFile({ id: track.id });
      this.tracks = this.tracks.filter((el) => el.id !== track.id);
      logger().success(`${track.path} deleted successfully`);
    }
  }

  private async backupInserts(newTracks: string[], isPublic: boolean, tags: string[]) {
    logger().info('2-Syncing inserts');
    for (const track of newTracks) {
      const { id } = await this.createFile({ path: track, isPublic, tags });
      this.tracks.push({ id, path: track });
      logger().success(`${track} created successfully`);
    }
  }

  private handleError(error: unknown, action: string) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const errorMap: Record<number, string> = {
        500: 'Service unavailable',
        403: `Insufficient permissions for ${action}`,
        404: `Resource not found for ${action}`,
        429: `Rate limits reached during ${action}`,
        400: `Api validation error during ${action}`,
      };
      logger().error(errorMap[status] || `API error during ${action}`);
    } else if (error instanceof Error) {
      logger().error(`Error during ${action}: ${error.message}`);
    } else {
      logger().error(`Unexpected error during ${action}`);
    }
  }
}
