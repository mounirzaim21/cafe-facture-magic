import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"

export default defineConfig({
  base: "./", // ✅ important pour les chemins relatifs sur Netlify
  plugins: [react()]
})
