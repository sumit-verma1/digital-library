import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/auth': 'http://localhost:8080',
      '/student': 'http://localhost:8080',
      '/book': 'http://localhost:8080',
      '/txn': 'http://localhost:8080',
      '/admin': 'http://localhost:8080'
    }
  }
});
