import fs from 'fs';

try {
  const data = JSON.parse(fs.readFileSync('public/data/youtube-videos/example-batch.json', 'utf8'));

  console.log('📊 视频统计报告');
  console.log('================');

  let total = 0;
  Object.keys(data.categories).forEach(category => {
    const count = data.categories[category].videos.length;
    total += count;
    console.log(`${category}: ${count} 个视频`);
  });

  console.log('================');
  console.log(`总计: ${total} 个视频`);

} catch (error) {
  console.error('读取文件时出错:', error.message);
}
