import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
    root: '.',
    publicDir: false,
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                'lpdf-demo': resolve(__dirname, 'src/demo.ts'),
            },
            external: (id) => /[/\\](pdf\.min|pdf\.worker\.min|browser|lpdf-web|lpdf_bg)\.(mjs|js|wasm)$/.test(id),
            output: {
                entryFileNames: '[name].js',
            },
        },
    },
    server: {
        port: 3001,
        allowedHosts: ['localhost'],
    },
});
