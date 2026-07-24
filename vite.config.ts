import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'process.env': {},
    'process.platform': JSON.stringify(process.platform),
    'process.version': JSON.stringify(process.version),
    global: 'globalThis',
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        // Not: React'e bağımlı kütüphaneleri (quill, radix, react-query, react-router)
        // isim eşleşmesiyle ayrı chunk'lara zorlamak, React ile aralarında dairesel
        // modül bağımlılığı oluşturup production build'de "Cannot read properties of
        // undefined (reading 'Component')" hatasına yol açabiliyor (dev sunucusunda
        // görünmez, sadece gerçek build çıktısında ortaya çıkar). Sadece React'e
        // bağımlı OLMAYAN, tamamen bağımsız kütüphaneleri manuel ayırıyoruz;
        // geri kalanını React.lazy() sınırlarına göre Rollup kendisi ayırıyor.
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('@sentry')) return 'sentry';
          if (id.includes('date-fns')) return 'date-fns';
        },
      },
    },
  },
  server: {
    port: 3001,
    strictPort: true,
    host: true,
    hmr: {
      overlay: false
    }
  },
  optimizeDeps: {
    include: ['react-quill']
  }
});
