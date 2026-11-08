import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { contentPlugin } from './compiler/vite-plugin.ts';

export default defineConfig({
  plugins: [react(), contentPlugin()],
  server: {
    port: 5173,
    strictPort: true,
    watch: { ignored: ['**/generated/**', '**/progress/**', '**/.probe/**'] },
  },
  build: { chunkSizeWarningLimit: 2000 },
});
