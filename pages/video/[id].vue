<template>
  <div class="video-detail-page">
    <div class="container">
      <!-- 视频播放器 -->
      <section class="video-player-section">
        <div class="video-player-container">
          <!-- Network Error -->
          <div v-if="networkError" class="network-error">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 1l22 22"></path>
              <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
              <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
              <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
              <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
              <line x1="12" y1="20" x2="12.01" y2="20"></line>
            </svg>
            <h3>Network Connection Error</h3>
            <p>Unable to load video due to network issues. Please check your network connection or try again later.</p>
            <div class="error-actions">
              <button @click="retryVideo" class="btn btn-primary">Retry</button>
              <button @click="checkNetworkStatus" class="btn btn-secondary">Check Network</button>
            </div>
            <div v-if="retryCount > 0" class="retry-info">
              <p>Retried {{ retryCount }} times</p>
            </div>
          </div>

          <!-- YouTube 视频播放器 -->
          <div v-else-if="currentVideo?.youtubeId" class="youtube-player-container">
            <iframe
              :src="`https://www.youtube.com/embed/${currentVideo.youtubeId}?autoplay=1&rel=0`"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              class="youtube-player"
              @error="handleVideoError"
              @load="handleVideoLoad"
            ></iframe>
          </div>
          <!-- 原生视频播放器 -->
          <video
            v-else
            ref="videoRef"
            :src="currentVideo?.videoUrl"
            controls
            class="video-player"
          ></video>
        </div>
      </section>

      <!-- 视频信息 -->
      <section class="video-info-section">
        <div class="video-header">
          <h1 class="video-title">{{ currentVideo?.title }}</h1>

          <div class="video-stats">
            <div class="stat-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>{{ formatViews(currentVideo?.views || 0) }} views</span>
            </div>
            <div class="stat-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span>{{ formatViews(currentVideo?.likes || 0) }}</span>
            </div>
            <div class="stat-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>{{ currentVideo?.comments || 0 }} comments</span>
            </div>
            <div class="stat-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12,6 12,12 16,14"></polyline>
              </svg>
              <span>{{ currentVideo?.duration }}</span>
            </div>
          </div>
        </div>

        <div class="video-actions">
          <button
            @click="toggleLike"
            class="action-btn"
            :class="{ active: currentVideo?.isLiked }"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span>{{ currentVideo?.isLiked ? 'Liked' : 'Like' }}</span>
          </button>

          <button
            @click="toggleFavorite"
            class="action-btn"
            :class="{ active: currentVideo?.isCollected }"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
            </svg>
            <span>{{ currentVideo?.isCollected ? 'Favorited' : 'Favorite' }}</span>
          </button>

        </div>

        <div class="video-description">
          <h3>Video Description</h3>
          <p>{{ currentVideo?.description }}</p>
          <div class="video-tags">
            <span
              v-for="tag in currentVideo?.tags"
              :key="tag"
              class="tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </section>

      <!-- 评论区域 -->
      <section class="comments-section">
        <div class="comments-header">
          <h3>Comments ({{ (videoComments || []).length }})</h3>
        </div>

        <!-- 发表评论 -->
        <div class="comment-form">
          <img
            v-lazy="`/images/default-avatar.png`"
            alt="User Avatar"
            class="user-avatar"
            @error="$event.target.src = '/images/default-avatar.png'"
          />
          <div class="comment-input-container">
            <textarea
              v-model="newComment"
              placeholder="Write a friendly comment..."
              class="comment-input"
              rows="3"
            ></textarea>
            <button
              @click="submitComment"
              class="btn"
              :class="newComment.trim() ? 'btn-primary' : 'btn-secondary'"
              :disabled="!newComment.trim()"
            >
              Post Comment
            </button>
          </div>
        </div>

        <!-- 评论列表 -->
        <div class="comments-list">
          <div
            v-for="comment in videoComments"
            :key="comment.id"
            class="comment-item"
          >
            <img
              v-lazy="comment.userAvatar"
              :alt="comment.userName"
              class="comment-avatar"
            />
            <div class="comment-content">
              <div class="comment-header">
                <span class="comment-author">{{ comment.userName }}</span>
                <span class="comment-time">{{ comment.time }}</span>
              </div>
              <p class="comment-text">{{ comment.content }}</p>
              <div class="comment-actions">
                <button
                  @click="toggleCommentLike(comment.id)"
                  class="comment-action"
                  :class="{ active: comment.isLiked }"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  <span>{{ comment.likes }}</span>
                </button>
                <button class="comment-action">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <span>Reply</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 相关视频 -->
      <section class="related-videos-section">
        <h3>Related Videos</h3>
        <div class="related-videos-grid">
          <div
            v-for="video in relatedVideos"
            :key="video.id"
            class="related-video-card"
            @click="goToVideo(video.id)"
          >
            <div class="related-video-thumbnail">
              <img
                v-lazy="video.thumbnailUrl"
                :alt="video.title"
                class="lazy-placeholder"
              />
              <div class="related-video-duration">{{ video.duration }}</div>
            </div>
            <div class="related-video-info">
              <h4 class="related-video-title text-ellipsis-2">{{ video.title }}</h4>
              <p class="related-video-uploader">{{ video.uploaderName }}</p>
              <div class="related-video-stats">
                <span>{{ formatViews(video.views) }} views</span>
                <span>{{ formatTime(video.uploadDate) }}</span>
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
const route = useRoute()

// 响应式数据
const videoRef = ref<HTMLVideoElement>()
const newComment = ref('')
const networkError = ref(false)
const retryCount = ref(0)
const maxRetries = 3
let player: any = null

// 计算属性
const videoId = computed(() => parseInt(route.params.id as string))
const currentVideo = computed(() => store.videos.find((v: any) => v.id === videoId.value))
const videoComments = computed(() => store.comments.filter((c: any) => c.videoId === videoId.value))
const relatedVideos = computed(() => {
  if (!currentVideo.value) return []
  return store.videos
    .filter((v: any) => v.id !== videoId.value && v.category === currentVideo.value?.category)
    .slice(0, 6)
})

import { formatViews } from '~/utils/formatters'

const formatTime = (dateString: string) => {
  return store.formatTime(dateString)
}

const toggleLike = () => {
  if (currentVideo.value) {
    store.toggleLike(currentVideo.value.id)
  }
}

const toggleFavorite = () => {
  if (currentVideo.value) {
    store.toggleFavorite(currentVideo.value.id)
  }
}

const toggleCommentLike = (commentId: number) => {
  const comment = store.comments.find((c: any) => c.id === commentId)
  if (comment) {
    comment.isLiked = !comment.isLiked
    if (comment.isLiked) {
      comment.likes++
    } else {
      comment.likes--
    }
  }
}

const submitComment = () => {
  if (!newComment.value.trim() || !currentVideo.value) return

  const newCommentObj = {
    id: Date.now(),
    videoId: currentVideo.value.id,
    userName: 'Current User',
    userAvatar: 'https://picsum.photos/40/40?random=999',
    content: newComment.value,
    likes: 0,
    replies: 0,
    time: 'Just now',
    isLiked: false
  }

  store.comments.unshift(newCommentObj)
  newComment.value = ''
}

// 网络错误处理
const handleVideoError = () => {
  networkError.value = true
  console.log('Video loading error detected')
}

const handleVideoLoad = () => {
  networkError.value = false
  retryCount.value = 0
  console.log('Video loaded successfully')
}

const retryVideo = () => {
  if (retryCount.value < maxRetries) {
    retryCount.value++
    networkError.value = false
    console.log(`Retrying video load (attempt ${retryCount.value}/${maxRetries})`)

    // 强制重新加载iframe
    const iframe = document.querySelector('.youtube-player') as HTMLIFrameElement
    if (iframe) {
      iframe.src = iframe.src
    }
  } else {
    alert('已达到最大重试次数，请检查网络连接或稍后重试')
  }
}

const checkNetworkStatus = () => {
  if (navigator.onLine) {
    alert('网络连接正常，可能是YouTube服务暂时不可用')
  } else {
    alert('网络连接已断开，请检查网络设置')
  }
}

const goToVideo = (videoId: number) => {
  navigateTo(`/video/${videoId}`)
}

// 初始化Plyr播放器
const initPlayer = () => {
  if (videoRef.value && !player) {
    try {
      // 检查Plyr是否可用
      if (typeof window !== 'undefined' && (window as any).Plyr) {
        player = new (window as any).Plyr(videoRef.value, {
          controls: [
            'play-large',
            'play',
            'progress',
            'current-time',
            'mute',
            'volume',
            'captions',
            'settings',
            'pip',
            'airplay',
            'fullscreen'
          ],
          settings: ['captions', 'quality', 'speed'],
          speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] }
        })
      } else {
        // 如果Plyr不可用，使用原生HTML5播放器
        if (videoRef.value) {
          videoRef.value.controls = true
        }
      }
    } catch (error) {
      console.error('Plyr初始化失败:', error)
      // 如果Plyr初始化失败，使用原生HTML5播放器
      if (videoRef.value) {
        videoRef.value.controls = true
      }
    }
  }
}

// 生命周期
onMounted(() => {
  // 添加观看历史
  if (currentVideo.value) {
    store.addToHistory(currentVideo.value.id)
  }

  // 延迟初始化播放器，确保Plyr完全加载
  nextTick(() => {
    setTimeout(() => {
      initPlayer()
    }, 100)
  })

  // 添加全局错误监听
  window.addEventListener('error', (event) => {
    if (event.target && (event.target as any).tagName === 'IFRAME') {
      handleVideoError()
    }
  })
})

onUnmounted(() => {
  if (player) {
    player.destroy()
    player = null
  }

  // 清理事件监听
  window.removeEventListener('error', () => {})
})
</script>

<style scoped>
/* 视频详情页样式 */
.video-detail-page {
  min-height: 100vh;
  background: var(--bilibili-gray);
  display: flex;
  justify-content: space-evenly;
}

/* 视频播放器区域 */
.video-player-section {
  margin-bottom: 24px;
}

.video-player-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.video-player {
  width: 100%;
  height: auto;
  aspect-ratio: 16/9;
}

.youtube-player-container {
  width: 100%;
  height: auto;
  aspect-ratio: 16/9;
}

.youtube-player {
  width: 100%;
  height: 100%;
  border-radius: 12px;
}

/* 视频信息区域 */
.video-info-section {
  max-width: 1000px;
  margin: 0 auto 32px;
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.video-header {
  margin-bottom: 20px;
}

.video-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--bilibili-text);
  margin-bottom: 16px;
  line-height: 1.4;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  max-width: 100%;
  white-space: normal;
}

.video-stats {
  display: flex;
  align-items: center;
  gap: 24px;
  color: var(--bilibili-text-secondary);
  font-size: 14px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.video-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--bilibili-border);
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: 1px solid var(--bilibili-border);
  border-radius: 8px;
  background: white;
  color: var(--bilibili-text);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
  min-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  justify-content: center;
}

.action-btn:hover {
  background: var(--bilibili-gray);
  border-color: var(--bilibili-gray);
}

.action-btn.active {
  background: var(--bilibili-pink);
  color: white;
  border-color: var(--bilibili-pink);
}

.action-btn.active:hover {
  background: #ff3742;
  border-color: #ff3742;
}

.video-meta {
  margin-bottom: 24px;
}

.uploader-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--bilibili-gray);
  border-radius: 8px;
}

.uploader-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.uploader-details {
  flex: 1;
}

.uploader-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--bilibili-text);
  margin-bottom: 4px;
}

.upload-date {
  font-size: 14px;
  color: var(--bilibili-text-secondary);
}

.video-description {
  border-top: 1px solid var(--bilibili-border);
  padding-top: 20px;
}

.video-description h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--bilibili-text);
  margin-bottom: 12px;
}

.video-description p {
  font-size: 14px;
  line-height: 1.6;
  color: var(--bilibili-text);
  margin-bottom: 16px;
}

.video-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  display: inline-block;
  padding: 6px 12px;
  background: var(--bilibili-gray);
  color: var(--bilibili-text-secondary);
  border-radius: 16px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag:hover {
  background: var(--bilibili-pink);
  color: white;
}

/* 评论区域 */
.comments-section {
  max-width: 1000px;
  margin: 0 auto 32px;
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.comments-header {
  margin-bottom: 24px;
}

.comments-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--bilibili-text);
}

.comment-form {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--bilibili-border);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.comment-input-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.comment-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--bilibili-border);
  border-radius: 8px;
  font-size: 16px;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  /* 防止手机端点击时放大 */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  transform: scale(1);
  -webkit-transform: scale(1);
}

.comment-input:focus {
  outline: none;
  border-color: var(--bilibili-pink);
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  display: flex;
  gap: 16px;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.comment-author {
  font-size: 14px;
  font-weight: 500;
  color: var(--bilibili-text);
}

.comment-time {
  font-size: 12px;
  color: var(--bilibili-text-secondary);
}

.comment-text {
  font-size: 14px;
  line-height: 1.6;
  color: var(--bilibili-text);
  margin-bottom: 12px;
}

.comment-actions {
  display: flex;
  gap: 16px;
}

.comment-action {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: none;
  background: none;
  color: var(--bilibili-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
  border-radius: 4px;
}

.comment-action:hover {
  background: var(--bilibili-gray);
  color: var(--bilibili-text);
}

.comment-action.active {
  color: var(--bilibili-pink);
}

/* 相关视频区域 */
.related-videos-section {
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.related-videos-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--bilibili-text);
  margin-bottom: 20px;
}

.related-videos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.related-video-card {
  display: flex;
  gap: 12px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.related-video-card:hover {
  background: var(--bilibili-gray);
}

.related-video-thumbnail {
  position: relative;
  width: 120px;
  height: 68px;
  flex-shrink: 0;
  border-radius: 6px;
  overflow: hidden;
}

.related-video-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.related-video-duration {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 4px;
  border-radius: 2px;
  font-size: 10px;
}

.related-video-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.related-video-title {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  color: var(--bilibili-text);
  margin-bottom: 4px;
  height: 40px;
  overflow: hidden;
}

.related-video-uploader {
  font-size: 12px;
  color: var(--bilibili-text-secondary);
  margin-bottom: 4px;
}

.related-video-stats {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--bilibili-text-secondary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .video-player-container {
    margin: 0 16px;
    width: calc(100% - 32px);
    max-width: none;
  }

  .video-info-section {
    margin: 0 16px 24px;
    padding: 16px;
    width: calc(100% - 32px);
    max-width: none;
  }

  .comments-section,
  .related-videos-section {
    margin: 0 16px 24px;
    padding: 16px;
  }

  .video-title {
    font-size: 18px;
    line-height: 1.3;
    margin-bottom: 12px;
  }

  .video-stats {
    gap: 12px;
    font-size: 12px;
  }

  .video-actions {
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 8px;
    margin-bottom: 20px;
    padding-bottom: 16px;
  }

  .action-btn {
    flex: 1;
    padding: 10px 12px;
    font-size: 12px;
    justify-content: center;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
  }

  .action-btn svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  .action-btn span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .uploader-info {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .comment-form {
    flex-direction: column;
    gap: 12px;
  }

  .comment-input {
    /* 防止手机端点击时放大 */
    font-size: 16px !important;
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
    appearance: none !important;
    transform: scale(1) !important;
    -webkit-transform: scale(1) !important;
  }

  .related-videos-grid {
    grid-template-columns: 1fr;
  }

  .related-video-card {
    flex-direction: column;
  }

  .related-video-thumbnail {
    width: 100%;
    height: 120px;
  }
}

@media (max-width: 480px) {
  .video-player-container {
    margin: 0 12px;
    width: calc(100% - 24px);
  }

  .video-info-section {
    margin: 0 12px 20px;
    padding: 12px;
    width: calc(100% - 24px);
  }

  .comments-section,
  .related-videos-section {
    margin: 0 12px 20px;
    padding: 12px;
  }

  .video-title {
    font-size: 16px;
  }

  .video-actions {
    gap: 6px;
  }

  .action-btn {
    padding: 8px 10px;
    font-size: 11px;
    white-space: nowrap;
    overflow: hidden;
  }

  .action-btn svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }

  .action-btn span {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .comment-input {
    /* 防止手机端点击时放大 */
    font-size: 16px !important;
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
    appearance: none !important;
    transform: scale(1) !important;
    -webkit-transform: scale(1) !important;
  }
}

/* 网络错误样式 */
.network-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  background: #f8f9fa;
  border-radius: 12px;
  border: 2px dashed #dee2e6;
  min-height: 300px;
}

.network-error svg {
  color: #6c757d;
  margin-bottom: 16px;
}

.network-error h3 {
  color: #495057;
  margin-bottom: 8px;
  font-size: 18px;
}

.network-error p {
  color: #6c757d;
  margin-bottom: 20px;
  max-width: 400px;
  line-height: 1.5;
}

.error-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.btn-secondary:hover {
  background: #5a6268;
}

.btn-primary {
  background: var(--bilibili-pink);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background: #ff3742;
}

.retry-info {
  font-size: 12px;
  color: #6c757d;
  background: #e9ecef;
  padding: 8px 12px;
  border-radius: 6px;
  margin-top: 8px;
}
</style>


