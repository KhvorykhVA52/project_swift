/* eslint-env node */
const { configure } = require('quasar/wrappers');

module.exports = configure((ctx) => ({
  // Boot files
  boot: ['axios'],

  // Global CSS
  css: ['app.scss'],

  // Extras
  extras: [
    'roboto-font',
    'material-icons'
  ],

  // Build configuration
  build: {
    target: {
      browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
      node: 'node20'
    },

    vueRouterMode: 'history',
    
    env: {
      API_ENDPOINT: ctx.dev
        ? 'http://localhost:3000'
        : 'https://your-domain.ru'
    },

    vitePlugins: [
      [
        'vite-plugin-checker',
        {
          vueTsc: { tsconfigPath: 'tsconfig.vue-tsc.json' },
          eslint: { lintCommand: 'eslint "./**/*.{js,ts,mjs,cjs,vue}"' }
        },
        { server: false }
      ]
    ]
  },

  // Dev server
  devServer: {
    open: true
  },

  // Framework configuration
  framework: {
    config: {},
    plugins: ['Notify', 'Dialog']
  },

  // Animations
  animations: [],

  // SSR configuration
  ssr: {
    pwa: false,
    prodPort: 3000,
    middlewares: ['render']
  },

  // PWA configuration
  pwa: {
    workboxMode: 'generateSW',
    injectPwaMetaTags: true,
    swFilename: 'sw.js',
    manifestFilename: 'manifest.json'
  },

  // Capacitor configuration
  capacitor: {
    hideSplashscreen: true
  },

  // Electron configuration
  electron: {
    inspectPort: 5858,
    bundler: 'packager',
    builder: {
      appId: 'frontend'
    }
  }
}));