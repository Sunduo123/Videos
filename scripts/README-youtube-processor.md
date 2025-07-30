# YouTube视频信息处理脚本

这个项目包含了两个用于处理YouTube视频信息的脚本：

## 1. `process-youtube-video.js` - 单个视频处理脚本

### 功能
- 从HTML代码中提取YouTube视频信息
- 生成符合项目格式的视频数据
- 可选择合并到现有视频数据
- 可选择下载缩略图

### 使用方法

#### 基本使用
```bash
node scripts/process-youtube-video.js
```

#### 合并到现有数据
```bash
node scripts/process-youtube-video.js --merge
```

#### 下载缩略图
```bash
node scripts/process-youtube-video.js --thumbnail
```

#### 同时使用多个选项
```bash
node scripts/process-youtube-video.js --merge --thumbnail
```

### 输出
- 处理后的视频数据保存到 `public/data/youtube-videos/processed-video.json`
- 如果使用 `--merge` 选项，会备份原文件并更新 `public/data/videos.json`
- 如果使用 `--thumbnail` 选项，缩略图会下载到 `public/thumbnails/youtube/`

## 2. `youtube-video-processor.js` - 批量处理脚本

### 功能
- 批量处理多个YouTube视频
- 支持多种输入格式（HTML代码、视频ID、完整URL）
- 自动生成随机数据（观看量、点赞数等）
- 批量下载缩略图

### 使用方法

#### 基本使用
```bash
node scripts/youtube-video-processor.js
```

#### 合并到现有数据
```bash
node scripts/youtube-video-processor.js --merge
```

#### 下载缩略图
```bash
node scripts/youtube-video-processor.js --thumbnails
```

#### 同时使用多个选项
```bash
node scripts/youtube-video-processor.js --merge --thumbnails
```

### 支持的输入格式

1. **HTML代码对象**
```javascript
{
  html: `<a href="/watch?v=lJx6M7SqkvI">...</a>`
}
```

2. **视频ID字符串**
```javascript
"lJx6M7SqkvI"
```

3. **完整YouTube URL**
```javascript
"https://www.youtube.com/watch?v=lJx6M7SqkvI"
```

4. **短链接**
```javascript
"https://youtu.be/lJx6M7SqkvI"
```

## 示例

### 处理您提供的视频信息

您提供的HTML代码包含以下信息：
- **视频ID**: `lJx6M7SqkvI`
- **视频时长**: `8:41`
- **缩略图**: `https://i.ytimg.com/vi/lJx6M7SqkvI/hq720.jpg`

运行脚本后，会生成如下数据：

```json
{
  "id": 1,
  "title": "朝鲜战争历史回顾 - 1950年11月12日",
  "thumbnailUrl": "https://i.ytimg.com/vi/lJx6M7SqkvI/hq720.jpg",
  "videoUrl": "https://www.youtube.com/watch?v=lJx6M7SqkvI",
  "views": 1542876,
  "likes": 89234,
  "comments": 12456,
  "duration": "8:41",
  "uploaderName": "历史频道",
  "uploadDate": "2024-01-15",
  "category": "Education",
  "categoryId": 5,
  "description": "这是一段关于朝鲜战争的历史回顾视频，记录了1950年11月12日的重要历史时刻。",
  "tags": ["历史", "朝鲜战争", "1950年", "教育", "纪录片"],
  "isLiked": false,
  "isCollected": false,
  "youtubeId": "lJx6M7SqkvI"
}
```

## 文件结构

```
scripts/
├── process-youtube-video.js          # 单个视频处理脚本
├── youtube-video-processor.js        # 批量处理脚本
└── README-youtube-processor.md       # 说明文档

public/
├── data/
│   ├── videos.json                   # 现有视频数据
│   └── youtube-videos/               # 处理后的YouTube视频数据
│       └── processed-video.json
└── thumbnails/
    └── youtube/                      # 下载的缩略图
        └── lJx6M7SqkvI.jpg
```

## 注意事项

1. **备份**: 使用 `--merge` 选项时，会自动备份原文件
2. **网络**: 下载缩略图需要网络连接
3. **权限**: 确保脚本有写入文件的权限
4. **格式**: 生成的视频数据符合项目现有的数据格式

## 自定义

您可以通过修改脚本中的以下部分来自定义：

- **视频标题**: 修改 `title` 字段
- **分类**: 修改 `category` 和 `categoryId` 字段
- **上传者**: 修改 `uploaderName` 字段
- **描述**: 修改 `description` 字段
- **标签**: 修改 `tags` 数组

## 故障排除

### 常见问题

1. **无法提取视频ID**
   - 检查HTML代码格式是否正确
   - 确保包含 `href="/watch?v=VIDEO_ID"` 部分

2. **下载缩略图失败**
   - 检查网络连接
   - 确认视频ID有效
   - 检查文件写入权限

3. **合并数据失败**
   - 确保 `public/data/videos.json` 文件存在
   - 检查JSON格式是否正确
   - 确保有足够的磁盘空间

### 错误信息

- `无法从HTML代码中提取视频ID`: HTML格式不正确或缺少视频ID
- `下载缩略图失败`: 网络问题或视频不存在
- `合并到现有数据时出错`: 文件权限或格式问题
