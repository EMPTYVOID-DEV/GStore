import type { ApiKey } from "$shared/types";
import type { Load } from "@sveltejs/kit";
import { load as tauriLoad } from "@tauri-apps/plugin-store";

export const load: Load = async () => {
  const keysStore = await tauriLoad("keys.json", { autoSave: true });
  const settingsStore = await tauriLoad("settings.json", { autoSave: true });
  const hostUrl = (await settingsStore.get<string>("hostUrl")) || "";
  const apiKeys = (await keysStore.get<ApiKey[]>("keys")) || [];
  return { keysStore, settingsStore, apiKeys, hostUrl };
};

export const prerender = true;

export const ssr = false;
