import { Plugin } from 'vite';
import { buildSync } from 'esbuild';
import { join } from "node:path";

export function buildServiceWorker(mode: string, env: Record<string, string>): Plugin | undefined {
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