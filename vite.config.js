const Path = require('path')
const { default: ResolveAlias } = require('vite-plugin-easy-resolve-alias')
const Vue = require('@vitejs/plugin-vue')

const { defineConfig } = require('vite')

/**
 * https://vitejs.dev/config
 */
const config = defineConfig({
  root: Path.join(__dirname, 'src', 'renderer'),
  publicDir: 'public',
  server: {
    port: 8080,
  },
  open: false,
  build: {
    outDir: Path.join(__dirname, 'build', 'renderer'),
    emptyOutDir: true,
  },
  plugins: [
    ResolveAlias({ '~/': 'src/renderer/' }),
    Vue(),
  ],
})

module.exports = config
