# VideoH5 故障排除指南

## 🚨 常见问题及解决方案

### 1. `validate` 重复声明错误

**错误信息：**
```
Uncaught SyntaxError: Identifier 'validate' has already been declared
```

**原因：**
- Nuxt缓存文件冲突
- 开发服务器重启时缓存未清理
- 多个Node.js进程同时运行

**解决方案：**

#### 方法一：使用智能启动（推荐）
```bash
npm run dev:smart
```
这个命令会自动检查并修复潜在问题。

#### 方法二：手动清理
```bash
# 停止所有Node.js进程
taskkill /f /im node.exe

# 清理缓存
npm run clean:all

# 重新启动
npm run dev
```

#### 方法三：强制清理
```bash
npm run clean:force
```

### 2. 开发服务器无法启动

**解决方案：**
```bash
# 检查端口占用
netstat -an | findstr :3000

# 如果端口被占用，杀死进程
taskkill /f /im node.exe

# 重新启动
npm run dev
```

### 3. 局域网访问问题

**确保服务器监听所有网络接口：**
```bash
# 检查服务器状态
netstat -an | findstr :3000

# 应该显示：TCP    0.0.0.0:3000           0.0.0.0:0              LISTENING
```

**获取局域网IP：**
```bash
ipconfig | findstr "IPv4"
```

### 4. 依赖安装问题

**解决方案：**
```bash
# 清理npm缓存
npm cache clean --force

# 删除node_modules
Remove-Item -Recurse -Force node_modules

# 重新安装
npm install
```

## 🛠️ 可用的命令

### 开发命令
- `npm run dev` - 普通启动
- `npm run dev:smart` - 智能启动（推荐）
- `npm run dev:clean` - 清理后启动

### 清理命令
- `npm run clean` - 基础清理
- `npm run clean:all` - 完整清理
- `npm run clean:force` - 强制清理并重启

### 构建命令
- `npm run build` - 构建生产版本
- `npm run generate` - 生成静态文件
- `npm run preview` - 预览构建结果

## 🔧 预防措施

### 1. 定期清理
建议每周运行一次：
```bash
npm run clean:all
```

### 2. 使用智能启动
日常开发使用：
```bash
npm run dev:smart
```

### 3. 避免同时运行多个实例
确保只有一个开发服务器在运行。

### 4. 保持依赖更新
```bash
npm update
```

## 📞 获取帮助

如果遇到其他问题：

1. 检查控制台错误信息
2. 查看浏览器开发者工具
3. 运行 `npm run clean:force`
4. 重启开发服务器

## 🎯 最佳实践

1. **使用智能启动**：`npm run dev:smart`
2. **定期清理缓存**：每周运行 `npm run clean:all`
3. **避免强制关闭**：使用 Ctrl+C 正常停止服务器
4. **保持环境清洁**：避免同时运行多个项目实例 