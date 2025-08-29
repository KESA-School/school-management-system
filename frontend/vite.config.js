import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  define: {
    'process.env.VITE_API_URL': JSON.stringify(
      process.env.VITE_API_URL ||
        'https://school-management-system-5vbm.onrender.com'
    ),
  },
});
