import { defineConfig, loadEnv  } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());
    return {
        base: '',
        plugins: [react(), viteTsconfigPaths()],
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
            },
        },
    }
})