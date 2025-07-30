import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// YouTube视频信息处理器
class YouTubeVideoProcessor {
  constructor() {
    this.videosDataPath = path.join(__dirname, '../public/data/videos.json')
    this.outputDir = path.join(__dirname, '../public/data/youtube-videos')
    this.thumbnailsDir = path.join(__dirname, '../public/thumbnails/youtube')

    // 确保输出目录存在
    this.ensureDirectories()
  }

  // 确保必要的目录存在
  ensureDirectories() {
    const dirs = [this.outputDir, this.thumbnailsDir]
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
    })
  }

  // 从YouTube URL或HTML中提取视频ID
  extractVideoId(input) {
    // 支持多种输入格式
    const patterns = [
      /\/watch\?v=([a-zA-Z0-9_-]{11})/, // 标准YouTube URL
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/, // 完整URL
      /youtu\.be\/([a-zA-Z0-9_-]{11})/, // 短链接
      /embed\/([a-zA-Z0-9_-]{11})/, // 嵌入链接
      /vi\/([a-zA-Z0-9_-]{11})/, // 缩略图URL中的ID
      /"([a-zA-Z0-9_-]{11})"/, // 引号包围的ID
      /([a-zA-Z0-9_-]{11})/ // 单独的11位ID
    ]

    for (const pattern of patterns) {
      const match = input.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }

    return null
  }

  // 从HTML代码中提取视频信息
  extractVideoInfoFromHTML(htmlCode) {
    const videoId = this.extractVideoId(htmlCode)
    if (!videoId) {
      throw new Error('无法从HTML代码中提取视频ID')
    }

    // 提取时长信息
    const durationMatch = htmlCode.match(/(\d{1,2}):(\d{2})/)
    const duration = durationMatch ? `${durationMatch[1]}:${durationMatch[2]}` : '0:00'

    // 提取缩略图URL
    const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hq720.jpg`

    return {
      videoId,
      duration,
      thumbnailUrl,
      videoUrl: `https://www.youtube.com/watch?v=${videoId}`
    }
  }

  // 生成YouTube视频数据
  generateYouTubeVideoData(videoInfo, index = 1) {
    const categories = [
      { name: "Automotive", id: 1 },
      { name: "Motorcycles", id: 2 },
      { name: "AI", id: 3 },
      { name: "Finance", id: 4 },
      { name: "Cybersecurity", id: 5 },
      { name: "Commerce and Industry", id: 6 },
      { name: "Home Design", id: 7 },
      { name: "Luxury Travel", id: 8 },
      { name: "Dentistry", id: 9 },
      { name: "Elderly Care", id: 10 }
    ]

    const randomCategory = categories[Math.floor(Math.random() * categories.length)]
    const uploaders = ["YouTube Creator", "Popular Channel", "Verified Creator", "Official Channel"]
    const randomUploader = uploaders[Math.floor(Math.random() * uploaders.length)]

    // 生成随机数据
    const views = Math.floor(Math.random() * 10000000) + 1000
    const likes = Math.floor(views * (Math.random() * 0.1 + 0.05))
    const comments = Math.floor(likes * (Math.random() * 0.2 + 0.1))

    return {
      id: index,
      title: this.generateVideoTitle(videoInfo.videoId),
      thumbnailUrl: videoInfo.thumbnailUrl,
      videoUrl: videoInfo.videoUrl,
      views,
      likes,
      comments,
      duration: videoInfo.duration,
      uploaderName: randomUploader,
      uploadDate: this.generateRandomDate(),
      category: randomCategory.name,
      categoryId: randomCategory.id,
      description: this.generateVideoDescription(videoInfo.videoId),
      tags: ["YouTube", "Video", "Online", "Streaming"],
      isLiked: false,
      isCollected: false,
      youtubeId: videoInfo.videoId
    }
  }

  // 生成随机日期
  generateRandomDate() {
    const start = new Date(2020, 0, 1)
    const end = new Date()
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    return randomDate.toISOString().split('T')[0]
  }

  // 生成视频标题
  generateVideoTitle(videoId) {
    // 为知名YouTube视频生成特定标题
    const videoTitles = {
      'lJx6M7SqkvI': 'Korean War Historical Review - November 12, 1950',
      'dQw4w9WgXcQ': 'Rick Astley - Never Gonna Give You Up',
      '9bZkp7q19f0': 'PSY - GANGNAM STYLE',
      'XqZsoesa55w': 'Baby Shark Dance - Sing and Dance!',
      'kffacxfA7G4': 'Justin Bieber - Baby ft. Ludacris',
      'kJQP7kiw5Fk': 'Luis Fonsi - Despacito ft. Daddy Yankee',
      'JGwWNGJdvx8': 'Ed Sheeran - Shape of You',
      'HV1rC2JBuaQ': 'PUBG Gameplay - Amazing Battle Royale Action',
      'Z4uMGb5isVg': 'High-Quality Gaming Video - Z4uMGb5isVg',
      '97JkxJsYIng': 'High-Quality Gaming Video - 97JkxJsYIng',
      'Ha3BltR_Q6A': 'High-Quality Gaming Video - Ha3BltR_Q6A',
      '0jwh5FvVzco': '20 Single Player Games You\'ll Be OBSESSED With - 0jwh5FvVzco',
      'r9WGd3TALaw': 'Single Player Games Review - r9WGd3TALaw'
    }

    // 如果有特定标题，返回特定标题；否则返回通用标题
    return videoTitles[videoId] || `YouTube Video - ${videoId}`
  }

  // 生成视频描述
  generateVideoDescription(videoId) {
    // 为知名YouTube视频生成特定描述
    const videoDescriptions = {
      'lJx6M7SqkvI': 'This is a historical review video about the Korean War, documenting the important historical moment of November 12, 1950. The video shows maps of the Korean Peninsula and related historical materials, providing detailed information about important events and impacts during the war period.',
      'dQw4w9WgXcQ': 'Official music video for Rick Astley\'s classic song "Never Gonna Give You Up". This 1987 release became an iconic work of internet culture, known for its unique melody and Rick Astley\'s heartfelt vocals.',
      '9bZkp7q19f0': 'Official music video for PSY\'s "Gangnam Style", which swept the globe in 2012 and set YouTube viewing records. The video showcases the fashionable lifestyle of Seoul\'s Gangnam district, accompanied by PSY\'s unique horse-riding dance moves.',
      'XqZsoesa55w': 'Official music video for "Baby Shark" by Pinkfong. This catchy children\'s song became a global phenomenon, teaching kids about family members through fun music and dance moves.',
      'kffacxfA7G4': 'Official music video for "Baby" by Justin Bieber featuring Ludacris. This 2010 hit became one of the most viewed videos on YouTube, launching Justin Bieber\'s global career.',
      'kJQP7kiw5Fk': 'Official music video for "Despacito" by Luis Fonsi featuring Daddy Yankee. This 2017 hit became one of the most viewed videos on YouTube, showcasing Latin music\'s global appeal.',
      'JGwWNGJdvx8': 'Official music video for "Shape of You" by Ed Sheeran. This 2017 hit became one of the most streamed songs globally, showcasing Ed Sheeran\'s unique musical style and storytelling.',
      'HV1rC2JBuaQ': 'Epic PUBG gameplay featuring intense battle royale action. Watch as players compete in this popular multiplayer shooter game with strategic gameplay and exciting moments.',
      'Z4uMGb5isVg': 'High-quality gaming content featuring amazing gameplay and entertainment. This video showcases the best in gaming with excellent graphics and engaging content. Video ID: Z4uMGb5isVg',
      '97JkxJsYIng': 'High-quality gaming content featuring amazing gameplay and entertainment. This video showcases the best in gaming with excellent graphics and engaging content. Video ID: 97JkxJsYIng',
      'Ha3BltR_Q6A': 'High-quality gaming content featuring amazing gameplay and entertainment. This video showcases the best in gaming with excellent graphics and engaging content. Video ID: Ha3BltR_Q6A',
      '0jwh5FvVzco': 'Amazing compilation of 20 single player games that will keep you hooked after the first hour. This comprehensive gaming guide showcases the best single player experiences with detailed gameplay analysis and recommendations. Video ID: 0jwh5FvVzco',
      'r9WGd3TALaw': 'In-depth review of single player games that will captivate you from the start. This video provides detailed analysis of gameplay mechanics, story elements, and overall gaming experience. Video ID: r9WGd3TALaw'
    }

    // 如果有特定描述，返回特定描述；否则返回通用描述
    return videoDescriptions[videoId] || `This is an exciting video from YouTube, video ID: ${videoId}. The video content is rich and interesting, worth watching and sharing.`
  }

  // 批量处理YouTube视频信息
  async processYouTubeVideos(videoInputs) {
    const processedVideos = []

    for (let i = 0; i < videoInputs.length; i++) {
      const input = videoInputs[i]
      try {
        console.log(`处理第 ${i + 1} 个视频...`)

        let videoInfo
        if (typeof input === 'string') {
          // 如果是字符串，尝试提取视频ID
          const videoId = this.extractVideoId(input)
          if (videoId) {
            videoInfo = {
              videoId,
              duration: '0:00',
              thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hq720.jpg`,
              videoUrl: `https://www.youtube.com/watch?v=${videoId}`
            }
          } else {
            throw new Error('无法从输入中提取视频ID')
          }
        } else if (input.html) {
          // 如果是包含HTML的对象
          videoInfo = this.extractVideoInfoFromHTML(input.html)
        } else {
          throw new Error('无效的输入格式')
        }

        const videoData = this.generateYouTubeVideoData(videoInfo, i + 1)
        processedVideos.push(videoData)

        console.log(`✓ 成功处理视频: ${videoInfo.videoId}`)
      } catch (error) {
        console.error(`✗ 处理第 ${i + 1} 个视频时出错:`, error.message)
      }
    }

    return processedVideos
  }

  // 保存处理后的视频数据
  saveProcessedVideos(videos, filename = 'youtube-videos.json') {
    const outputPath = path.join(this.outputDir, filename)
    const data = {
      videos,
      totalCount: videos.length,
      generatedAt: new Date().toISOString()
    }

    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2))
    console.log(`✓ 视频数据已保存到: ${outputPath}`)
    return outputPath
  }

  // 合并到现有的videos.json文件
  mergeWithExistingVideos(newVideos) {
    try {
      const existingData = JSON.parse(fs.readFileSync(this.videosDataPath, 'utf8'))
      const maxId = Math.max(...existingData.videos.map(v => v.id))

      // 为新视频分配ID
      newVideos.forEach((video, index) => {
        video.id = maxId + index + 1
      })

      // 合并视频数据
      existingData.videos = [...existingData.videos, ...newVideos]

      // 备份原文件
      const backupPath = this.videosDataPath.replace('.json', '.backup.json')
      fs.copyFileSync(this.videosDataPath, backupPath)
      console.log(`✓ 原文件已备份到: ${backupPath}`)

      // 保存合并后的数据
      fs.writeFileSync(this.videosDataPath, JSON.stringify(existingData, null, 2))
      console.log(`✓ 已成功合并 ${newVideos.length} 个新视频到现有数据`)

      return true
    } catch (error) {
      console.error('合并视频数据时出错:', error.message)
      return false
    }
  }

  // 下载缩略图
  async downloadThumbnail(videoId, quality = 'hq720') {
    const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`
    const localPath = path.join(this.thumbnailsDir, `${videoId}.jpg`)

    try {
      const response = await fetch(thumbnailUrl)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const buffer = await response.arrayBuffer()
      fs.writeFileSync(localPath, Buffer.from(buffer))
      console.log(`✓ 缩略图已下载: ${localPath}`)
      return localPath
    } catch (error) {
      console.error(`下载缩略图失败: ${error.message}`)
      return null
    }
  }

  // 批量下载缩略图
  async downloadAllThumbnails(videos) {
    console.log('开始下载缩略图...')
    const downloadPromises = videos.map(video =>
      this.downloadThumbnail(video.youtubeId || video.videoId)
    )

    const results = await Promise.allSettled(downloadPromises)
    const successful = results.filter(r => r.status === 'fulfilled').length
    const failed = results.filter(r => r.status === 'rejected').length

    console.log(`缩略图下载完成: ${successful} 成功, ${failed} 失败`)
  }
}

// 使用示例
async function main() {
  const processor = new YouTubeVideoProcessor()

  // 示例输入数据
  const videoInputs = [
    // 从您提供的HTML代码中提取的视频
    {
      html: `<a id="thumbnail" class="yt-simple-endpoint style-scope ytd-playlist-thumbnail" tabindex="-1" aria-hidden="true" href="/watch?v=lJx6M7SqkvI">
        <div id="playlist-thumbnails" class="style-scope ytd-playlist-thumbnail"></div>
        <yt-formatted-string id="length" class="style-scope ytd-playlist-thumbnail" aria-label="8分钟41秒钟">8:41</yt-formatted-string>
        <div id="overlays" class="style-scope ytd-playlist-thumbnail">
          <!-- 其他HTML内容 -->
        </div>
      </a>`
    },
    // 也可以直接提供视频ID
    "lJx6M7SqkvI",
    // 或者提供完整的YouTube URL
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  ]

  try {
    console.log('开始处理YouTube视频信息...')

    // 处理视频信息
    const processedVideos = await processor.processYouTubeVideos(videoInputs)

    if (processedVideos.length > 0) {
      // 保存到单独的文件
      processor.saveProcessedVideos(processedVideos)

      // 合并到现有数据（可选）
      const merge = process.argv.includes('--merge')
      if (merge) {
        processor.mergeWithExistingVideos(processedVideos)
      }

      // 下载缩略图（可选）
      const downloadThumbnails = process.argv.includes('--thumbnails')
      if (downloadThumbnails) {
        await processor.downloadAllThumbnails(processedVideos)
      }

      console.log(`\n处理完成！共处理了 ${processedVideos.length} 个视频`)
    } else {
      console.log('没有成功处理任何视频')
    }
  } catch (error) {
    console.error('处理过程中出错:', error.message)
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export default YouTubeVideoProcessor
