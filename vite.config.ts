import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.ELECTRON == 'true' ? './' : '.',
  define: {
    __IS_ELECTRON__: process.env.ELECTRON,
  },
  plugins: [react()],
});
