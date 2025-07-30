import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import YouTubeVideoProcessor from './youtube-video-processor.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function addYouTubeVideo() {
  const processor = new YouTubeVideoProcessor()

  // 示例：您可以提供YouTube视频的HTML代码或视频ID
  console.log('=== 添加新的YouTube视频 ===')
  console.log('请提供以下信息之一：')
  console.log('1. YouTube视频ID (例如: dQw4w9WgXcQ)')
  console.log('2. YouTube完整URL (例如: https://www.youtube.com/watch?v=dQw4w9WgXcQ)')
  console.log('3. YouTube视频HTML代码')
  console.log('')

  // 这里您可以手动输入视频信息
  // 示例：添加一个知名YouTube视频
  const videoInputs = [
    // 方式1: 直接提供视频ID
    "jNQXAC9IVRw", // "Me at the zoo" - YouTube第一个视频

    // 方式2: 提供完整URL
    "https://www.youtube.com/watch?v=kJQP7kiw5Fk", // Despacito

    // 方式3: 提供HTML代码（如果您有的话）
    {
      html: `<a id="thumbnail" class="yt-simple-endpoint style-scope ytd-playlist-thumbnail" tabindex="-1" aria-hidden="true" href="/watch?v=9bZkp7q19f0">
        <div id="playlist-thumbnails" class="style-scope ytd-playlist-thumbnail"></div>
        <yt-formatted-string id="length" class="style-scope ytd-playlist-thumbnail" aria-label="4分钟12秒钟">4:12</yt-formatted-string>
        <div id="overlays" class="style-scope ytd-playlist-thumbnail">
          <!-- 其他HTML内容 -->
        </div>
      </a>`
    }
  ]

  try {
    console.log('开始处理YouTube视频...')

    // 处理视频信息
    const processedVideos = await processor.processYouTubeVideos(videoInputs)

    if (processedVideos.length > 0) {
      // 读取现有的JSON数据
      const existingDataPath = path.join(__dirname, '../public/data/youtube-videos/example-batch.json')
      let existingData = { videos: [], totalCount: 0, generatedAt: '' }

      if (fs.existsSync(existingDataPath)) {
        existingData = JSON.parse(fs.readFileSync(existingDataPath, 'utf8'))
      }

      // 为新视频分配ID
      const maxId = existingData.videos.length > 0 ? Math.max(...existingData.videos.map(v => v.id)) : 0

      processedVideos.forEach((video, index) => {
        video.id = maxId + index + 1
      })

      // 添加到现有数据
      existingData.videos.push(...processedVideos)
      existingData.totalCount = existingData.videos.length
      existingData.generatedAt = new Date().toISOString()

      // 保存更新后的数据
      fs.writeFileSync(existingDataPath, JSON.stringify(existingData, null, 2))

      console.log(`\n✓ 成功添加 ${processedVideos.length} 个新视频到JSON数据中`)
      console.log('新添加的视频:')
      processedVideos.forEach(video => {
        console.log(`  - ${video.title} (ID: ${video.youtubeId})`)
      })
      console.log(`✓ 总视频数量: ${existingData.totalCount}`)
      console.log(`✓ 数据已保存到: ${existingDataPath}`)

      return processedVideos
    } else {
      console.log('没有成功处理任何视频')
      return []
    }
  } catch (error) {
    console.error('处理过程中出错:', error.message)
    return []
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  addYouTubeVideo()
}

export default addYouTubeVideo
