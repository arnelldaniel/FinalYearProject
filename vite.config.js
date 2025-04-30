import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',  // Explicitly define output directory for production build
    emptyOutDir: true,  // Make sure the 'dist' folder is emptied before new build
  },
});
