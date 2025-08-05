// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // 开发模式优化
  devtools: { enabled: true },

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
      title: 'VideoH5 - YouTube Style Video Platform',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'VideoH5 - Discover amazing video content, connect creators with audiences, and build a premium video sharing platform' },
        { name: 'keywords', content: 'video, streaming, sharing, platform, VideoH5' },
        { name: 'author', content: 'VideoH5 Team' },
        { name: 'robots', content: 'index, follow' },
        { name: 'theme-color', content: '#ff6699' },
        { property: 'og:title', content: 'VideoH5 - YouTube Style Video Platform' },
        { property: 'og:description', content: 'Discover amazing video content, connect creators with audiences, and build a premium video sharing platform' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://videoh5.com' },
        { property: 'og:image', content: '/images/og-image.jpg' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'VideoH5 - YouTube Style Video Platform' },
        { name: 'twitter:description', content: 'Discover amazing video content, connect creators with audiences, and build a premium video sharing platform' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' },
        { rel: 'stylesheet', href: 'https://cdn.plyr.io/3.7.8/plyr.css' }
      ],
      script: [
        {
          src: 'https://cdn.plyr.io/3.7.8/plyr.js',
          defer: true
        }
      ]
    }
  },

  // 运行时配置
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:3000'
    }
  },

  // 开发服务器配置
  devServer: {
    port: 3000,
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
