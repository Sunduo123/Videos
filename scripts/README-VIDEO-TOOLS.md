# 🎬 视频工具使用说明

## 通用视频添加工具

### 使用方法

```bash
node scripts/universal-video-adder.js [类别] [视频数据]
```

### 参数说明

- `[类别]`: 视频类别名称 (如: Motorcycles, Automotive, AI, Finance 等)
- `[视频数据]`: 视频数据字符串，格式为 `youtubeId:duration:title,youtubeId:duration:title,...`

### 视频数据格式

```
youtubeId:分钟:秒钟:标题
```

### 使用示例

#### 添加摩托车视频
```bash
node scripts/universal-video-adder.js Motorcycles "abc123:10:30:Test Motorcycle Video,def456:5:15:Another Motorcycle Video"
```

#### 添加汽车视频
```bash
node scripts/universal-video-adder.js Automotive "xyz789:12:45:Car Review Video,uvw321:8:20:SUV Test Drive"
```

#### 添加AI视频
```bash
node scripts/universal-video-adder.js AI "ai123:15:30:AI Technology Review,ai456:7:15:Machine Learning Guide"
```

### 功能特点

✅ **智能标题生成**: 自动生成符合YouTube格式的标题
✅ **重复检查**: 自动跳过已存在的视频
✅ **随机数据**: 自动生成浏览量、点赞数、评论数
✅ **自动ID分配**: 自动分配下一个可用的视频ID
✅ **多类别支持**: 支持所有预定义的视频类别

### 支持的类别

- Automotive (汽车)
- Motorcycles (摩托车)
- AI (人工智能)
- Finance (金融)
- Cybersecurity (网络安全)
- Commerce and Industry (商业和工业)
- Home Design (家居设计)
- Luxury Travel (豪华旅行)
- Dentistry (牙科)
- Elderly Care (老年护理)

### 智能标题优化

工具会根据类别自动优化标题：

**汽车类示例:**
- "New Car Review" → "2024 Toyota Camry First Drive Review"
- "SUV Review" → "2024 Honda SUV Review & Comparison"

**摩托车类示例:**
- "New Motorcycle Review" → "2024 Kawasaki Ninja ZX-10R Review"
- "Motorcycle Performance" → "Harley-Davidson Performance Test & Review"

### 注意事项

1. 视频数据必须用引号包围
2. 多个视频用逗号分隔
3. 时长格式为 "分钟:秒钟"
4. 标题可以包含冒号，会被正确解析
5. 工具会自动检查重复视频并跳过

### 错误处理

- 如果类别不存在，会显示错误信息
- 如果视频数据格式错误，会提示正确的格式
- 如果视频已存在，会自动跳过并显示提示

### 输出示例

```
🎬 通用视频添加工具
========================================
📹 目标类别: Motorcycles

📋 解析到 2 个视频:
   abc123 (10:30) - Test Motorcycle Video
   def456 (5:15) - Another Motorcycle Video

🔄 开始添加视频...

✅ 添加视频 142: abc123 - 2024 Honda CBR1000RR Review
✅ 添加视频 143: def456 - Motorcycle Maintenance & DIY Repair Guide

📊 添加结果:
✅ 成功添加了 2 个新的 Motorcycles 视频
📈 总视频数量: 143
📹 Motorcycles 类别视频数量: 43
🎉 视频添加完成！
```
