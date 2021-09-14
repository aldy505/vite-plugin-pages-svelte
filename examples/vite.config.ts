import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import pagesPlugin from 'vite-plugin-pages-svelte';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), pagesPlugin()],
});
