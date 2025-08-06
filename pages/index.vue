<template>
  <div class="home-page">
    <!-- Network Status Alert -->
    <div v-if="!isOnline" class="network-status">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M1 1l22 22"></path>
        <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
        <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
        <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
        <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
        <line x1="12" y1="20" x2="12.01" y2="20"></line>
      </svg>
      <span>No internet connection</span>
    </div>

    <!-- Refresh Toast -->
    <div v-if="showRefreshToast" class="refresh-toast">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="23,4 23,10 17,10"></polyline>
        <polyline points="1,20 1,14 7,14"></polyline>
        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
      </svg>
      <span>{{ refreshToastMessage }}</span>
    </div>

    <div class="container">
      <!-- Carousel -->
      <section class="carousel-section">
        <div
          class="carousel"
          ref="carouselRef"
          @mousedown="startDrag"
          @mousemove="onDrag"
          @mouseup="endDrag"
          @mouseleave="handleMouseLeave"
          @touchstart="startTouch"
          @touchmove="onTouch"
          @touchend="endTouch"
          @mouseenter="pauseAutoCarousel"
        >
          <!-- PC Carousel Control Buttons -->
          <button v-if="!isMobile" class="carousel-control prev" @click="prevCarousel">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>
          <button v-if="!isMobile" class="carousel-control next" @click="nextCarousel">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </button>
          <div
            v-for="(item, index) in carousel"
            :key="item.id"
            class="carousel-item"
            :class="{ active: index === currentCarouselIndex }"
            @click="handleCarouselClick(item)"
          >
            <img
              v-lazy="item.imageUrl"
              :alt="item.title"
              class="lazy-placeholder"
            />
            <div class="carousel-content">
              <h2 class="carousel-title">{{ item.title }}</h2>
              <p class="carousel-description">{{ item.description }}</p>
            </div>
          </div>

          <!-- Carousel Indicators -->
          <div class="carousel-indicators">
            <button
              v-for="(item, index) in carousel"
              :key="item.id"
              class="carousel-indicator"
              :class="{ active: index === currentCarouselIndex }"
              @click="setCarouselIndex(index)"
            ></button>
          </div>
        </div>
      </section>

      <!-- Category Navigation -->
      <section class="category-section">
        <div class="category-nav">
          <button
            class="category-item"
            :class="{ active: currentCategory === 'All' }"
            :style="{
              backgroundColor: isMobile ? (currentCategory === 'All' ? '#f0f0f0' : 'white') : (currentCategory === 'All' ? '#667eea' : '#f8f9fa'),
              color: isMobile ? (currentCategory === 'All' ? '#2c2c2c' : '#333') : (currentCategory === 'All' ? 'white' : '#333'),
              borderColor: isMobile ? (currentCategory === 'All' ? '#d0d0d0' : '#e0e0e0') : '#667eea'
            }"
            @click="setCategory('All')"
          >
            All
          </button>
          <button
            v-for="category in categories"
            :key="category.id"
            class="category-item"
            :class="{
              active: currentCategory === category.name,
              highlighted: category.isHighlighted
            }"
            :style="{
              backgroundColor: isMobile ? (currentCategory === category.name ? '#f0f0f0' : 'white') : (currentCategory === category.name ? category.color : `${category.color}15`),
              color: isMobile ? (currentCategory === category.name ? '#2c2c2c' : '#333') : (currentCategory === category.name ? 'white' : category.color),
              borderColor: isMobile ? (currentCategory === category.name ? '#d0d0d0' : '#e0e0e0') : category.color
            }"
            @click="setCategory(category.name)"
          >
            <span class="category-icon">{{ category.icon }}</span>
            {{ category.name }}
          </button>
        </div>
      </section>

      <!-- Recommended Videos Section (Only shown in All category) -->
      <section v-if="currentCategory === 'All'" class="recommended-section">
        <div class="recommended-categories">
          <div
            v-for="(videos, category) in recommendedVideos"
            :key="category"
            class="category-section"
          >
            <div class="category-header">
              <div class="category-info">
                <h3 class="category-title">{{ category }}</h3>
              </div>
              <div class="category-actions">
                <button
                  class="refresh-category-btn"
                  @click="refreshCategoryVideos(category)"
                  :title="`Refresh ${category} videos`"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="23,4 23,10 17,10"></polyline>
                    <polyline points="1,20 1,14 7,14"></polyline>
                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                  </svg>
                </button>
                <button
                  class="view-all-btn"
                  @click="setCategory(category)"
                >
                  <span>View All</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9,18 15,12 9,6"></polyline>
                  </svg>
                </button>
              </div>
            </div>

            <div class="category-videos-grid">
              <div
                v-for="video in videos"
                :key="video.id"
                class="video-card-premium"
                @click="goToVideoDetail(video.id)"
              >
                <!-- Video Thumbnail -->
                <div class="video-thumbnail-premium">
                  <img
                    v-lazy="video.thumbnailUrl"
                    :alt="video.title"
                    class="lazy-placeholder"
                  />
                  <!-- Video Duration -->
                  <div class="video-duration-premium">{{ video.duration }}</div>

                  <!-- Play Button Overlay -->
                  <div class="video-play-overlay-premium">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polygon points="5,3 19,12 5,21"></polygon>
                    </svg>
                  </div>
                </div>

                <!-- Video Information -->
                <div class="video-info-premium">
                  <h4 class="video-title-premium text-ellipsis-2">{{ video.title }}</h4>
                  <div class="video-meta-premium">
                    <div class="video-stats-premium">
                      <span class="video-views-premium">{{ formatViews(video.views) }} views</span>
                    </div>
                    <div class="video-actions-premium">
                      <button
                        class="action-btn"
                        :class="{ active: video.isLiked }"
                        @click.stop="toggleLike(video.id)"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                      </button>
                      <button
                        class="action-btn"
                        :class="{ active: video.isCollected }"
                        @click.stop="toggleFavorite(video.id)"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Video Grid -->
      <section class="videos-section">
        <div class="section-header">
          <h2 class="section-title">
            {{ currentCategory === 'All' ? 'All Videos' : currentCategory }}
          </h2>
          <div class="section-actions">
            <button class="btn btn-secondary" @click="refreshVideos">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23,4 23,10 17,10"></polyline>
                <polyline points="1,20 1,14 7,14"></polyline>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
              </svg>
              Refresh
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="loading-container">
          <div class="loading"></div>
          <p>Loading videos...</p>
        </div>

        <!-- Video Grid -->
        <div v-else-if="displayVideos && displayVideos.length > 0" class="video-grid">
          <div
            v-for="video in displayVideos"
            :key="video.id"
            class="video-card"
            @click="goToVideoDetail(video.id)"
          >
            <!-- Video Thumbnail -->
            <div class="video-thumbnail">
              <img
                v-lazy="video.thumbnailUrl"
                :alt="video.title"
                class="lazy-placeholder"
              />

              <!-- Video Duration -->
              <div class="video-duration">{{ video.duration }}</div>

              <!-- Play Button -->
              <div class="video-play-overlay">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="5,3 19,12 5,21"></polygon>
                </svg>
              </div>
            </div>

            <!-- Video Information -->
            <div class="video-info">
              <h3 class="video-title text-ellipsis-2">{{ video.title }}</h3>

              <div class="video-meta">
                <div class="video-stats">
                  <span class="video-views">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    {{ formatViews(video.views) }}
                  </span>
                  <span class="video-likes">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    {{ formatViews(video.likes) }}
                  </span>
                </div>

                <div class="video-actions">
                  <button
                    @click.stop="toggleLike(video.id)"
                    class="action-btn"
                    :class="{ active: video.isLiked }"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </button>
                  <button
                    @click.stop="toggleFavorite(video.id)"
                    class="action-btn"
                    :class="{ active: video.isCollected }"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="video-uploader">
                <span class="uploader-name">{{ video.uploaderName }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 移除视频计数显示 -->

        <!-- Empty State -->
        <div v-if="!isLoading && (!displayVideos || displayVideos.length === 0)" class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          <h3>No Videos</h3>
          <p>No videos available in this category</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '~/stores/app'

  // Use state management
const store = useAppStore()

  // Reactive data
const carouselRef = ref<HTMLElement>()
let autoCarouselInterval: any = null

  // Refresh toast related
const showRefreshToast = ref(false)
const refreshToastMessage = ref('')

  // Computed properties
const carousel = computed(() => store.carousel || [])
const categories = computed(() => store.categories || [])
const currentCategory = computed(() => store.currentCategory)
const currentCarouselIndex = computed(() => store.currentCarouselIndex)
const isLoading = computed(() => store.isLoading)
const displayVideos = computed(() => {
  return store.paginatedVideos || []
})

  // Remove pagination related computed properties
const currentCategoryVideoCount = computed(() => store.currentCategoryVideoCount)
const recommendedVideos = computed(() => store.recommendedVideos)
const isMobile = computed(() => store.isMobile)

  // Methods
const setCategory = (category: string) => {
  store.setCategory(category)
}

const nextCarousel = () => {
  store.nextCarousel()
}

const prevCarousel = () => {
  store.prevCarousel()
}

const setCarouselIndex = (index: number) => {
  store.setCarouselIndex(index)
}

const toggleLike = (videoId: number) => {
  store.toggleLike(videoId)
}

const toggleFavorite = (videoId: number) => {
  store.toggleFavorite(videoId)
}

const goToVideoDetail = (videoId: number) => {
  store.addToHistory(videoId)
  navigateTo(`/video/${videoId}`)
}

const refreshVideos = () => {
  // If current category is All, force reload all data
  if (store.currentCategory === 'All') {
    store.forceRefreshData()
    showRefreshToastMessage('All data refreshed')
  } else {
    // If it's a specific category, only shuffle that category's videos
    refreshCategoryVideos(store.currentCategory)
  }
}

const refreshCategoryVideos = (category: string) => {
  // Call store method to shuffle category videos
  if (store.shuffleCategoryVideos) {
    store.shuffleCategoryVideos(category)
    showRefreshToastMessage(`${category} videos shuffled`)
  }
}

// Show refresh toast message
const showRefreshToastMessage = (message: string) => {
  refreshToastMessage.value = message
  showRefreshToast.value = true

  // Auto hide after 3 seconds
  setTimeout(() => {
    showRefreshToast.value = false
  }, 3002)
}

import { formatViews, formatTime } from '~/utils/formatters'

// Drag and touch related variables
let isDragging = false
let startX = 0
let currentX = 0
let dragDistance = 0
const dragThreshold = 50

// Auto carousel
const startAutoCarousel = () => {
  autoCarouselInterval = setInterval(() => {
    nextCarousel()
  }, 3002) // Changed to 3 seconds
}

const stopAutoCarousel = () => {
  if (autoCarouselInterval) {
    clearInterval(autoCarouselInterval)
    autoCarouselInterval = null
  }
}

// Pause and resume auto carousel
const pauseAutoCarousel = () => {
  if (!isDragging) {
    stopAutoCarousel()
  }
}

const resumeAutoCarousel = () => {
  if (!isDragging) {
    startAutoCarousel()
  }
}

// Mouse drag events
const startDrag = (e: MouseEvent) => {
  isDragging = true
  startX = e.clientX
  currentX = e.clientX
  dragDistance = 0
  stopAutoCarousel() // 直接停止，不调用pauseAutoCarousel
}

const onDrag = (e: MouseEvent) => {
  if (!isDragging) return

  currentX = e.clientX
  dragDistance = startX - currentX
}

const endDrag = () => {
  if (!isDragging) return

  if (Math.abs(dragDistance) > dragThreshold) {
    if (dragDistance > 0) {
      nextCarousel()
    } else {
      prevCarousel()
    }
  }

  isDragging = false
  dragDistance = 0
  resumeAutoCarousel()
}

// Touch events
const startTouch = (e: TouchEvent) => {
  isDragging = true
  startX = e.touches[0].clientX
  currentX = e.touches[0].clientX
  dragDistance = 0
  stopAutoCarousel() // 直接停止，不调用pauseAutoCarousel
}

const onTouch = (e: TouchEvent) => {
  if (!isDragging) return

  currentX = e.touches[0].clientX
  dragDistance = startX - currentX
}

const endTouch = () => {
  if (!isDragging) return

  if (Math.abs(dragDistance) > dragThreshold) {
    if (dragDistance > 0) {
      nextCarousel()
    } else {
      prevCarousel()
    }
  }

  isDragging = false
  dragDistance = 0
  resumeAutoCarousel()
}

// Carousel click navigation
const handleCarouselClick = (item: any) => {
      if (Math.abs(dragDistance) < 10) { // Only consider as click if minimal movement
    const videoId = item.linkUrl.split('/').pop()
          console.log('=== Carousel Click Debug ===')
      console.log('Current carousel index:', currentCarouselIndex.value)
      console.log('Clicked item ID:', item.id)
      console.log('Clicked item title:', item.title)
          console.log('Clicked item image:', item.imageUrl)
      console.log('Navigation link:', item.linkUrl)
          console.log('Extracted video ID:', videoId)
    console.log('=====================')
    if (videoId) {
      goToVideoDetail(parseInt(videoId))
    }
  }
}

// 处理鼠标离开事件
const handleMouseLeave = () => {
  endDrag()
  resumeAutoCarousel()
}

// 网络状态检测
const isOnline = ref(true) // 默认在线状态

const updateOnlineStatus = () => {
  if (navigator) {
    isOnline.value = navigator.onLine
    if (!isOnline.value) {
      console.warn('Network connection lost')
    }
  }
}

// 检测设备类型
const detectDevice = () => {
  const isMobileDevice = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  store.setMobile(isMobileDevice)
      console.log('Device detection:', isMobileDevice ? 'Mobile device' : 'Desktop device')
}

// 生命周期
onMounted(() => {
  // 检测设备类型
  detectDevice()

  // 监听窗口大小变化
  window.addEventListener('resize', detectDevice)

  startAutoCarousel()

  // 监听网络状态变化
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)

  // Debug carousel data
  console.log('=== Carousel Data Debug ===')
      console.log('Carousel data:', carousel.value)
  carousel.value.forEach((item: any, index: number) => {
          console.log(`Carousel ${index + 1}:`, {
      id: item.id,
      title: item.title,
      imageUrl: item.imageUrl,
      linkUrl: item.linkUrl
    })
  })
  console.log('=====================')
})

onUnmounted(() => {
  stopAutoCarousel()

  // 清理事件监听
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)
  window.removeEventListener('resize', detectDevice)
})
</script>

<style scoped>
/* 网络状态提示样式 */
.network-status {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #ff6b6b;
  color: white;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  z-index: 1000;
  text-align: center;
  justify-content: center;
}

.network-status svg {
  flex-shrink: 0;
}
/* 主页样式 */
.home-page {
  min-height: 100vh;
  background-color: var(--bilibili-gray);
  display: flex;
  justify-content: space-evenly;
  padding-top: 50px;
}

/* 轮播图区域 */
.carousel-section {
  margin-bottom: 32px;
}

.carousel {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.carousel-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none; /* 默认不接收点击事件 */
}

.carousel-item.active {
  opacity: 1;
  pointer-events: auto; /* 只有激活的项目接收点击事件 */
}

.carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  padding: 32px;
}

.carousel-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 12px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.carousel-description {
  font-size: 16px;
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.carousel-indicators {
  position: absolute;
  bottom: 24px;
  right: 32px;
  display: flex;
  gap: 8px;
}

.carousel-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.carousel-indicator.active {
  background: white;
  transform: scale(1.2);
}

/* 轮播图控制按钮样式 */
.carousel-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  opacity: 0;
  z-index: 10;
}

.carousel:hover .carousel-control {
  opacity: 1;
}

.carousel-control:hover {
  background: rgba(0, 0, 0, 0.8);
}

.carousel-control.prev {
  left: 16px;
}

.carousel-control.next {
  right: 16px;
}

/* 轮播图拖拽样式 */
.carousel {
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.carousel:active {
  cursor: grabbing;
}

/* 确保轮播图项目中的图片不接收点击事件，避免干扰 */
.carousel-item img {
  pointer-events: none;
}

/* 分类导航区域 */
.category-section {
  margin-bottom: 32px;
}

.category-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 24px 0;
  border-bottom: 1px solid var(--bilibili-border);
}

.category-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  color: var(--bilibili-text);
  border: 1px solid transparent;
  background: var(--bilibili-gray);
}

.category-item:hover {
  background: var(--bilibili-border);
  transform: translateY(-1px);
}

.category-item.active {
  background: var(--bilibili-pink);
  color: white;
  border-color: var(--bilibili-pink);
}

.category-item.highlighted {
  background: var(--bilibili-orange);
  color: white;
  border-color: var(--bilibili-orange);
}

.category-item.highlighted:hover {
  background: var(--bilibili-orange);
  opacity: 0.9;
}

.category-icon {
  font-size: 16px;
}

/* 视频区域 */
.videos-section {
  margin-bottom: 48px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--bilibili-text);
}

.section-actions {
  display: flex;
  gap: 12px;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 0;
  color: var(--bilibili-text-secondary);
}

.loading-container p {
  margin-top: 16px;
  font-size: 14px;
}

/* 视频网格 */
.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.video-card {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  background: white;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid var(--bilibili-border);
}

.video-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  border-color: var(--bilibili-pink);
}

.video-thumbnail {
  position: relative;
  width: 100%;
  aspect-ratio: 16/10;
  overflow: hidden;
}

.video-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.video-card:hover .video-thumbnail img {
  transform: scale(1.08);
}

.video-duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.video-play-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.video-card:hover .video-play-overlay {
  opacity: 1;
}

.video-info {
  padding: 16px;
}

.video-title {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  margin-bottom: 12px;
  color: var(--bilibili-text);
  height: 40px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.video-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.video-stats {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: var(--bilibili-text-secondary);
}

.video-views,
.video-likes {
  display: flex;
  align-items: center;
  gap: 4px;
}

.video-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: var(--bilibili-gray);
  color: var(--bilibili-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: var(--bilibili-pink);
  color: white;
}

.action-btn.active {
  background: var(--bilibili-pink);
  color: white;
}

.video-uploader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: var(--bilibili-text-secondary);
}

.uploader-name {
  font-weight: 500;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 0;
  color: var(--bilibili-text-secondary);
  text-align: center;
}

.empty-state svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--bilibili-text);
}

.empty-state p {
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .video-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  /* 移动端隐藏轮播图控制按钮 */
  .carousel-control {
    display: none !important;
  }

  /* 移动端减少轮播图与顶部的间距 */
  .home-page {
    padding-top: 10px;
  }

  .carousel {
    height: 200px;
  }

  .carousel-content {
    padding: 20px;
  }

  .carousel-title {
    font-size: 20px;
  }

  /* 移动端隐藏轮播图描述文字 */
  .carousel-description {
    display: none !important;
  }

  .category-nav {
    padding: 20px 0;
    gap: 16px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  .category-item {
    font-size: 20px;
    padding: 32px 20px;
    border-radius: 20px;
    height: 60px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 8px;
    background: white;
    color: #333;
    border: 1px solid #e0e0e0;
  }

  .category-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .category-icon {
    font-size: 32px;
  }

  .video-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }

  .video-info {
    padding: 12px;
  }

  .video-title {
    font-size: 12px;
    height: 32px;
  }

  .video-stats {
    font-size: 10px;
    gap: 12px;
  }

  .section-title {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .video-grid {
    grid-template-columns: 1fr;
  }

  .carousel-control {
    width: 40px;
    height: 40px;
  }

  .carousel-indicators {
    bottom: 16px;
    right: 20px;
  }

  .category-item {
    font-size: 20px;
    padding: 24px 32px;
    border-radius: 48px;
    min-height: 80px;
    font-weight: 700;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
    background: white;
    color: #333;
    border: 1px solid #e0e0e0;
  }

  .category-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18), 0 6px 12px rgba(0, 0, 0, 0.12);
  }

  .category-item.active {
    background: #f8f9fa;
    color: #2c2c2c;
    border: 2px solid #d0d0d0;
    transform: scale(1.02);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1);
  }

  .category-nav {
    padding: 14px 0;
    gap: 15px;
  }

  .category-icon {
    font-size: 28px;
  }
}
</style>
