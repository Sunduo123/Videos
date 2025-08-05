import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🧹 清理 VideoH5 开发缓存...');

// 清理缓存目录
const cacheDirs = ['.nuxt', '.output', 'node_modules/.cache', 'node_modules/.vite'];

cacheDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`🗑️  删除: ${dir}`);
    try {
      fs.rmSync(dir, { recursive: true, force: true });
      console.log(`✅ 已删除: ${dir}`);
    } catch (error) {
      console.log(`⚠️  删除失败 ${dir}:`, error.message);
    }
  } else {
    console.log(`ℹ️  不存在: ${dir}`);
  }
});

// 终止所有 node 进程
try {
  console.log('🛑 终止现有 Node.js 进程...');
  execSync('taskkill /f /im node.exe', { stdio: 'ignore' });
  console.log('✅ 进程已终止');
} catch (error) {
  console.log('ℹ️  没有运行中的 Node.js 进程');
}

console.log('✨ 清理完成！');
