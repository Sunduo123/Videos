import VueLazyload from 'vue-lazyload'

export default defineNuxtPlugin((nuxtApp) => {
  // 简化的重复注册检查
  if (nuxtApp.vueApp.config.globalProperties.$Lazyload) {
    return
  }

  // 使用最基础的配置
  nuxtApp.vueApp.use(VueLazyload, {
    preLoad: 3.0, // 大幅增加预加载距离，提前加载更多内容
    error: '/images/video-placeholder.svg',
    loading: '/images/video-placeholder.svg',
    attempt: 2, // 减少重试次数，加快失败处理
    observer: true,
    observerOptions: {
      rootMargin: '300px', // 大幅增加根边距，提前触发加载
      threshold: 0.01 // 降低阈值，更早触发
    },
    throttleWait: 50, // 减少节流时间，更快响应
    listenEvents: ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend', 'touchmove']
    // 移除延迟，立即加载
  })
})
