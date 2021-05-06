import colors from 'vuetify/es5/util/colors';

// path
const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
const baseDir = process.env.BASE_DIR || '/';
const basePath = baseUrl + baseDir;
// meta
const lang = 'ja';
const siteName = 'パンプラージュ';
const siteDesc =
  '静岡大学生向けアプリ「Pin Plage」、静大生の快適なキャンパスライフを支援するサービスです。';
const siteKeywords = '静岡大学,浜松キャンパス,パンプラージュ,PinPlage';
const imgPath =
  'https://firebasestorage.googleapis.com/v0/b/mcaexpf-2020.appspot.com/o/icon%2Fpinplage%2Ficon.png?alt=media&token=93b9369b-cab4-4818-980a-ecad1953ef13';

export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'universal',
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    htmlAttrs: {
      prefix: 'og: http://ogp.me/ns#',
      lang,
    },
    titleTemplate: 'パンプラージュ',
    title: 'パンプラージュ' || '',
    meta: [
      {
        charset: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
      // SEO関連
      { hid: 'description', name: 'description', content: siteDesc },
      { hid: 'keywords', name: 'keywords', content: siteKeywords },
      // ogp関連
      { hid: 'og:site_name', property: 'og:site_name', content: siteName },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:url', property: 'og:url', content: basePath },
      { hid: 'og:title', property: 'og:title', content: siteName },
      { hid: 'og:description', property: 'og:description', content: siteDesc },
      { hid: 'og:image', property: 'og:image', content: imgPath },
      { name: 'twitter:card', content: 'summary' },
      // pwa iOS
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico',
      },
    ],
  },
  /*
   ** Global CSS
   */
  css: ['@/assets/fontStyles.css', '@/assets/reset.css', '@/assets/pageTransition.css'],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    '@/plugins/firebase.js',
    '@/plugins/localstrage.js',
    '@/plugins/vue-directive-tooltip.js',
    '@/plugins/vue-instantsearch.js',
    '@/plugins/viewer.js',
    '@/plugins/vue-cool-select.js',
    { src: '~/plugins/infiniteloading', ssr: false },
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
    '@nuxtjs/vuetify',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/dotenv',
    '@nuxtjs/pwa',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    parallel: true,
    cache: true,
    transpile: ['vue-instantsearch', 'instantsearch.js/es'],
    extend(config, ctx) {
      config.node = {
        fs: 'empty',
      };
    },
  },
  // TO DO 縦横の固定できてない
  pwa: {
    manifest: {
      name: 'Pin Plage',
      short_name: 'パンプラージュ',
      description:
        '静岡大学生向けアプリ「Pin Plage」、静大生の快適なキャンパスライフを支援するサービスです。',
      title: 'Pin Plage',
      lang: 'ja',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#ffffff',
      orientation: 'portrait',
    },
  },
};
