import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@config": resolve(__dirname, "src/config"),
      "@modules": resolve(__dirname, "src/modules"),
      "@shared": resolve(__dirname, "src/shared"),
      "@types-local": resolve(__dirname, "src/shared/types"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts", "tests/**/*.test.ts"],
  },
});
