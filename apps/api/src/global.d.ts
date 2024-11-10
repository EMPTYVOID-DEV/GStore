/// <reference types="bun-types" />
import type { EnvType } from '@shared/types.global';

declare module 'bun' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface Env extends EnvType {}
}

export {};
