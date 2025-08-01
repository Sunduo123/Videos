import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const VIDEO_DATA_PATH = path.join(__dirname, '../public/data/youtube-videos/example-batch.json')

console.log('🎬 通用视频添加工具')
console.log('=' * 40)

// 从命令行参数获取类别和数据源
const category = process.argv[2] || 'Motorcycles'
const dataSource = process.argv[3] || ''

console.log(`📹 目标类别: ${category}`)
console.log('')

if (!dataSource) {
  console.log('❌ 请提供视频数据！')
  console.log('使用方法: node scripts/universal-video-adder.js [类别] [视频数据或文件路径]')
  console.log('')
  console.log('视频数据格式: youtubeId1:duration1:title1,youtubeId2:duration2:title2,...')
  console.log('文件格式: 每行一个视频，格式为 youtubeId:duration:title')
  console.log('示例: node scripts/universal-video-adder.js Motorcycles "abc123:10:30:Test Video,def456:5:15:Another Video"')
  console.log('示例: node scripts/universal-video-adder.js Motorcycles temp-video-data.txt')
  process.exit(1)
}

// 读取视频数据
let videosData = ''
if (dataSource.endsWith('.txt')) {
  try {
    videosData = fs.readFileSync(dataSource, 'utf8')
    console.log(`📁 从文件读取数据: ${dataSource}`)
  } catch (error) {
    console.error(`❌ 无法读取文件 ${dataSource}:`, error.message)
    process.exit(1)
  }
} else {
  videosData = dataSource
}

// 解析视频数据
function parseVideosData(dataString) {
  const videos = []

  // 检查是否是文件格式（每行一个视频）
  const lines = dataString.split('\n').filter(line => line.trim())

  for (const line of lines) {
    const parts = line.trim().split(':')
    if (parts.length >= 3) {
      videos.push({
        youtubeId: parts[0],
        duration: parts[1] + ':' + parts[2],
        title: parts.slice(3).join(':') // 标题可能包含冒号
      })
    }
  }

  return videos
}

// 生成智能标题
function generateSmartTitle(video, category) {
  const currentTitle = video.title

  if (category === 'Automotive') {
    if (currentTitle.includes('Pickup Truck')) {
      return `2024 ${getRandomBrand()} ${getRandomModel()} Review & Test Drive`
    } else if (currentTitle.includes('SUV')) {
      return `2024 ${getRandomBrand()} SUV Review & Comparison`
    } else if (currentTitle.includes('New Car')) {
      return `2024 ${getRandomBrand()} ${getRandomModel()} First Drive Review`
    } else if (currentTitle.includes('Luxury Car')) {
      return `2024 ${getRandomBrand()} ${getRandomModel()} Luxury Car Review`
    } else if (currentTitle.includes('EV')) {
      return `2024 ${getRandomBrand()} Electric Vehicle Review & Test`
    } else if (currentTitle.includes('Car Shorts')) {
      return `Quick ${getRandomBrand()} Car Review & Tips`
    }
  } else if (category === 'Motorcycles') {
    if (currentTitle.includes('New Motorcycle')) {
      return `2024 ${getRandomMotorcycleBrand()} ${getRandomMotorcycleModel()} Review`
    } else if (currentTitle.includes('Motorcycle Technology')) {
      return `2024 Motorcycle Technology & Innovation Review`
    } else if (currentTitle.includes('Motorcycle Performance')) {
      return `${getRandomMotorcycleBrand()} Performance Test & Review`
    } else if (currentTitle.includes('Motorcycle Safety')) {
      return `Motorcycle Safety Guide & Essential Tips 2024`
    } else if (currentTitle.includes('Motorcycle Maintenance')) {
      return `Motorcycle Maintenance & DIY Repair Guide`
    }
  }

  // 默认返回原标题
  return currentTitle
}

// 随机品牌生成
function getRandomBrand() {
  const brands = ['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes-Benz', 'Audi', 'Tesla', 'Chevrolet', 'Nissan', 'Hyundai']
  return brands[Math.floor(Math.random() * brands.length)]
}

function getRandomModel() {
  const models = ['Camry', 'Civic', 'F-150', '3 Series', 'C-Class', 'A4', 'Model 3', 'Silverado', 'Altima', 'Sonata']
  return models[Math.floor(Math.random() * models.length)]
}

function getRandomMotorcycleBrand() {
  const brands = ['Honda', 'Yamaha', 'Kawasaki', 'Suzuki', 'Harley-Davidson', 'BMW', 'Ducati', 'KTM', 'Triumph', 'Indian']
  return brands[Math.floor(Math.random() * brands.length)]
}

function getRandomMotorcycleModel() {
  const models = ['CBR1000RR', 'YZF-R1', 'Ninja ZX-10R', 'GSX-R1000', 'Street Glide', 'S1000RR', 'Panigale V4', 'RC 390', 'Street Triple', 'Scout']
  return models[Math.floor(Math.random() * models.length)]
}

// 添加视频到指定类别
function addVideosToCategory(categoryName, videosToAdd) {
  try {
    const videoData = JSON.parse(fs.readFileSync(VIDEO_DATA_PATH, 'utf8'))
    const targetCategory = videoData.categories[categoryName]

    if (!targetCategory) {
      console.error(`❌ 找不到 ${categoryName} 类别`)
      return
    }

    // 找到下一个可用的ID
    let nextId = 1
    for (const catName of Object.keys(videoData.categories)) {
      const cat = videoData.categories[catName]
      if (cat.videos && Array.isArray(cat.videos)) {
        for (const video of cat.videos) {
          if (video.id >= nextId) {
            nextId = video.id + 1
          }
        }
      }
    }

    let addedCount = 0

    console.log('🔄 开始添加视频...')
    console.log('')

    for (const videoInfo of videosToAdd) {
      // 检查是否已存在
      const existingVideo = targetCategory.videos.find(v => v.youtubeId === videoInfo.youtubeId)
      if (existingVideo) {
        console.log(`⚠️ 视频 ${videoInfo.youtubeId} 已存在，跳过`)
        continue
      }

      // 生成随机数据
      const views = Math.floor(Math.random() * 500000) + 100000
      const likes = Math.floor(views * 0.05) + 5000
      const comments = Math.floor(views * 0.002) + 200

      // 生成智能标题
      const smartTitle = generateSmartTitle(videoInfo, categoryName)

      const newVideo = {
        id: nextId,
        title: smartTitle,
        thumbnailUrl: `https://i.ytimg.com/vi/${videoInfo.youtubeId}/hq720.jpg`,
        videoUrl: `https://www.youtube.com/watch?v=${videoInfo.youtubeId}`,
        views: views,
        likes: likes,
        comments: comments,
        duration: videoInfo.duration,
        uploaderName: `${categoryName} Channel`,
        uploadDate: '2024-12-15',
        category: categoryName,
        description: `Comprehensive ${categoryName.toLowerCase()} review and guide for ${smartTitle.toLowerCase()}`,
        tags: [
          categoryName,
          `${categoryName} Review`,
          'Guide',
          'Tips',
          'Review'
        ],
        isLiked: false,
        isCollected: false,
        youtubeId: videoInfo.youtubeId
      }

      targetCategory.videos.push(newVideo)
      console.log(`✅ 添加视频 ${nextId}: ${videoInfo.youtubeId} - ${smartTitle}`)

      nextId++
      addedCount++
    }

    // 更新总计数
    videoData.totalCount = videoData.totalCount + addedCount

    // 保存数据
    fs.writeFileSync(VIDEO_DATA_PATH, JSON.stringify(videoData, null, 2), 'utf8')

    console.log('')
    console.log('📊 添加结果:')
    console.log(`✅ 成功添加了 ${addedCount} 个新的 ${categoryName} 视频`)
    console.log(`📈 总视频数量: ${videoData.totalCount}`)
    console.log(`📹 ${categoryName} 类别视频数量: ${targetCategory.videos.length}`)
    console.log('🎉 视频添加完成！')

  } catch (error) {
    console.error('❌ 添加过程中出错:', error.message)
  }
}

// 主函数
function main() {
  const videosToAdd = parseVideosData(videosData)

  if (videosToAdd.length === 0) {
    console.log('❌ 没有解析到有效的视频数据')
    return
  }

  console.log(`📋 解析到 ${videosToAdd.length} 个视频:`)
  for (const video of videosToAdd) {
    console.log(`   ${video.youtubeId} (${video.duration}) - ${video.title}`)
  }
  console.log('')

  addVideosToCategory(category, videosToAdd)
}

// 运行主函数
main()
