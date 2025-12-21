import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Vercel should serve from '/', so leave BASE_PATH unset there.
  // GitHub Pages (or any subpath deploy) can set BASE_PATH=/repo-name/.
  const base = env.BASE_PATH?.trim() || '/';

  return {
    base,
    plugins: [react()],
    server: {
      port: 3000,
      open: true,
    },
  };
});
