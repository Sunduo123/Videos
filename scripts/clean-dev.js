import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

console.log('🧹 开始清理Nuxt开发缓存...')

// 要清理的目录和文件
const cleanPaths = [
  '.nuxt',
  '.output',
  'node_modules/.cache',
  'node_modules/.vite'
]

// 清理函数
function cleanDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    try {
      fs.rmSync(dirPath, { recursive: true, force: true })
      console.log(`✅ 已清理: ${dirPath}`)
    } catch (error) {
      console.log(`⚠️  清理失败: ${dirPath} - ${error.message}`)
    }
  } else {
    console.log(`ℹ️  目录不存在: ${dirPath}`)
  }
}

// 执行清理
cleanPaths.forEach(cleanDirectory)

// 清理npm缓存
try {
  execSync('npm cache clean --force', { stdio: 'inherit' })
  console.log('✅ 已清理npm缓存')
} catch (error) {
  console.log('⚠️  npm缓存清理失败')
}

// 重新安装依赖（可选）
console.log('\n📦 重新安装依赖...')
try {
  execSync('npm install', { stdio: 'inherit' })
  console.log('✅ 依赖重新安装完成')
} catch (error) {
  console.log('⚠️  依赖重新安装失败')
}

console.log('\n🎉 清理完成！现在可以运行 npm run dev 了') 