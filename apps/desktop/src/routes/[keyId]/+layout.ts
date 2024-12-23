import type { ApiKey } from "$shared/types";
import { redirect, type Load } from "@sveltejs/kit";
import { load as tauriLoad } from "@tauri-apps/plugin-store";

export const load: Load = async ({ params }) => {
  const { keyId } = params as { keyId: string };
  const keysStore = await tauriLoad("keys.json", { autoSave: true });
  const apiKeys = (await keysStore.get<ApiKey[]>("keys")) || [];
  const targetKey = apiKeys.find((el) => el.id.toString() == keyId);
  if (!targetKey) redirect(303, "/");
  return targetKey;
};
