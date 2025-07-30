# example-batch.json 文件来源详解

## 📋 文件概述

`example-batch.json` 文件是通过我们之前创建的YouTube视频处理脚本生成的，它包含了4个YouTube视频的结构化数据，用于在视频网站主页上显示。

## 🔄 生成过程

### 1. 数据来源

这个文件中的数据来源于以下几个YouTube视频ID：

```javascript
const batchInputs = [
  "lJx6M7SqkvI",           // 来自您最初提供的HTML代码
  "dQw4w9WgXcQ",           // 示例视频ID
  "9bZkp7q19f0",           // 示例视频ID
  "https://www.youtube.com/watch?v=ZZ5LpwO-An4"  // 完整URL格式
]
```

### 2. 生成脚本

文件是通过运行 `scripts/example-usage.js` 脚本生成的：

```bash
node scripts/example-usage.js
```

### 3. 处理流程

1. **输入解析**: 脚本接收各种格式的YouTube视频输入
2. **ID提取**: 使用正则表达式从不同格式中提取11位YouTube视频ID
3. **数据生成**: 为每个视频ID生成完整的结构化数据
4. **文件保存**: 将处理结果保存为JSON文件

## 🛠️ 技术实现

### 核心处理类: `YouTubeVideoProcessor`

```javascript
class YouTubeVideoProcessor {
  // 从各种格式中提取YouTube视频ID
  extractVideoId(input) {
    const patterns = [
      /\/watch\?v=([a-zA-Z0-9_-]{11})/, // 标准YouTube URL
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/, // 完整URL
      /youtu\.be\/([a-zA-Z0-9_-]{11})/, // 短链接
      /embed\/([a-zA-Z0-9_-]{11})/, // 嵌入链接
      /vi\/([a-zA-Z0-9_-]{11})/, // 缩略图URL中的ID
      /([a-zA-Z0-9_-]{11})/ // 单独的11位ID
    ]
    // ... 匹配逻辑
  }

  // 生成完整的视频数据结构
  generateYouTubeVideoData(videoInfo, index = 1) {
    return {
      id: index,
      title: `YouTube Video ${videoInfo.videoId}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${videoInfo.videoId}/hq720.jpg`,
      videoUrl: `https://www.youtube.com/watch?v=${videoInfo.videoId}`,
      views: Math.floor(Math.random() * 10000000) + 1000, // 随机生成
      likes: Math.floor(views * (Math.random() * 0.1 + 0.05)), // 基于观看数计算
      comments: Math.floor(likes * (Math.random() * 0.2 + 0.1)), // 基于点赞数计算
      duration: videoInfo.duration || '0:00',
      uploaderName: randomUploader, // 从预设列表中随机选择
      uploadDate: this.generateRandomDate(), // 随机生成2020年至今的日期
      category: randomCategory.name, // 从预设分类中随机选择
      categoryId: randomCategory.id,
      description: `这是一个来自YouTube的视频，视频ID: ${videoInfo.videoId}`,
      tags: ["YouTube", "Video", "Online", "Streaming"],
      isLiked: false,
      isCollected: false,
      youtubeId: videoInfo.videoId // 关键字段，用于识别YouTube视频
    }
  }
}
```

## 📊 数据结构说明

### 每个视频对象包含的字段：

| 字段 | 类型 | 说明 | 来源 |
|------|------|------|------|
| `id` | number | 视频唯一标识符 | 自动生成 |
| `title` | string | 视频标题 | 基于YouTube ID生成 |
| `thumbnailUrl` | string | 缩略图URL | YouTube标准格式 |
| `videoUrl` | string | 视频播放URL | YouTube标准格式 |
| `views` | number | 观看次数 | 随机生成 (1K-10M) |
| `likes` | number | 点赞数 | 基于观看数计算 |
| `comments` | number | 评论数 | 基于点赞数计算 |
| `duration` | string | 视频时长 | 从HTML提取或默认"0:00" |
| `uploaderName` | string | 上传者名称 | 从预设列表随机选择 |
| `uploadDate` | string | 上传日期 | 随机生成 (2020年至今) |
| `category` | string | 视频分类 | 从预设分类随机选择 |
| `categoryId` | number | 分类ID | 对应分类的数字ID |
| `description` | string | 视频描述 | 基于YouTube ID生成 |
| `tags` | array | 标签列表 | 固定预设值 |
| `isLiked` | boolean | 是否已点赞 | 默认false |
| `isCollected` | boolean | 是否已收藏 | 默认false |
| `youtubeId` | string | YouTube视频ID | 从输入中提取 |

## 🎲 随机数据生成规则

### 观看次数 (views)
```javascript
const views = Math.floor(Math.random() * 10000000) + 1000
// 范围: 1,000 - 10,000,000
```

### 点赞数 (likes)
```javascript
const likes = Math.floor(views * (Math.random() * 0.1 + 0.05))
// 范围: 观看数的5%-15%
```

### 评论数 (comments)
```javascript
const comments = Math.floor(likes * (Math.random() * 0.2 + 0.1))
// 范围: 点赞数的10%-30%
```

### 上传日期 (uploadDate)
```javascript
generateRandomDate() {
  const start = new Date(2020, 0, 1)
  const end = new Date()
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return randomDate.toISOString().split('T')[0]
}
// 范围: 2020年1月1日至今
```

### 上传者名称 (uploaderName)
从预设列表随机选择：
- "YouTube Creator"
- "Popular Channel"
- "Verified Creator"
- "Official Channel"

### 视频分类 (category)
从预设分类随机选择：
- Gaming (游戏)
- Entertainment (娱乐)
- Technology (科技)
- Music (音乐)
- Education (教育)
- Sports (体育)
- Lifestyle (生活)
- Comedy (喜剧)
- News (新闻)
- Cooking (烹饪)

## 🔗 相关文件

### 生成脚本
- `scripts/example-usage.js` - 示例使用脚本
- `scripts/youtube-video-processor.js` - 核心处理类

### 输出文件
- `public/data/youtube-videos/example-batch.json` - 生成的视频数据

### 使用位置
- `stores/app.ts` - 状态管理，加载视频数据
- `pages/index.vue` - 主页，显示视频网格
- `pages/video/[id].vue` - 视频详情页，播放视频

## 🎯 实际视频信息

文件中包含的4个YouTube视频ID：

1. **lJx6M7SqkvI** - 来自您最初提供的HTML代码
2. **dQw4w9WgXcQ** - 示例视频ID
3. **9bZkp7q19f0** - 示例视频ID
4. **ZZ5LpwO-An4** - 示例视频ID

> ⚠️ **注意**: 这些视频ID是示例数据，实际的观看次数、点赞数、评论数等统计数据是随机生成的，不代表真实数据。

## 🔄 重新生成

如果需要重新生成这个文件，可以运行：

```bash
node scripts/example-usage.js
```

或者使用批量处理脚本：

```bash
node scripts/youtube-video-processor.js
```

---

**生成时间**: 2025-07-30T05:49:45.125Z
**生成脚本**: `scripts/example-usage.js`
**数据来源**: 用户提供的HTML代码 + 示例YouTube视频ID
