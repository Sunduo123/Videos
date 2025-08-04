import VueLazyload from 'vue-lazyload'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueLazyload, {
    preLoad: 1.3,
    error: 'https://picsum.photos/320/200?random=error',
    loading: 'https://picsum.photos/320/200?random=loading',
    attempt: 3, // 增加重试次数从1到3
    lazyComponent: true,
    observer: true,
    observerOptions: {
      rootMargin: '0px',
      threshold: 0.1
    },
    // 添加自定义错误处理
    errorHandler: (err, src, type) => {
      console.warn('Image load failed:', src, err)
    }
  })
})
