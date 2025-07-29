import VueLazyload from 'vue-lazyload'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueLazyload, {
    preLoad: 1.3,
    error: 'https://picsum.photos/320/200?random=error',
    loading: 'https://picsum.photos/320/200?random=loading',
    attempt: 1,
    lazyComponent: true,
    observer: true,
    observerOptions: {
      rootMargin: '0px',
      threshold: 0.1
    }
  })
}) 