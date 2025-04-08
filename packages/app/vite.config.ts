import { defineConfig, loadEnv, Plugin  } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import { buildSync } from 'esbuild';
import { join } from "node:path";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());
    console.log('HELLO', mode, JSON.stringify(env, null, 2));
    return {
        base: '',
        plugins: [
            react(),
            viteTsconfigPaths(),
            buildServiceWorker(mode, env),
        ],
        server: {    
            open: true,
            port: 3000,
            proxy: {
                '/api': {
                    target: env.VITE_APP_PROXY_TARGET,
                    rewrite: (path) => path.replace(/^\/api/, '/'),
                    changeOrigin: true,
                    secure: false,
                },
            }
        }
    }
})

function buildServiceWorker(mode: string, env: Record<string, string>): Plugin | undefined {
    if (!env.VITE_APP_DEMO) {
        return;
    }

    const outfile = mode === 'production' ? join(process.cwd(), "dist", "service-worker.js") : join(process.cwd(), "service-worker.js");

    return {
        name: 'hm-sw-build',
        enforce: "pre",
        transformIndexHtml() {
            buildSync({
                minify: true,
                bundle: true,
                entryPoints: [join(process.cwd(), "src/serviceWorker/worker.ts")],
                outfile,
            });
        },
    };
} 
