<template>
  <div class="search-page">
    <div class="container">
      <!-- Search Header -->
      <section class="search-header">
        <h1 class="search-title">Search Results</h1>
        <p class="search-subtitle">Found {{ (searchResults || []).length }} related videos</p>
      </section>

      <!-- Search Results -->
      <section class="search-results">
        <!-- Loading State -->
        <div v-if="isLoading" class="loading-container">
          <div class="loading"></div>
          <p>Searching...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="!searchResults || searchResults.length === 0" class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <h3>No videos found</h3>
          <p>Try different keywords</p>
          <NuxtLink to="/" class="btn btn-primary">
            Back to Home
          </NuxtLink>
        </div>

        <!-- Search Results List -->
        <div v-else class="search-results-grid">
          <div
            v-for="video in searchResults"
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
                <span class="upload-date">{{ formatTime(video.uploadDate) }}</span>
              </div>

              <div class="video-category">
                <span class="category-tag">{{ video.category }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '~/stores/app'
import { formatViews, formatTime } from '~/utils/formatters'

// 使用状态管理
const store = useAppStore()
const route = useRoute()

// 计算属性
const searchResults = computed(() => store.searchResults)
const isLoading = computed(() => store.isLoading)

// 处理搜索查询
const searchQuery = computed(() => {
  const query = route.query.q
  if (query && typeof query === 'string') {
    store.setSearchQuery(query)
  }
  return query
})

// 组件挂载时处理搜索查询
onMounted(() => {
  if (!route.query.q && store.searchQuery) {
    // 保持当前搜索查询
  }
})

const goToVideoDetail = (videoId: number) => {
  store.addToHistory(videoId)
  navigateTo(`/video/${videoId}`)
}

const toggleLike = (videoId: number) => {
  store.toggleLike(videoId)
}

const toggleFavorite = (videoId: number) => {
  store.toggleFavorite(videoId)
}
</script>

<style scoped>
/* 搜索页面样式 */
.search-page {
  min-height: 100vh;
  background: var(--bilibili-gray);
  display: flex;
  justify-content: space-evenly;
}

/* 搜索头部 */
.search-header {
  text-align: center;
  margin-bottom: 32px;
  padding: 48px 0 24px;
}

.search-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--bilibili-text);
  margin-bottom: 8px;
}

.search-subtitle {
  font-size: 16px;
  color: var(--bilibili-text-secondary);
}

/* 搜索结果区域 */
.search-results {
  margin-bottom: 48px;
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
  margin-bottom: 24px;
}

/* 搜索结果网格 */
.search-results-grid {
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
  margin-bottom: 8px;
}

.uploader-name {
  font-weight: 500;
}

.video-category {
  display: flex;
  justify-content: flex-start;
}

.category-tag {
  display: inline-block;
  padding: 4px 8px;
  background: var(--bilibili-gray);
  color: var(--bilibili-text-secondary);
  border-radius: 12px;
  font-size: 10px;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .search-results-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .search-header {
    padding: 32px 0 16px;
  }

  .search-title {
    font-size: 24px;
  }

  .search-subtitle {
    font-size: 14px;
  }

  .search-results-grid {
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
}

@media (max-width: 480px) {
  .search-results-grid {
    grid-template-columns: 1fr;
  }
}
</style>
