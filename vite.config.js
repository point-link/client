const path = require('path')
const { defineConfig } = require('vite')
const { default: ResolveAlias } = require('vite-plugin-easy-resolve-alias')
const Vue = require('@vitejs/plugin-vue')
const { default: Unocss } = require('unocss/vite')

/**
 * https://vitejs.dev/config
 */
const config = defineConfig({
  root: path.join(__dirname, 'src', 'renderer'),
  publicDir: 'public',
  server: {
    port: 8080,
  },
  open: false,
  build: {
    outDir: path.join(__dirname, 'build', 'renderer'),
    emptyOutDir: true,
  },
  plugins: [
    ResolveAlias({ '~/': 'src/renderer/' }),
    Vue(),
    Unocss({
      configFile: path.join(__dirname, 'src', 'renderer', 'unocss.config.ts'),
    }),
  ],
})

module.exports = config
