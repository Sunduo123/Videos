import VueLazyload from 'vue-lazyload'

export default defineNuxtPlugin((nuxtApp) => {
  // 防止重复注册插件
  if (nuxtApp.vueApp._context.provides.lazyload) {
    return
  }

  // 标记插件已注册
  nuxtApp.vueApp._context.provides.lazyload = true

  nuxtApp.vueApp.use(VueLazyload, {
    preLoad: 1.3,
    error: 'https://picsum.photos/320/200?random=error',
    loading: 'https://picsum.photos/320/200?random=loading',
    attempt: 3,
    lazyComponent: true,
    observer: true,
    observerOptions: {
      rootMargin: '0px',
      threshold: 0.1
    },
    errorHandler: (err, src, type) => {
      console.warn('Image load failed:', src, err)
    }
  })
})
