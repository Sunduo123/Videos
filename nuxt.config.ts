// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // 开发模式优化
  devtools: { enabled: false },

  // 防止重复声明问题
  experimental: {
    renderJsonPayloads: false
  },

  // 构建优化
  build: {
    transpile: []
  },

  // 模块配置
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],

  // CSS配置
  css: [
    '~/assets/css/main.css'
  ],

  // 应用配置
  app: {
    head: {
      title: 'VideoH5 - Let videos connect the world, let creativity have more value',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'VideoH5 - Let videos connect the world, let creativity have more value' },
        { name: 'keywords', content: 'video, streaming, sharing, platform, VideoH5' },
        { name: 'author', content: 'VideoH5 Team' },
        { name: 'robots', content: 'index, follow' },
        { name: 'theme-color', content: '#ff6699' },
        { property: 'og:title', content: 'VideoH5' },
        { property: 'og:description', content: 'Let videos connect the world, let creativity have more value' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://videoh5.com' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'VideoH5' },
        { name: 'twitter:description', content: 'Let videos connect the world, let creativity have more value' },
        // Google Analytics
        { name: 'google-site-verification', content: 'your-google-site-verification-code' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/logo/logo2.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' },
        { rel: 'stylesheet', href: 'https://cdn.plyr.io/3.7.8/plyr.css' }
      ],
      script: [
        {
          src: 'https://cdn.plyr.io/3.7.8/plyr.js',
          defer: true
        },
        // 谷歌广告脚本
        {
          src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-123',
          async: true,
          crossorigin: 'anonymous'
        }
      ]
    }
  },

  // 运行时配置
  runtimeConfig: {
    public: {
      apiBase: process.env.NODE_ENV === 'production'
        ? 'https://videoh5.com'
        : 'http://localhost:3002'
    }
  },

  // 开发服务器配置
  devServer: {
    port: 3002,
    host: '0.0.0.0'
  },

  // 构建配置
  nitro: {
    preset: 'node-server',
    storage: {
      fs: {
        driver: 'fs',
        base: './.nitro/storage'
      }
    },
    routeRules: {
      '/': { prerender: true },
      '/video/**': { ssr: true },
      '/search': { ssr: false },
      '/history': { ssr: false },
      '/favorites': { ssr: false },
      '/_nuxt/**': { headers: { 'Cache-Control': 'public, max-age=31536000' } },
      '/**': {
        headers: {
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'strict-origin-when-cross-origin'
        }
      }
    }
  },

  // 页面配置
  pages: true,

  // 组件配置
  components: {
    dirs: [
      '~/components'
    ]
  },

  // 插件配置
  plugins: [
    '~/plugins/lazyload.client.ts',
    '~/plugins/plyr.client.ts'
  ]
})
