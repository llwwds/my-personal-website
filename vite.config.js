import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  // 相对基路径：dist/index.html 直接双击、放到任意子目录都能打开
  base: './',
  plugins: [react(), viteSingleFile({ removeViteModuleLoader: true })],
  server: {
    host: '127.0.0.1',
    port: 5183,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
    reportCompressedSize: false,
  },
});
