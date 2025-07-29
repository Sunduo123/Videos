<template>
  <div class="favorites-page">
    <div class="container">
      <!-- 页面标题 -->
      <section class="page-header">
        <h1 class="page-title">我的收藏</h1>
        <p class="page-subtitle">共收藏了 {{ favoriteVideos.length }} 个视频</p>
      </section>

      <!-- 操作栏 -->
      <section class="actions-section">
        <div class="actions-left">
          <button class="btn btn-secondary" @click="refreshFavorites">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23,4 23,10 17,10"></polyline>
              <polyline points="1,20 1,14 7,14"></polyline>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
            </svg>
            刷新
          </button>
        </div>
        <div class="actions-right">
          <button class="btn btn-secondary" @click="clearAllFavorites">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3,6 5,6 21,6"></polyline>
              <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
            </svg>
            清空收藏
          </button>
        </div>
      </section>

      <!-- 收藏视频列表 -->
      <section class="favorites-section">
        <!-- 加载状态 -->
        <div v-if="isLoading" class="loading-container">
          <div class="loading"></div>
          <p>正在加载收藏...</p>
        </div>

        <!-- 空状态 -->
        <div v-else-if="favoriteVideos.length === 0" class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <h3>暂无收藏</h3>
          <p>您还没有收藏任何视频</p>
          <NuxtLink to="/" class="btn btn-primary">
            去发现更多视频
          </NuxtLink>
        </div>

        <!-- 视频网格 -->
        <div v-else class="video-grid">
          <div
            v-for="video in favoriteVideos"
            :key="video.id"
            class="video-card"
            @click="goToVideoDetail(video.id)"
          >
            <!-- 视频缩略图 -->
            <div class="video-thumbnail">
              <img
                v-lazy="video.thumbnailUrl"
                :alt="video.title"
                class="lazy-placeholder"
              />
              
              <!-- 视频时长 -->
              <div class="video-duration">{{ video.duration }}</div>
              
              <!-- 播放按钮 -->
              <div class="video-play-overlay">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="5,3 19,12 5,21"></polygon>
                </svg>
              </div>

              <!-- 取消收藏按钮 -->
              <button
                @click.stop="removeFromFavorites(video.id)"
                class="remove-favorite-btn"
                title="取消收藏"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <!-- 视频信息 -->
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
                </div>
              </div>
              
              <div class="video-uploader">
                <span class="uploader-name">{{ video.uploaderName }}</span>
                <span class="upload-date">{{ formatTime(video.uploadDate) }}</span>
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

// 使用状态管理
const store = useAppStore()

// 计算属性
const favoriteVideos = computed(() => store.favoriteVideos)
const isLoading = computed(() => store.isLoading)

// 方法
const formatViews = (views: number) => {
  return store.formatViews(views)
}

const formatTime = (dateString: string) => {
  return store.formatTime(dateString)
}

const goToVideoDetail = (videoId: number) => {
  store.addToHistory(videoId)
  navigateTo(`/video/${videoId}`)
}

const toggleLike = (videoId: number) => {
  store.toggleLike(videoId)
}

const removeFromFavorites = (videoId: number) => {
  store.toggleFavorite(videoId)
}

const refreshFavorites = () => {
  store.initializeData()
}

const clearAllFavorites = () => {
  if (confirm('确定要清空所有收藏吗？此操作不可恢复。')) {
    store.clearFavorites()
  }
}
</script>

<style scoped>
/* 收藏页面样式 */
.favorites-page {
  min-height: 100vh;
  background: var(--bilibili-gray);
  display: flex;
  justify-content: space-evenly;
}

/* 页面标题 */
.page-header {
  text-align: center;
  margin-bottom: 32px;
  padding: 48px 0 24px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--bilibili-text);
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 16px;
  color: var(--bilibili-text-secondary);
}

/* 操作栏 */
.actions-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.actions-left,
.actions-right {
  display: flex;
  gap: 12px;
}

/* 收藏视频区域 */
.favorites-section {
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

.remove-favorite-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  opacity: 0;
}

.video-card:hover .remove-favorite-btn {
  opacity: 1;
}

.remove-favorite-btn:hover {
  background: rgba(255, 0, 0, 0.8);
  transform: scale(1.1);
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

/* 响应式设计 */
@media (max-width: 1024px) {
  .video-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 32px 0 16px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .page-subtitle {
    font-size: 14px;
  }
  
  .actions-section {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .actions-left,
  .actions-right {
    justify-content: center;
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
}

@media (max-width: 480px) {
  .video-grid {
    grid-template-columns: 1fr;
  }
  
  .remove-favorite-btn {
    opacity: 1;
  }
}
</style> 