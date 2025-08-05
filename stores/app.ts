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
  youtubeId?: string
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
    currentCategory: 'All',
    searchQuery: '',
    isLoading: false,

    // 分页相关
    currentPage: 1,
    videosPerPage: 20,
    hasMoreVideos: true,

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
      if (!state.videos || state.videos.length === 0) {
        return []
      }
      if (state.currentCategory === 'All') {
        return state.videos
      }
      return state.videos.filter(video => video.category === state.currentCategory)
    },

    // 获取分页后的视频
    paginatedVideos: (state) => {
      const filtered = state.currentCategory === 'All'
        ? state.videos
        : state.videos.filter(video => video.category === state.currentCategory)

      const startIndex = (state.currentPage - 1) * state.videosPerPage
      const endIndex = startIndex + state.videosPerPage

      return filtered.slice(0, endIndex)
    },

    // 检查是否还有更多视频
    hasMore: (state) => {
      const filtered = state.currentCategory === 'All'
        ? state.videos
        : state.videos.filter(video => video.category === state.currentCategory)

      return state.currentPage * state.videosPerPage < filtered.length
    },

    // 获取总页数
    totalPages: (state) => {
      const filtered = state.currentCategory === 'All'
        ? state.videos
        : state.videos.filter(video => video.category === state.currentCategory)

      return Math.ceil(filtered.length / state.videosPerPage)
    },

    // 获取当前分类的视频总数
    currentCategoryVideoCount: (state) => {
      if (state.currentCategory === 'All') {
        return state.videos.length
      }
      return state.videos.filter(video => video.category === state.currentCategory).length
    },

    // 获取推荐视频（按类别分组，每个类别随机12个视频）
    recommendedVideos: (state) => {
      const categories = ['Automotive', 'AI', 'Finance', 'Cybersecurity', 'Commerce and Industry', 'Motorcycles', 'Home Design', 'Luxury Travel', 'Dentistry', 'Elderly Care']
      const recommended: Record<string, Video[]> = {}

      categories.forEach(category => {
        const categoryVideos = state.videos.filter(video => video.category === category)
        if (categoryVideos.length > 0) {
          // 使用固定的排序方式，基于视频ID进行排序，确保状态一致性
          const sorted = [...categoryVideos].sort((a, b) => {
            // 使用视频ID的哈希值来创建伪随机排序
            const hashA = (a.id * 9301 + 49297) % 233280
            const hashB = (b.id * 9301 + 49297) % 233280
            return hashA - hashB
          })
          recommended[category] = sorted.slice(0, 12)
        }
      })

      return recommended
    },

    // 获取收藏的视频
    favoriteVideos: (state) => {
      const favorites = state.videos.filter(video => state.favorites.includes(video.id))
      console.log('Favorite videos:', {
        favorites: state.favorites,
        videos: state.videos.length,
        result: favorites.length
      })
      return favorites
    },

    // 获取历史记录的视频
    historyVideos: (state) => {
      const history = state.videos.filter(video => state.history.includes(video.id))
      console.log('History videos:', {
        history: state.history,
        videos: state.videos.length,
        result: history.length
      })
      return history
    },

    // 获取搜索结果
    searchResults: (state) => {
      if (!state.searchQuery || state.searchQuery.trim() === '') {
        return []
      }

      const query = state.searchQuery.toLowerCase().trim()
      const results = state.videos.filter(video => {
        return video.title.toLowerCase().includes(query) ||
               video.description.toLowerCase().includes(query) ||
               video.category.toLowerCase().includes(query) ||
               video.uploaderName.toLowerCase().includes(query) ||
               video.tags.some(tag => tag.toLowerCase().includes(query))
      })

      console.log('Search results:', {
        query: state.searchQuery,
        totalVideos: state.videos.length,
        results: results.length
      })

      return results
    },

    // 格式化观看次数
    formatViews: () => (views: number) => {
      if (views >= 1000000) {
        return (views / 1000000).toFixed(1) + 'M'
      } else if (views >= 1000) {
        return (views / 1000).toFixed(1) + 'K'
      }
      return views.toString()
    },

    // 格式化时间
    formatTime: () => (dateString: string) => {
      try {
        const date = new Date(dateString)
        const now = new Date()
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

        if (diffInSeconds < 60) {
          return 'Just now'
        } else if (diffInSeconds < 3600) {
          const minutes = Math.floor(diffInSeconds / 60)
          return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
        } else if (diffInSeconds < 86400) {
          const hours = Math.floor(diffInSeconds / 3600)
          return `${hours} hour${hours > 1 ? 's' : ''} ago`
        } else if (diffInSeconds < 2592000) {
          const days = Math.floor(diffInSeconds / 86400)
          return `${days} day${days > 1 ? 's' : ''} ago`
        } else if (diffInSeconds < 31536000) {
          const months = Math.floor(diffInSeconds / 2592000)
          return `${months} month${months > 1 ? 's' : ''} ago`
        } else {
          const years = Math.floor(diffInSeconds / 31536000)
          return `${years} year${years > 1 ? 's' : ''} ago`
        }
      } catch (error) {
        return 'Unknown'
      }
    }
  },

  actions: {
    // 初始化数据
    async initializeData() {
      this.isLoading = true
      try {
        // 并行加载所有数据
        const [videosRes, categoriesRes, carouselRes] = await Promise.all([
          fetch('/data/youtube-videos/example-batch.json'),
          fetch('/data/categories.json'),
          fetch('/data/carousel.json')
        ])

        const [videosData, categoriesData, carouselData] = await Promise.all([
          videosRes.json(),
          categoriesRes.json(),
          carouselRes.json()
        ])

        // 从新的数据结构中提取所有视频
        this.videos = []
        if (videosData.categories) {
          Object.values(videosData.categories).forEach((category: any) => {
            if (category.videos && Array.isArray(category.videos)) {
              this.videos.push(...category.videos)
            }
          })
        }
        this.categories = categoriesData.categories
        this.carousel = carouselData.carousel
        this.comments = [] // 暂时使用空数组

        // 重置分页状态
        this.currentPage = 1
        this.hasMoreVideos = true

        // 从localStorage恢复用户状态（在视频数据加载完成后）
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
      // 切换分类时重置分页
      this.currentPage = 1
      this.hasMoreVideos = true
    },

    // 设置搜索查询
    setSearchQuery(query: string) {
      this.searchQuery = query
      // 搜索时重置分页
      this.currentPage = 1
      this.hasMoreVideos = true
    },

    // 加载更多视频
    loadMoreVideos() {
      if (this.hasMore) {
        this.currentPage++
        this.hasMoreVideos = this.hasMore
      }
    },

    // 重置分页
    resetPagination() {
      this.currentPage = 1
      this.hasMoreVideos = true
    },

    // 设置每页视频数量
    setVideosPerPage(count: number) {
      this.videosPerPage = count
      this.resetPagination()
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
        console.log(`Toggle favorite for video ${videoId}:`, {
          isCollected: video.isCollected,
          favorites: this.favorites
        })
        this.saveUserState()
      } else {
        console.warn(`Video with ID ${videoId} not found`)
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
        console.log(`Added video ${videoId} to history:`, this.history)
        this.saveUserState()
      }
    },

    // 清除观看历史
    clearHistory() {
      this.history = []
      this.saveUserState()
    },

    // 清除收藏
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

    startAutoCarousel() {
      setInterval(() => {
        this.nextCarousel()
      }, 3000)
    },

    // 响应式控制
    setMobile(isMobile: boolean) {
      this.isMobile = isMobile
    },

    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },

    // 用户状态持久化
    saveUserState() {
      if (process.client) {
        const userState = {
          favorites: this.favorites,
          history: this.history,
          likedVideos: this.likedVideos
        }
        localStorage.setItem('userState', JSON.stringify(userState))

        console.log('User state saved:', userState)
      }
    },

    loadUserState() {
      if (process.client) {
        try {
          const savedState = localStorage.getItem('userState')
          if (savedState) {
            const state = JSON.parse(savedState)
            this.favorites = state.favorites || []
            this.history = state.history || []
            this.likedVideos = state.likedVideos || []

            // 恢复视频状态
            this.videos.forEach(video => {
              video.isLiked = this.likedVideos.includes(video.id)
              video.isCollected = this.favorites.includes(video.id)
            })

            console.log('User state loaded:', {
              favorites: this.favorites,
              history: this.history,
              likedVideos: this.likedVideos
            })
          }
        } catch (error) {
          console.error('Failed to load user state:', error)
        }
      }
    },

    // 用户认证
    login(user: User) {
      this.user = user
      this.isLoggedIn = true
      this.saveUserState()
    },

    logout() {
      this.user = null
      this.isLoggedIn = false
      this.favorites = []
      this.history = []
      this.likedVideos = []
      this.saveUserState()
    },

    checkLoginStatus() {
      // 这里可以添加检查登录状态的逻辑
      return this.isLoggedIn
    }
  }
})
