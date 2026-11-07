import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2022",
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("@react-three") || id.includes("/three/")) return "three-scene";
          if (id.includes("framer-motion")) return "motion-ui";
          if (id.includes("gsap")) return "motion-gsap";
          if (id.includes("lenis")) return "smooth-scroll";
          if (id.includes("/react/") || id.includes("react-dom") || id.includes("scheduler")) return "react-vendor";
        }
      }
    }
  }
});