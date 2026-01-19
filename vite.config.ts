import { defineConfig, loadEnv } from "vite";
import type { Plugin, ViteDevServer } from "vite";
import react from "@vitejs/plugin-react";
import * as os from "node:os";

const DEFAULT_DEV_HOST = "0.0.0.0";
const DEFAULT_DEV_PORT = 5173;

const resolveDevHost = (env: Record<string, string>) =>
  env.DEV_HOST?.trim() || DEFAULT_DEV_HOST;

const resolveDevPort = (env: Record<string, string>) => {
  const candidate = Number(env.DEV_PORT ?? DEFAULT_DEV_PORT);
  return Number.isFinite(candidate) && candidate > 0
    ? candidate
    : DEFAULT_DEV_PORT;
};

const resolveTailscaleIp = (env: Record<string, string>): string | undefined => {
  const configured = env.TAILSCALE_IP?.trim();
  if (configured) {
    return configured;
  }

  const interfaces = os.networkInterfaces();
  const tailscaleInterfaces = interfaces.tailscale0 ?? [];

  for (const iface of tailscaleInterfaces) {
    if (iface?.family === "IPv4" && !iface.internal) {
      return iface.address;
    }
  }

  return undefined;
};

const devBannerPlugin = (
  tailscaleIp: string | undefined,
  port: number
): Plugin => ({
  name: "dev-banner",
  configureServer(server: ViteDevServer) {
    server.httpServer?.once("listening", () => {
      const localUrl = `http://localhost:${port}`;
      if (tailscaleIp) {
        const tailscaleUrl = `http://${tailscaleIp}:${port}`;
        server.config.logger.info(
          `\n  Local:     ${localUrl}\n  Tailscale: ${tailscaleUrl}\n`
        );
        return;
      }

      server.config.logger.info(`\n  Local:     ${localUrl}\n`);
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const fileEnv = loadEnv(mode, process.cwd(), "");
  const env = { ...fileEnv, ...process.env } as Record<string, string>;

  const devHost = resolveDevHost(env);
  const devPort = resolveDevPort(env);
  const tailscaleIp = resolveTailscaleIp(env);
  
  const hmrHost = env.HMR_HOST?.trim() || tailscaleIp; // no localhost fallback
  const clientPortRaw = env.VITE_HMR_CLIENT_PORT?.trim();
  const clientPort = clientPortRaw ? Number(clientPortRaw) : undefined;

  return {
    plugins:
      command === "serve"
        ? [react(), devBannerPlugin(tailscaleIp, devPort)]
        : [react()],
    server:
      command === "serve"
        ? {
            port: devPort,
            host: devHost, // Allow external connections
            open: true,
            hmr: {
              protocol: "ws",
              port: devPort,
              ...(hmrHost ? { host: hmrHost } : {}),
              ...(clientPort && Number.isFinite(clientPort) ? { clientPort } : {}),
            },
            watch: {
              usePolling: true, // Use polling for Docker environments
            },
          }
        : undefined,
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
  };
});
