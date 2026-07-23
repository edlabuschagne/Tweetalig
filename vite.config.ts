import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
    hmr: false,
  },
});
