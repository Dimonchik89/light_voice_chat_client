import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
    }),
  ],
  resolve: {
    // alias: {
    //   src: "/src"
    // }
    alias: {
      // "readable-stream": "vite-compatible-readable-stream"
      'events': 'rollup-plugin-node-polyfills/polyfills/events',
    },
  },
  define: {
    global: {}
  }
})
