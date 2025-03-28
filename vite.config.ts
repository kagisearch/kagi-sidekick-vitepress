import path from "path";
import { defineConfig } from "vite";

export default defineConfig(async () => {
  const { viteStaticCopy } = await import("vite-plugin-static-copy");

  return {
    plugins: [
      viteStaticCopy({
        targets: [
          {
            src: "src/module",
            dest: "./",
          },
          {
            src: "src/Search.vue",
            dest: "./",
          },
          {
            src: "src/flex-logo.svg",
            dest: "./",
          },
        ],
      }),
    ],
    build: {
      lib: {
        entry: path.resolve(__dirname, "src/index.ts"),
        name: "SearchPlugin",
        fileName: (format: string) =>
          format == "es"
            ? `vitepress-plugin-search.${format}.mjs`
            : `vitepress-plugin-search.${format}.js`,
      },
      rollupOptions: {
        // make sure to externalize deps that shouldn't be bundled
        // into your library
        external: ["vue", "vite", "markdown-it", "fs/promises"],
        output: {
          // Provide global variables to use in the UMD build
          // for externalized deps
          globals: {
            vue: "Vue",
          },
        },
      },
    },
  };
});