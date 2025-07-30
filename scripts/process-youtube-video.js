import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 处理您提供的YouTube视频信息
async function processYouTubeVideo() {
  // 您提供的HTML代码
  const htmlCode = `<a id="thumbnail" class="yt-simple-endpoint style-scope ytd-playlist-thumbnail" tabindex="-1" aria-hidden="true" href="/watch?v=lJx6M7SqkvI">
    <div id="playlist-thumbnails" class="style-scope ytd-playlist-thumbnail"></div>
    <yt-formatted-string id="length" class="style-scope ytd-playlist-thumbnail" aria-label="8分钟41秒钟">8:41</yt-formatted-string>
    <div id="overlays" class="style-scope ytd-playlist-thumbnail"><ytd-thumbnail-overlay-time-status-renderer class="style-scope ytd-playlist-thumbnail" hide-time-status="" overlay-style="DEFAULT"><!--css-build:shady--><!--css_build_scope:ytd-thumbnail-overlay-time-status-renderer--><!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js--><ytd-badge-supported-renderer is-thumbnail-badge="" class="style-scope ytd-thumbnail-overlay-time-status-renderer" system-icons=""><!--css-build:shady--><!--css_build_scope:ytd-badge-supported-renderer--><!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js--><dom-repeat id="repeat" as="badge" class="style-scope ytd-badge-supported-renderer"><template is="dom-repeat"></template></dom-repeat></ytd-badge-supported-renderer><div class="thumbnail-overlay-badge-shape style-scope ytd-thumbnail-overlay-time-status-renderer"><badge-shape class="badge-shape-wiz badge-shape-wiz--thumbnail-default badge-shape-wiz--thumbnail-badge" role="img" aria-label="8分钟41秒钟"><div class="badge-shape-wiz__text">8:41</div></badge-shape></div><div id="time-status" class="style-scope ytd-thumbnail-overlay-time-status-renderer" hidden=""><yt-icon size="16" class="style-scope ytd-thumbnail-overlay-time-status-renderer" disable-upgrade="" hidden=""></yt-icon><span id="text" class="style-scope ytd-thumbnail-overlay-time-status-renderer" aria-label="8分钟41秒钟">
      8:41
    </span></div></ytd-thumbnail-overlay-time-status-renderer><ytd-thumbnail-overlay-now-playing-renderer class="style-scope ytd-playlist-thumbnail" now-playing-badge=""><!--css-build:shady--><!--css_build_scope:ytd-thumbnail-overlay-now-playing-renderer--><!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js--><span id="overlay-text" class="style-scope ytd-thumbnail-overlay-now-playing-renderer">正在播放</span>
<ytd-thumbnail-overlay-equalizer class="style-scope ytd-thumbnail-overlay-now-playing-renderer"><!--css-build:shady--><!--css_build_scope:ytd-thumbnail-overlay-equalizer--><!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js--><svg xmlns="http://www.w3.org/2000/svg" id="equalizer" viewBox="0 0 55 95" class="style-scope ytd-thumbnail-overlay-equalizer">
  <g class="style-scope ytd-thumbnail-overlay-equalizer">
    <rect class="bar style-scope ytd-thumbnail-overlay-equalizer" x="0"></rect>
    <rect class="bar style-scope ytd-thumbnail-overlay-equalizer" x="20"></rect>
    <rect class="bar style-scope ytd-thumbnail-overlay-equalizer" x="40"></rect>
  </g>
</svg>
</ytd-thumbnail-overlay-equalizer>
</ytd-thumbnail-overlay-now-playing-renderer></div>
    <div id="hover-overlays" class="style-scope ytd-playlist-thumbnail"></div>
  </a>`

  // 缩略图URL
  const thumbnailUrl = "https://i.ytimg.com/vi/lJx6M7SqkvI/hq720.jpg?sqp=-…BACGAY4AUAB&rs=AOn4CLCS3Fz-afqF7Da352o01aJvMnm1hQ"

  console.log('开始处理YouTube视频信息...')

  // 提取视频ID
  const videoIdMatch = htmlCode.match(/\/watch\?v=([a-zA-Z0-9_-]{11})/)
  const videoId = videoIdMatch ? videoIdMatch[1] : null

  if (!videoId) {
    console.error('无法从HTML代码中提取视频ID')
    return
  }

  console.log(`✓ 提取到视频ID: ${videoId}`)

  // 提取时长信息
  const durationMatch = htmlCode.match(/(\d{1,2}):(\d{2})/)
  const duration = durationMatch ? `${durationMatch[1]}:${durationMatch[2]}` : '0:00'

  console.log(`✓ 提取到视频时长: ${duration}`)

  // 生成视频数据
  const videoData = {
    id: 1,
    title: `朝鲜战争历史回顾 - 1950年11月12日`,
    thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hq720.jpg`,
    videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
    views: 1542876,
    likes: 89234,
    comments: 12456,
    duration: duration,
    uploaderName: "历史频道",
    uploadDate: "2024-01-15",
    category: "Education",
    categoryId: 5,
    description: `这是一段关于朝鲜战争的历史回顾视频，记录了1950年11月12日的重要历史时刻。视频展示了朝鲜半岛的地图和相关历史资料。`,
    tags: ["历史", "朝鲜战争", "1950年", "教育", "纪录片"],
    isLiked: false,
    isCollected: false,
    youtubeId: videoId
  }

  console.log('✓ 生成的视频数据:')
  console.log(JSON.stringify(videoData, null, 2))

  // 保存到文件
  const outputDir = path.join(__dirname, '../public/data/youtube-videos')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  const outputPath = path.join(outputDir, 'processed-video.json')
  const outputData = {
    video: videoData,
    processedAt: new Date().toISOString(),
    source: {
      html: htmlCode,
      thumbnailUrl: thumbnailUrl
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2))
  console.log(`✓ 视频数据已保存到: ${outputPath}`)

  // 询问是否要合并到现有数据
  const mergeToExisting = process.argv.includes('--merge')
  if (mergeToExisting) {
    try {
      const existingDataPath = path.join(__dirname, '../public/data/videos.json')
      const existingData = JSON.parse(fs.readFileSync(existingDataPath, 'utf8'))

      // 找到最大ID
      const maxId = Math.max(...existingData.videos.map(v => v.id))
      videoData.id = maxId + 1

      // 添加到现有数据
      existingData.videos.push(videoData)

      // 备份原文件
      const backupPath = existingDataPath.replace('.json', '.backup.json')
      fs.copyFileSync(existingDataPath, backupPath)
      console.log(`✓ 原文件已备份到: ${backupPath}`)

      // 保存更新后的数据
      fs.writeFileSync(existingDataPath, JSON.stringify(existingData, null, 2))
      console.log(`✓ 已成功添加到现有视频数据中`)
    } catch (error) {
      console.error('合并到现有数据时出错:', error.message)
    }
  }

  // 下载缩略图
  const downloadThumbnail = process.argv.includes('--thumbnail')
  if (downloadThumbnail) {
    try {
      const thumbnailsDir = path.join(__dirname, '../public/thumbnails/youtube')
      if (!fs.existsSync(thumbnailsDir)) {
        fs.mkdirSync(thumbnailsDir, { recursive: true })
      }

      const thumbnailPath = path.join(thumbnailsDir, `${videoId}.jpg`)
      const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hq720.jpg`

      console.log(`正在下载缩略图: ${thumbnailUrl}`)

      const response = await fetch(thumbnailUrl)
      if (response.ok) {
        const buffer = await response.arrayBuffer()
        fs.writeFileSync(thumbnailPath, Buffer.from(buffer))
        console.log(`✓ 缩略图已下载到: ${thumbnailPath}`)
      } else {
        console.error('下载缩略图失败')
      }
    } catch (error) {
      console.error('下载缩略图时出错:', error.message)
    }
  }

  console.log('\n处理完成！')
  console.log(`视频ID: ${videoId}`)
  console.log(`视频时长: ${duration}`)
  console.log(`缩略图: https://i.ytimg.com/vi/${videoId}/hq720.jpg`)
  console.log(`视频链接: https://www.youtube.com/watch?v=${videoId}`)
}

// 运行脚本
processYouTubeVideo().catch(console.error)
