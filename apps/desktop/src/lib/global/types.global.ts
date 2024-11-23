import type { apiKeyTable, storeTable } from "$server/database/schema";

export type Store = typeof storeTable.$inferSelect;

export type ApiKey = typeof apiKeyTable.$inferSelect;

export type Permissions =
  | "create"
  | "read"
  | "delete"
  | "update"
  | "list-files"
  | "apply-transformation";

export type Operations =
  | "create"
  | "read"
  | "delete"
  | "update"
  | "apply-transformation";

export type ActionStatus = {
  state: "valid" | "invalid";
  errorMsg: string;
};
