import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: "0.0.0.0", // Allow external connections
    open: true,
    hmr: {
      port: 3000,
      host: "localhost",
      // Use nginx port in dockerized env; otherwise default to dev server port
      clientPort: Number(process.env.VITE_HMR_CLIENT_PORT || 3000),
    },
    watch: {
      usePolling: true, // Use polling for Docker environments
    },
  },
  build: {
    outDir: "build",
    sourcemap: true,
    chunkSizeWarningLimit: 1000, // Increase warning limit to 1MB
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          "react-vendor": ["react", "react-dom"],
          "router-vendor": ["react-router-dom"],
          "animation-vendor": ["framer-motion"],
          "ui-vendor": [
            "react-icons",
            "@fortawesome/free-solid-svg-icons",
            "@fortawesome/react-fontawesome",
          ],
          "syntax-vendor": ["prismjs"],
          // Note: add a utils chunk here only when needed to avoid empty chunks
        },
      },
    },
    // Optimize dependencies
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "framer-motion"],
    exclude: ["three"], // Exclude unused Three.js
  },
});
