import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import YouTubeVideoProcessor from './youtube-video-processor.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function processNewVideo() {
  const processor = new YouTubeVideoProcessor()

  // 从视频元素中提取的信息
  // 视频ID需要从实际的YouTube URL中获取
  // 这里我假设您有一个新的视频ID
  const newVideoId = 'c7f8439b-c97b-463a-ae77-42229ed3fd24' // 从blob URL中提取的ID

  // 创建HTML片段来模拟YouTube视频信息
  const videoHTML = `
    <a id="thumbnail" class="yt-simple-endpoint style-scope ytd-playlist-thumbnail" tabindex="-1" aria-hidden="true" href="/watch?v=${newVideoId}">
      <div id="playlist-thumbnails" class="style-scope ytd-playlist-thumbnail"></div>
      <yt-formatted-string id="length" class="style-scope ytd-playlist-thumbnail" aria-label="5分钟30秒钟">5:30</yt-formatted-string>
      <div id="overlays" class="style-scope ytd-playlist-thumbnail">
        <!-- 其他HTML内容 -->
      </div>
    </a>
  `

  try {
    console.log('开始处理新的YouTube视频...')

    // 处理视频信息
    const videoInputs = [{ html: videoHTML }]
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
      processedVideos[0].id = maxId + 1

      // 添加到现有数据
      existingData.videos.push(processedVideos[0])
      existingData.totalCount = existingData.videos.length
      existingData.generatedAt = new Date().toISOString()

      // 保存更新后的数据
      fs.writeFileSync(existingDataPath, JSON.stringify(existingData, null, 2))

      console.log(`✓ 新视频已添加到JSON数据中`)
      console.log(`✓ 视频ID: ${processedVideos[0].youtubeId}`)
      console.log(`✓ 视频标题: ${processedVideos[0].title}`)
      console.log(`✓ 总视频数量: ${existingData.totalCount}`)

      return processedVideos[0]
    } else {
      console.log('没有成功处理任何视频')
      return null
    }
  } catch (error) {
    console.error('处理过程中出错:', error.message)
    return null
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  processNewVideo()
}

export default processNewVideo
