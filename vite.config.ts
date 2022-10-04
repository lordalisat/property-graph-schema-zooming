import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'
import postcss from './postcss.config.cjs';


// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [svelte(), tsconfigPaths()],
  css:{
    postcss
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        fullGraph: resolve(__dirname, 'pages/fullGraph.html'),
        fullSchema: resolve(__dirname, 'pages/fullSchema.html'),
        inducedSchema: resolve(__dirname, 'pages/inducedSchema.html')
      }
    }
  }
})
