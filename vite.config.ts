import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, "lib/main.ts"),
      name: "VuePincher",
      fileName: "vue-pincher",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
