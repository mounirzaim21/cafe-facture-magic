
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 8080,
    host: true, // Expose sur toutes les interfaces réseau
    strictPort: true, // Ne pas chercher un autre port si 8080 est occupé
  },
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
}));
