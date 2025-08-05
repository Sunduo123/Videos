import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 启动 VideoH5 开发服务器...');

// 清理缓存目录
const cacheDirs = ['.nuxt', '.output', 'node_modules/.cache', 'node_modules/.vite'];

cacheDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`🧹 清理缓存: ${dir}`);
    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch (error) {
      console.log(`⚠️  清理 ${dir} 失败:`, error.message);
    }
  }
});

// 终止所有 node 进程
try {
  console.log('🛑 终止现有 Node.js 进程...');
  execSync('taskkill /f /im node.exe', { stdio: 'ignore' });
} catch (error) {
  // 忽略错误，可能没有进程在运行
}

// 等待一秒确保进程完全终止
setTimeout(() => {
  try {
    console.log('📦 安装依赖...');
    execSync('npm install', { stdio: 'inherit' });

    console.log('🔥 启动开发服务器...');
    execSync('npm run dev', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ 启动失败:', error.message);
    process.exit(1);
  }
}, 1000);
