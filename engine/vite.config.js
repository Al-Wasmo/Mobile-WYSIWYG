import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import topLevelAwait from "vite-plugin-top-level-await";
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({

  plugins: [
    tailwindcss(),
    topLevelAwait({
      promiseExportName: "__tla",
      promiseImportName: i => `__tla_${i}`
    }),
    react(
      {
        babel: {
          presets: ['jotai/babel/preset'],
        },
      }
    ),
  ],
})
