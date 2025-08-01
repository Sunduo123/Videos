import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const VIDEO_DATA_PATH = path.join(__dirname, '../public/data/youtube-videos/example-batch.json')

console.log('🧠 智能标题优化工具')
console.log('=' * 50)

// YouTube标题优化规则
const titleOptimizations = {
  // 汽车类标题优化
  'Pickup Truck Review': '2024 Pickup Truck Review & Comparison',
  'Car Shorts': 'Quick Car Review & Tips',
  'SUV Review': '2024 SUV Review & Test Drive',
  'New Car Review': '2024 New Car Review & First Drive',
  'Luxury Car Review': '2024 Luxury Car Review & Test',
  'EV Review': '2024 Electric Vehicle Review & Test Drive',
  'Classic Car Review': 'Classic Car Restoration & Review',
  'Muscle Car Review': 'Muscle Car Performance Review',
  'Car Maintenance Guide': 'Complete Car Maintenance Guide 2024',
  'Chinese Car Review': 'Chinese Car Brands Review 2024',

  // 摩托车类标题优化
  'New Motorcycle Review': '2024 New Motorcycle Review & Test Ride',
  'Motorcycle Technology': '2024 Motorcycle Technology & Innovation',
  'Motorcycle Performance Test': 'Motorcycle Performance & Speed Test',
  'Motorcycle Safety Guide': 'Motorcycle Safety Tips & Guide',
  'Motorcycle Maintenance Tips': 'Motorcycle Maintenance & DIY Guide',
  'Motorcycle Shorts': 'Quick Motorcycle Tips & Tricks',
  'Motorcycle Gear Review': 'Motorcycle Gear & Safety Equipment Review',
  'Motorcycle Touring Guide': 'Motorcycle Touring & Long Distance Guide',
  'Motorcycle Racing Techniques': 'Motorcycle Racing & Advanced Techniques',
  'Motorcycle Customization': 'Motorcycle Customization & Modifications'
}

// 智能标题生成函数
function generateSmartTitle(video) {
  const currentTitle = video.title
  const category = video.category
  const youtubeId = video.youtubeId

  // 基于类别和当前标题生成更真实的标题
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

  // 如果没有匹配的规则，返回优化后的标题
  return titleOptimizations[currentTitle] || currentTitle
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

// 智能优化所有视频标题
function optimizeAllTitles() {
  try {
    const videoData = JSON.parse(fs.readFileSync(VIDEO_DATA_PATH, 'utf8'))
    let optimizedCount = 0

    console.log('🔄 开始智能优化标题...')
    console.log('')

    for (const categoryName of Object.keys(videoData.categories)) {
      const category = videoData.categories[categoryName]
      if (category.videos && Array.isArray(category.videos)) {
        for (const video of category.videos) {
          const oldTitle = video.title
          const newTitle = generateSmartTitle(video)

          if (newTitle !== oldTitle) {
            video.title = newTitle
            console.log(`✅ ${video.youtubeId}: "${oldTitle}" → "${newTitle}"`)
            optimizedCount++
          }
        }
      }
    }

    // 保存优化后的数据
    fs.writeFileSync(VIDEO_DATA_PATH, JSON.stringify(videoData, null, 2), 'utf8')

    console.log('')
    console.log('📊 优化结果:')
    console.log(`✅ 优化了 ${optimizedCount} 个视频标题`)
    console.log('🎉 智能标题优化完成！')

  } catch (error) {
    console.error('❌ 优化过程中出错:', error.message)
  }
}

// 显示优化预览
function showOptimizationPreview() {
  try {
    const videoData = JSON.parse(fs.readFileSync(VIDEO_DATA_PATH, 'utf8'))

    console.log('📋 标题优化预览:')
    console.log('=' * 50)

    for (const categoryName of Object.keys(videoData.categories)) {
      const category = videoData.categories[categoryName]
      if (category.videos && Array.isArray(category.videos)) {
        console.log(`\n📹 ${categoryName} 类别:`)
        for (const video of category.videos.slice(0, 3)) { // 只显示前3个
          const oldTitle = video.title
          const newTitle = generateSmartTitle(video)
          console.log(`   ${video.youtubeId}: "${oldTitle}" → "${newTitle}"`)
        }
      }
    }

    console.log('\n💡 这些是基于YouTube常见标题模式的智能优化')
    console.log('🔧 运行优化后，所有标题将更符合YouTube实际标题格式')

  } catch (error) {
    console.error('❌ 预览过程中出错:', error.message)
  }
}

// 运行优化
console.log('选择操作:')
console.log('1. 显示优化预览')
console.log('2. 执行智能优化')
console.log('')

// 默认执行预览
showOptimizationPreview()

export { generateSmartTitle, optimizeAllTitles, showOptimizationPreview }
