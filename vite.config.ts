/// <reference types="vitest" />
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => ({
  plugins: [
    tailwindcss(),
    // Only use React Router plugin in non-test mode
    ...(mode !== "test" ? [reactRouter()] : []),
    tsconfigPaths(),
  ],
  server: {
    port: 3000,
    strictPort: true,
  },
  preview: {
    port: 3000,
    strictPort: true,
  },
  optimizeDeps: {
    include: ["react-router", "react-router-dom"],
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setup/vitest.setup.ts",
    css: true,
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules", "dist", "build"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "tests/",
        "**/*.d.ts",
        "**/*.test.{ts,tsx}",
        "**/*.config.{ts,js}",
        "app/routes/",
        "app/root.tsx",
        "public/",
        "build/",
        "dist/",
        // Exclude index files that only re-export components
        "**/index.ts",
        "**/index.tsx",
      ],
    },
    server: {
      deps: {
        inline: ["react-router", "@react-router/dev"],
      },
    },
    deps: {
      optimizer: {
        web: {
          include: ["react-remove-scroll", "tslib"],
        },
      },
    },
  },
}));
