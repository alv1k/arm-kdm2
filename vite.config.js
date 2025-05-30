import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// Плагин для изменения расширения выходных файлов
const renameJsxToJs = {
  name: 'rename-jsx-to-js',
  generateBundle(options, bundle) {
    for (const file in bundle) {
      if (file.endsWith('.jsx')) {
        const newFileName = file.replace(/\.jsx$/, '.js');
        bundle[newFileName] = bundle[file];
        delete bundle[file];
      }
    }
  },
};
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    renameJsxToJs
  ],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'https://cloud.aokdm.ru/method',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
  },
});
