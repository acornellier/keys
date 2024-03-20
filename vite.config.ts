import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/leaflet/')) return 'leaflet'

          if (
            id.includes('node_modules/yjs/') ||
            id.includes('node_modules/y-protocols/') ||
            id.includes('node_modules/y-webrtc/') ||
            id.includes('node_modules/simple-peer/') ||
            id.includes('node_modules/lib0/')
          )
            return 'collab'

          const mdtDungeonMatch = id.match(/mdtDungeons\/(.+_mdt).json/)
          if (mdtDungeonMatch) return mdtDungeonMatch[1]
        },
      },
    },
  },
})
