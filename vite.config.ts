import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { compileProgramDemo, compileSimDemos } from './compiler/sim-demos.ts';
import { contentPlugin } from './compiler/vite-plugin.ts';
import { progressApiPlugin } from './server/vite-plugin.ts';

export default defineConfig({
  define: { __SIM_DEMOS__: JSON.stringify(compileSimDemos()), __P8_DEMO_PROBLEM__: JSON.stringify(compileProgramDemo(process.cwd())) },
  plugins: [react(), contentPlugin(), progressApiPlugin()],
  server: {
    port: 5173,
    strictPort: true,
    watch: { ignored: ['**/generated/**', '**/progress/**', '**/.probe/**'] },
  },
  build: {
    chunkSizeWarningLimit: 2000,
    rolldownOptions: { output: { codeSplitting: { groups: [
      { name: 'p8-core', test: /[/\\]sim[/\\]src[/\\]core[/\\]p8(?:-asm)?\.ts$/ },
    ] } } },
  },
});
