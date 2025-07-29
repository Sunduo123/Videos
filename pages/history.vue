<template>
  <div class="history-page">
    <div class="container">
      <!-- 页面标题 -->
      <section class="page-header">
        <h1 class="page-title">观看历史</h1>
        <p class="page-subtitle">共观看了 {{ historyVideos.length }} 个视频</p>
      </section>

      <!-- 操作栏 -->
      <section class="actions-section">
        <div class="actions-left">
          <button class="btn btn-secondary" @click="refreshHistory">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23,4 23,10 17,10"></polyline>
              <polyline points="1,20 1,14 7,14"></polyline>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
            </svg>
            刷新
          </button>
        </div>
        <div class="actions-right">
          <button class="btn btn-secondary" @click="clearAllHistory">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3,6 5,6 21,6"></polyline>
              <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
            </svg>
            清空历史
          </button>
        </div>
      </section>

      <!-- 历史视频列表 -->
      <section class="history-section">
        <!-- 加载状态 -->
        <div v-if="isLoading" class="loading-container">
          <div class="loading"></div>
          <p>正在加载历史...</p>
        </div>

        <!-- 空状态 -->
        <div v-else-if="historyVideos.length === 0" class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12,6 12,12 16,14"></polyline>
          </svg>
          <h3>暂无观看历史</h3>
          <p>您还没有观看过任何视频</p>
          <NuxtLink to="/" class="btn btn-primary">
            去发现更多视频
          </NuxtLink>
        </div>

        <!-- 视频列表 -->
        <div v-else class="history-list">
          <div
            v-for="(video, index) in historyVideos"
            :key="video.id"
            class="history-item"
            @click="goToVideoDetail(video.id)"
          >
            <!-- 序号 -->
            <div class="history-index">
              <span class="index-number">{{ index + 1 }}</span>
            </div>

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
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="5,3 19,12 5,21"></polygon>
                </svg>
              </div>
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
            </div>

            <!-- 操作按钮 -->
            <div class="history-actions">
              <button
                @click.stop="removeFromHistory(video.id)"
                class="remove-history-btn"
                title="从历史记录中删除"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
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
const historyVideos = computed(() => store.historyVideos)
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

const toggleFavorite = (videoId: number) => {
  store.toggleFavorite(videoId)
}

const removeFromHistory = (videoId: number) => {
  store.history = store.history.filter((id: any) => id !== videoId)
  store.saveUserState()
}

const refreshHistory = () => {
  store.initializeData()
}

const clearAllHistory = () => {
  if (confirm('确定要清空所有观看历史吗？此操作不可恢复。')) {
    store.clearHistory()
  }
}
</script>

<style scoped>
/* 历史记录页面样式 */
.history-page {
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

/* 历史记录区域 */
.history-section {
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

/* 历史记录列表 */
.history-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.history-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

/* 序号 */
.history-index {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bilibili-gray);
  border-radius: 50%;
}

.index-number {
  font-size: 16px;
  font-weight: 600;
  color: var(--bilibili-text);
}

/* 视频缩略图 */
.video-thumbnail {
  position: relative;
  width: 160px;
  height: 90px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
}

.video-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.history-item:hover .video-thumbnail img {
  transform: scale(1.05);
}

.video-duration {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 4px;
  border-radius: 2px;
  font-size: 10px;
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

.history-item:hover .video-play-overlay {
  opacity: 1;
}

/* 视频信息 */
.video-info {
  flex: 1;
  min-width: 0;
}

.video-title {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.4;
  margin-bottom: 12px;
  color: var(--bilibili-text);
  height: 44px;
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

/* 历史记录操作 */
.history-actions {
  flex-shrink: 0;
  display: flex;
  gap: 8px;
}

.remove-history-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: var(--bilibili-gray);
  color: var(--bilibili-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.remove-history-btn:hover {
  background: rgba(255, 0, 0, 0.1);
  color: #ff4757;
}

/* 响应式设计 */
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
  
  .history-item {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .history-index {
    align-self: flex-start;
  }
  
  .video-thumbnail {
    width: 100%;
    height: 120px;
  }
  
  .video-title {
    font-size: 14px;
    height: 40px;
  }
  
  .video-stats {
    font-size: 10px;
    gap: 12px;
  }
  
  .history-actions {
    align-self: flex-end;
  }
}

@media (max-width: 480px) {
  .history-item {
    padding: 12px;
  }
  
  .video-thumbnail {
    height: 100px;
  }
  
  .video-title {
    font-size: 12px;
    height: 32px;
  }
}
</style> 