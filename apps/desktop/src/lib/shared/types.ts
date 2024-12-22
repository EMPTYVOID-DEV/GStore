export type ActionStatus = {
  state: "valid" | "invalid";
  errorMsg: string;
};

export type Permissions =
  | "create"
  | "read"
  | "delete"
  | "update"
  | "access-metadata"
  | "apply-transformation";

export type ApiKey = {
  name: string;
  expiresAt: string;
  storeId: string;
  permissions: Permissions[];
  id: number;
  key: string;
};
