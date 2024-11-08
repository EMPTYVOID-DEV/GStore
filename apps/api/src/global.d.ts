/// <reference types="bun-types" />

declare module 'bun' {
  export interface Env {
    NODE_ENV: 'dev' | 'prod' | 'test';
    DB_URL: string;
    PORT: number;
    VER: string;
    MAX_FILE_SIZE: number;
    RATE_WINDOW: number;
    ROOT_DIR: string;
    RATE_LIMITS: number;
  }
}

export {};
