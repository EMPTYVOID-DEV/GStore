import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({ fallback: "200.html" }),
    alias: {
      $components: "./src/lib/components",
      $icons: "./src/lib/icons",
      $shared: "./src/lib/shared",
    },
  },
};

export default config;
