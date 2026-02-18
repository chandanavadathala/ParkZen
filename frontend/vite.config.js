import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// If you are using Tailwind v3 (most common), keep it simple:
export default defineConfig({
  plugins: [react()],
});
