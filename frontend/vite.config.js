import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite is the build tool that serves our React app during development
// and bundles it into static files for production.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
