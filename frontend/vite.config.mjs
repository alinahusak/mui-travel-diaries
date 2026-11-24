import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // The backend only allows this origin (CLIENT_URL), so don't fall back to another port
  server: { port: 3000, strictPort: true },
  preview: { port: 3000, strictPort: true },
  test: {
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
  },
});
