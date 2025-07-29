<template>
  <div id="app">
    <!-- 头部导航 -->
    <header class="header">
      <div class="header-content">
        <!-- Logo -->
        <NuxtLink to="/" class="logo">
          bilibili
        </NuxtLink>

        <!-- 搜索框 -->
        <div class="search-container">
          <input
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            type="text"
            class="search-input"
            placeholder="搜索视频、UP主或番剧"
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
            <span v-if="!isMobile">收藏</span>
          </NuxtLink>

          <!-- 历史 -->
          <NuxtLink to="/history" class="header-action">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12,6 12,12 16,14"></polyline>
            </svg>
            <span v-if="!isMobile">历史</span>
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
        <div class="footer-content">
          <!-- 关于我们 -->
          <div class="footer-section">
            <h3>关于我们</h3>
            <ul>
              <li><a href="#">关于哔哩哔哩</a></li>
              <li><a href="#">联系我们</a></li>
              <li><a href="#">加入我们</a></li>
              <li><a href="#">用户协议</a></li>
              <li><a href="#">隐私政策</a></li>
            </ul>
          </div>

          <!-- 帮助中心 -->
          <div class="footer-section">
            <h3>帮助中心</h3>
            <ul>
              <li><a href="#">常见问题</a></li>
              <li><a href="#">意见反馈</a></li>
              <li><a href="#">举报中心</a></li>
              <li><a href="#">用户守则</a></li>
              <li><a href="#">社区规范</a></li>
            </ul>
          </div>

          <!-- 内容合作 -->
          <div class="footer-section">
            <h3>内容合作</h3>
            <ul>
              <li><a href="#">内容合作</a></li>
              <li><a href="#">品牌合作</a></li>
              <li><a href="#">广告投放</a></li>
              <li><a href="#">商务合作</a></li>
              <li><a href="#">媒体合作</a></li>
            </ul>
          </div>

          <!-- 开发者 -->
          <div class="footer-section">
            <h3>开发者</h3>
            <ul>
              <li><a href="#">开发者中心</a></li>
              <li><a href="#">API文档</a></li>
              <li><a href="#">SDK下载</a></li>
              <li><a href="#">开发者论坛</a></li>
              <li><a href="#">开发者协议</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; 2024 哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '~/stores/app'

// 使用状态管理
const store = useAppStore()

// 响应式数据
const searchQuery = ref('')
const isMobile = ref(false)

// 方法
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    store.setSearchQuery(searchQuery.value)
    navigateTo('/search')
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
