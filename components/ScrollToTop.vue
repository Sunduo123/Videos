<template>
  <Transition name="scroll-to-top">
    <button
      v-show="showButton"
      @click="scrollToTop"
      class="scroll-to-top-btn"
      :class="{ 'scroll-to-top-btn--hover': isHovered }"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      aria-label="Back to top"
    >
      <svg
        class="scroll-to-top-icon"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="18,15 12,9 6,15"></polyline>
      </svg>
      <span class="scroll-to-top-text">Back to top</span>
    </button>
  </Transition>
</template>

<script setup lang="ts">
const showButton = ref(false)
const isHovered = ref(false)

// 滚动检测
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  showButton.value = scrollTop > 300
}

// 平滑滚动到顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 生命周期钩子
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.scroll-to-top-btn {

  position: fixed;
  bottom: 100px;
  right: 100px;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #ff848e 0%, #ff4757 50%, #ff47a3 100%);
  border: none;
  border-radius: 50%;
  box-shadow: 0 8px 24px rgba(251, 114, 153, 0.2);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.scroll-to-top-btn:hover {

  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(30, 157, 216, 0.3);
  background: linear-gradient(135deg, rgba(251, 114, 153, 0.8) 0%, rgba(107, 201, 255, 0.8) 100%);
}

.scroll-to-top-btn--hover {

  width: 120px;
  border-radius: 28px;
}

.scroll-to-top-icon {

  color: rgb(255, 255, 255);
  transition: all 0.3s ease;
  margin-bottom: 2px;
}

.scroll-to-top-text {
  color: rgb(255, 255, 255);
  font-size: 12px;
  font-weight: 600;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
  white-space: nowrap;
}

.scroll-to-top-btn--hover .scroll-to-top-text {
  opacity: 1;
  transform: translateY(0);
}

.scroll-to-top-btn--hover .scroll-to-top-icon {
  margin-bottom: 4px;
}

/* 动画效果 */
.scroll-to-top-enter-active,
.scroll-to-top-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.scroll-to-top-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

.scroll-to-top-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .scroll-to-top-btn {
    bottom: 20px;
    right: 20px;
    width: 48px;
    height: 48px;
  }

  .scroll-to-top-btn--hover {
    width: 100px;
    border-radius: 24px;
  }

  .scroll-to-top-text {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .scroll-to-top-btn {
    background: linear-gradient(135deg, #ff848e 0%, #ff4757 50%, #ff47a3 100%);
    bottom: 16px;
    right: 16px;
    width: 44px;
    height: 44px;
  }

  .scroll-to-top-btn--hover {
    width: 90px;
    border-radius: 22px;
  }

  .scroll-to-top-icon {
    width: 20px;
    height: 20px;
    color: rgb(255, 255, 255);
  }

  .scroll-to-top-text {
    font-size: 10px;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .scroll-to-top-btn {
    background: linear-gradient(135deg, #ff6b9d 0%, #ff8fab 100%);
    box-shadow: 0 8px 24px rgba(255, 107, 157, 0.4);
  }

  .scroll-to-top-btn:hover {
    box-shadow: 0 12px 32px rgba(255, 107, 157, 0.5);
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .scroll-to-top-btn,
  .scroll-to-top-btn:hover,
  .scroll-to-top-icon,
  .scroll-to-top-text,
  .scroll-to-top-enter-active,
  .scroll-to-top-leave-active {
    transition: none;
  }
}
</style>
