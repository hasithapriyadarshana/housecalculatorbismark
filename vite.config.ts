import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          // Lazy-loaded on demand via dynamic import() — never in the initial bundle
          if (id.includes('html2canvas')) return 'pdf-canvas';
          if (id.includes('jspdf')) return 'pdf';
          if (id.includes('@radix-ui')) return 'radix';
          if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod'))
            return 'forms';
          if (/node_modules[\\/](react|react-dom|scheduler)([\\/]|$)/.test(id))
            return 'react-vendor';
          if (id.includes('recharts')) return 'charts';
          return undefined;
        },
      },
    },
  },
})
