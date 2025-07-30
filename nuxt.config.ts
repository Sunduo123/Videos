// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // 禁用开发时的manifest缓存
  experimental: {
    payloadExtraction: false
  },

  // 强制清理缓存
  nitro: {
    storage: {
      'dev': {
        driver: 'memory'
      }
    }
  },

  // 模块配置
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],

  // CSS配置
  css: [
    '~/assets/css/main.css',
    'plyr/dist/plyr.css'
  ],

  // 应用配置
  app: {
    head: {
      title: 'VideoHub - YouTube Style Video Platform',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Discover amazing video content, connect creators with audiences, and build a premium video sharing platform' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // 运行时配置
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || 'http://localhost:3000'
    }
  },

  // 构建配置
  build: {
    transpile: ['plyr']
  }
})
