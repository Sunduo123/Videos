const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

console.log('🚀 智能启动开发服务器...');

// 检查是否存在潜在问题
function checkForIssues() {
  const issues = [];
  
  // 检查.nuxt文件夹是否存在且过大
  if (fs.existsSync('.nuxt')) {
    try {
      const stats = fs.statSync('.nuxt');
      const sizeInMB = stats.size / (1024 * 1024);
      if (sizeInMB > 100) {
        issues.push(`📁 .nuxt文件夹过大 (${sizeInMB.toFixed(2)}MB)`);
      }
    } catch (error) {
      issues.push('📁 无法读取.nuxt文件夹状态');
    }
  }
  
  // 检查是否有锁文件冲突
  const lockFiles = ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'];
  const existingLocks = lockFiles.filter(file => fs.existsSync(file));
  if (existingLocks.length > 1) {
    issues.push(`🔒 发现多个锁文件: ${existingLocks.join(', ')}`);
  }
  
  // 检查node_modules是否完整
  if (!fs.existsSync('node_modules/nuxt')) {
    issues.push('📦 node_modules不完整，缺少nuxt');
  }
  
  return issues;
}

// 执行清理
function performCleanup() {
  console.log('🧹 执行预防性清理...');
  
  const cleanPaths = [
    '.nuxt',
    '.output',
    'node_modules/.cache',
    'node_modules/.vite'
  ];
  
  cleanPaths.forEach(cleanPath => {
    if (fs.existsSync(cleanPath)) {
      try {
        fs.rmSync(cleanPath, { recursive: true, force: true });
        console.log(`✅ 已清理: ${cleanPath}`);
      } catch (error) {
        console.log(`⚠️  清理失败: ${cleanPath} - ${error.message}`);
      }
    }
  });
}

// 主函数
async function main() {
  try {
    // 检查问题
    const issues = checkForIssues();
    
    if (issues.length > 0) {
      console.log('⚠️  发现以下潜在问题:');
      issues.forEach(issue => console.log(`   ${issue}`));
      
      console.log('\n🔄 执行自动修复...');
      performCleanup();
      
      console.log('📦 重新安装依赖...');
      execSync('npm install', { stdio: 'inherit' });
    } else {
      console.log('✅ 环境检查通过，无需清理');
    }
    
    console.log('🚀 启动开发服务器...');
    
    // 启动开发服务器
    const devProcess = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      shell: true
    });
    
    // 处理进程退出
    devProcess.on('close', (code) => {
      console.log(`\n🛑 开发服务器已停止 (退出码: ${code})`);
      process.exit(code);
    });
    
    // 处理错误
    devProcess.on('error', (error) => {
      console.error('❌ 启动失败:', error.message);
      process.exit(1);
    });
    
  } catch (error) {
    console.error('❌ 启动过程中发生错误:', error.message);
    process.exit(1);
  }
}

// 运行主函数
main(); 