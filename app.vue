<template>
  <div id="app">
    <!-- 头部导航 -->
    <header class="header">
      <div class="header-content">
        <!-- Logo -->
        <NuxtLink to="/" class="logo">
          VideoH5
        </NuxtLink>

        <!-- 搜索框 -->
        <div class="search-container">
          <input
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            type="text"
            class="search-input"
            :placeholder="isMobile ? 'Search...' : 'Search videos, creators, or topics...'"
            style="color: #18191c;"
            data-testid="main-search-input"
          />
          <button @click="handleSearch" class="search-button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
        </div>

        <!-- 右侧操作区 -->
        <div class="header-actions">
          <!-- 收藏 -->
          <NuxtLink to="/favorites" class="header-action">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
            </svg>
            <span v-if="!isMobile">Favorites</span>
          </NuxtLink>

          <!-- 历史 -->
          <NuxtLink to="/history" class="header-action">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12,6 12,12 16,14"></polyline>
            </svg>
            <span v-if="!isMobile">History</span>
          </NuxtLink>




        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <NuxtPage />
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="container">
        <!-- 主要页脚内容 -->
        <div class="footer-main">
          <!-- 品牌区域 -->
          <div class="footer-brand">
            <div class="brand-logo">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"></polygon>
              </svg>
              <span class="brand-name">VideoH5</span>
            </div>
            <p class="brand-description">
              Discover amazing video content, connect creators with audiences, and build a premium video sharing platform
            </p>
            <div class="social-links">
              <a href="#" class="social-link" title="WeChat">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.5,13.5A1.5,1.5 0 0,1 7,12A1.5,1.5 0 0,1 8.5,10.5A1.5,1.5 0 0,1 10,12A1.5,1.5 0 0,1 8.5,13.5M15.5,13.5A1.5,1.5 0 0,1 14,12A1.5,1.5 0 0,1 15.5,10.5A1.5,1.5 0 0,1 17,12A1.5,1.5 0 0,1 15.5,13.5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
                </svg>
              </a>
              <a href="#" class="social-link" title="Weibo">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.5,6.75C17.5,6.75 18.25,7.5 18.25,8.5C18.25,9.5 17.5,10.25 16.5,10.25C15.5,10.25 14.75,9.5 14.75,8.5C14.75,7.5 15.5,6.75 16.5,6.75M7.5,6.75C8.5,6.75 9.25,7.5 9.25,8.5C9.25,9.5 8.5,10.25 7.5,10.25C6.5,10.25 5.75,9.5 5.75,8.5C5.75,7.5 6.5,6.75 7.5,6.75M12,18C9.5,18 7.5,16 7.5,13.5H16.5C16.5,16 14.5,18 12,18Z"/>
                </svg>
              </a>
              <a href="#" class="social-link" title="QQ">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16,16H8V14H16V16M16,13H8V11H16V13M16,10H8V8H16V10Z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- 快速导航 -->
          <div class="footer-navigation">
            <h4 class="section-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <!-- <polyline points="3,6 5,6 21,6"></polyline> -->
                <!-- <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path> -->
              </svg>
              Quick Navigation
            </h4>
            <div class="nav-grid">
              <a href="/" class="nav-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9,22 9,12 15,12 15,22"></polyline>
                </svg>
                Home
              </a>
              <a href="/search" class="nav-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                Search Videos
              </a>
              <a href="/favorites" class="nav-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
                </svg>
                Favorites
              </a>
              <a href="/history" class="nav-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12,6 12,12 16,14"></polyline>
                </svg>
                History
              </a>

            </div>
          </div>
        </div>

        <!-- 页脚底部 -->
        <div class="footer-bottom">
          <div class="footer-bottom-content">
            <div class="copyright">
              <p>&copy; 2024 VideoH5. All rights reserved.</p>
              <p>Let videos connect the world, let creativity have more value</p>
            </div>
            <div class="legal-links">
              <a href="/terms">Terms of Service</a>
              <span class="separator">|</span>
              <a href="/privacy">Privacy Policy</a>
              <span class="separator">|</span>
              <a href="/cookies">Cookie Policy</a>
              <span class="separator">|</span>
              <a href="/terms">Legal Terms</a>
            </div>
          </div>
        </div>
      </div>
    </footer>

    <!-- 一键置顶按钮 -->
    <ScrollToTop />
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '~/stores/app'

// 使用状态管理
const store = useAppStore()

// 响应式数据
const searchQuery = ref('')
const isMobile = ref(false)

// 同步搜索查询状态
watch(() => store.searchQuery, (newQuery: string) => {
  searchQuery.value = newQuery
})

// 方法
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    store.setSearchQuery(searchQuery.value)
    navigateTo(`/search?q=${encodeURIComponent(searchQuery.value)}`)
  }
}

// 响应式处理
const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
  store.setMobile(isMobile.value)
}

// 生命周期
onMounted(() => {
  // 初始化数据
  store.initializeData()

  // 设置响应式
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* 主内容区域 */
.main-content {
  min-height: calc(100vh - 64px - 300px); /* 减去头部和页脚高度 */
  padding: 24px 0;
}

/* 容器样式 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .main-content {
    padding: 16px 0;
  }

  .container {
    padding: 0 16px;
  }
}
</style>
