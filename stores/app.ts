import { defineStore } from 'pinia'

export interface User {
  id: number
  name: string
  avatar: string
  email: string
}

export interface Video {
  id: number
  title: string
  thumbnailUrl: string
  videoUrl: string
  views: number
  likes: number
  comments: number
  duration: string
  uploaderName: string
  uploadDate: string
  category: string
  categoryId: number
  description: string
  tags: string[]
  isLiked: boolean
  isCollected: boolean
}

export interface Comment {
  id: number
  videoId: number
  userName: string
  userAvatar: string
  content: string
  likes: number
  replies: number
  time: string
  isLiked: boolean
}

export interface Category {
  id: number
  name: string
  icon: string
  isHighlighted: boolean
  color: string
}

export interface CarouselItem {
  id: number
  title: string
  imageUrl: string
  linkUrl: string
  description: string
  backgroundColor: string
}

export const useAppStore = defineStore('app', {
  state: () => ({
    // 用户相关
    user: null as User | null,
    isLoggedIn: false,
    
    // 数据相关
    videos: [] as Video[],
    categories: [] as Category[],
    carousel: [] as CarouselItem[],
    comments: [] as Comment[],
    
    // 页面状态
    currentCategory: '全部',
    searchQuery: '',
    isLoading: false,
    
    // 用户行为
    favorites: [] as number[], // 收藏的视频ID
    history: [] as number[], // 观看历史的视频ID
    likedVideos: [] as number[], // 点赞的视频ID
    
    // 轮播图状态
    currentCarouselIndex: 0,
    
    // 响应式状态
    isMobile: false,
    sidebarOpen: false
  }),

  getters: {
    // 获取当前分类的视频
    filteredVideos: (state) => {
      if (state.currentCategory === '全部') {
        return state.videos
      }
      return state.videos.filter(video => video.category === state.currentCategory)
    },

    // 获取搜索结果
    searchResults: (state) => {
      if (!state.searchQuery.trim()) {
        return state.videos
      }
      const query = state.searchQuery.toLowerCase()
      return state.videos.filter(video => 
        video.title.toLowerCase().includes(query) ||
        video.description.toLowerCase().includes(query) ||
        video.uploaderName.toLowerCase().includes(query) ||
        video.tags.some(tag => tag.toLowerCase().includes(query))
      )
    },

    // 获取收藏的视频
    favoriteVideos: (state) => {
      return state.videos.filter(video => state.favorites.includes(video.id))
    },

    // 获取观看历史的视频
    historyVideos: (state) => {
      return state.videos.filter(video => state.history.includes(video.id))
    },

    // 获取点赞的视频
    likedVideosList: (state) => {
      return state.videos.filter(video => state.likedVideos.includes(video.id))
    },

    // 格式化观看次数
    formatViews: () => (views: number) => {
      if (views >= 10000) {
        return (views / 10000).toFixed(1) + '万'
      }
      return views.toString()
    },

    // 格式化时间
    formatTime: () => (dateString: string) => {
      const date = new Date(dateString)
      const now = new Date()
      const diff = now.getTime() - date.getTime()
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      
      if (days === 0) {
        return '今天'
      } else if (days === 1) {
        return '昨天'
      } else if (days < 7) {
        return `${days}天前`
      } else if (days < 30) {
        return `${Math.floor(days / 7)}周前`
      } else if (days < 365) {
        return `${Math.floor(days / 30)}个月前`
      } else {
        return `${Math.floor(days / 365)}年前`
      }
    }
  },

  actions: {
    // 初始化数据
    async initializeData() {
      this.isLoading = true
      try {
        // 并行加载所有数据
        const [videosRes, categoriesRes, carouselRes, commentsRes] = await Promise.all([
          fetch('/data/videos.json'),
          fetch('/data/categories.json'),
          fetch('/data/carousel.json'),
          fetch('/data/comments.json')
        ])

        const [videosData, categoriesData, carouselData, commentsData] = await Promise.all([
          videosRes.json(),
          categoriesRes.json(),
          carouselRes.json(),
          commentsRes.json()
        ])

        this.videos = videosData.videos
        this.categories = categoriesData.categories
        this.carousel = carouselData.carousel
        this.comments = commentsData.comments

        // 从localStorage恢复用户状态
        this.loadUserState()
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        this.isLoading = false
      }
    },

    // 设置当前分类
    setCategory(category: string) {
      this.currentCategory = category
    },

    // 设置搜索查询
    setSearchQuery(query: string) {
      this.searchQuery = query
    },

    // 切换视频点赞状态
    toggleLike(videoId: number) {
      const video = this.videos.find(v => v.id === videoId)
      if (video) {
        video.isLiked = !video.isLiked
        if (video.isLiked) {
          video.likes++
          if (!this.likedVideos.includes(videoId)) {
            this.likedVideos.push(videoId)
          }
        } else {
          video.likes--
          this.likedVideos = this.likedVideos.filter(id => id !== videoId)
        }
        this.saveUserState()
      }
    },

    // 切换视频收藏状态
    toggleFavorite(videoId: number) {
      const video = this.videos.find(v => v.id === videoId)
      if (video) {
        video.isCollected = !video.isCollected
        if (video.isCollected) {
          if (!this.favorites.includes(videoId)) {
            this.favorites.push(videoId)
          }
        } else {
          this.favorites = this.favorites.filter(id => id !== videoId)
        }
        this.saveUserState()
      }
    },

    // 添加观看历史
    addToHistory(videoId: number) {
      if (!this.history.includes(videoId)) {
        this.history.unshift(videoId)
        // 限制历史记录数量
        if (this.history.length > 100) {
          this.history = this.history.slice(0, 100)
        }
        this.saveUserState()
      }
    },

    // 清空观看历史
    clearHistory() {
      this.history = []
      this.saveUserState()
    },

    // 清空收藏
    clearFavorites() {
      this.favorites = []
      this.videos.forEach(video => {
        video.isCollected = false
      })
      this.saveUserState()
    },

    // 轮播图控制
    nextCarousel() {
      this.currentCarouselIndex = (this.currentCarouselIndex + 1) % this.carousel.length
    },

    prevCarousel() {
      this.currentCarouselIndex = this.currentCarouselIndex === 0 
        ? this.carousel.length - 1 
        : this.currentCarouselIndex - 1
    },

    setCarouselIndex(index: number) {
      this.currentCarouselIndex = index
    },

    // 自动轮播
    startAutoCarousel() {
      setInterval(() => {
        this.nextCarousel()
      }, 2000)
    },

    // 响应式处理
    setMobile(isMobile: boolean) {
      this.isMobile = isMobile
    },

    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },

    // 用户状态持久化
    saveUserState() {
      if (typeof window !== 'undefined') {
        localStorage.setItem('bilibili-favorites', JSON.stringify(this.favorites))
        localStorage.setItem('bilibili-history', JSON.stringify(this.history))
        localStorage.setItem('bilibili-liked', JSON.stringify(this.likedVideos))
      }
    },

    loadUserState() {
      if (typeof window !== 'undefined') {
        try {
          const favorites = localStorage.getItem('bilibili-favorites')
          const history = localStorage.getItem('bilibili-history')
          const liked = localStorage.getItem('bilibili-liked')

          if (favorites) {
            this.favorites = JSON.parse(favorites)
          }
          if (history) {
            this.history = JSON.parse(history)
          }
          if (liked) {
            this.likedVideos = JSON.parse(liked)
          }

          // 同步视频状态
          this.videos.forEach(video => {
            video.isLiked = this.likedVideos.includes(video.id)
            video.isCollected = this.favorites.includes(video.id)
          })
        } catch (error) {
          console.error('Failed to load user state:', error)
        }
      }
    },

    // 模拟登录
    login(user: User) {
      this.user = user
      this.isLoggedIn = true
      if (typeof window !== 'undefined') {
        localStorage.setItem('bilibili-user', JSON.stringify(user))
      }
    },

    // 登出
    logout() {
      this.user = null
      this.isLoggedIn = false
      if (typeof window !== 'undefined') {
        localStorage.removeItem('bilibili-user')
      }
    },

    // 检查登录状态
    checkLoginStatus() {
      if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('bilibili-user')
        if (userStr) {
          try {
            const user = JSON.parse(userStr)
            this.user = user
            this.isLoggedIn = true
          } catch (error) {
            console.error('Failed to parse user data:', error)
          }
        }
      }
    }
  }
}) 