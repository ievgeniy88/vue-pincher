import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    environment: "happy-dom",
    include: [
      // Matches vitest tests in any subfolder of 'src' or into 'test/vitest/__tests__'
      // Matches all files with extension 'js', 'jsx', 'ts' and 'tsx'
      "lib/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
    ],
  },
  plugins: [vue(), tsconfigPaths()],
});
