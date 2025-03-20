import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  optimizeDeps: {
    include: ['@opentiny/vue-search-box']
  },
  build: {
    cssCodeSplit: true, // 分离 CSS 文件
    lib: {
      entry: 'packages/search-box/index.ts',
      name: '@opentiny/vue-search-box',
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  plugins: [vue()]
});
