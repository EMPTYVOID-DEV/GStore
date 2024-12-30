import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter(),
    outDir: "build",
    alias: {
      $components: "./src/lib/components",
      $icons: "./src/lib/icons",
      $shared: "./src/lib/shared",
    },
  },
};

export default config;
