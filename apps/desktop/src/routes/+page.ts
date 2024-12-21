import type { Load } from "@sveltejs/kit";
import { load as tauriLoad } from "@tauri-apps/plugin-store";

export const load: Load = async () => {
  const store = await tauriLoad("keys.json", { autoSave: true });
  return { store };
};
