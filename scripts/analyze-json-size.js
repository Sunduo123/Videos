import fs from 'fs';

try {
  const data = JSON.parse(fs.readFileSync('public/data/youtube-videos/example-batch.json', 'utf8'));

  console.log('📊 JSON文件性能分析');
  console.log('====================');

  // 文件大小分析
  const fileSize = fs.statSync('public/data/youtube-videos/example-batch.json').size;
  const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);

  console.log(`📁 文件大小: ${fileSize} 字节 (${fileSizeMB} MB)`);

  // 内存使用分析
  const jsonString = JSON.stringify(data);
  const memorySize = new Blob([jsonString]).size;
  const memorySizeMB = (memorySize / (1024 * 1024)).toFixed(2);

  console.log(`🧠 内存占用: ${memorySize} 字节 (${memorySizeMB} MB)`);

  // 视频数量统计
  let totalVideos = 0;
  Object.keys(data.categories).forEach(category => {
    totalVideos += data.categories[category].videos.length;
  });

  console.log(`📹 总视频数: ${totalVideos} 个`);
  console.log(`📊 平均每个视频占用: ${(memorySize / totalVideos).toFixed(0)} 字节`);

  // 性能影响评估
  console.log('\n🚀 性能影响评估:');
  if (fileSize < 500 * 1024) { // 小于500KB
    console.log('✅ 文件较小，对页面加载影响很小');
  } else if (fileSize < 1024 * 1024) { // 小于1MB
    console.log('⚠️ 文件中等大小，可能影响初始加载速度');
  } else {
    console.log('❌ 文件较大，会显著影响页面加载速度');
  }

  // 优化建议
  console.log('\n💡 优化建议:');
  console.log('1. 考虑分页加载 - 每次只加载部分视频');
  console.log('2. 使用懒加载 - 滚动时动态加载更多内容');
  console.log('3. 压缩JSON - 移除不必要的空格和换行');
  console.log('4. 使用CDN - 加速文件传输');
  console.log('5. 缓存策略 - 利用浏览器缓存减少重复下载');

} catch (error) {
  console.error('分析文件时出错:', error.message);
}
