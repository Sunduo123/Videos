@echo off
echo 🧹 开始清理Nuxt开发缓存...

REM 清理目录
if exist ".nuxt" (
    rmdir /s /q ".nuxt"
    echo ✅ 已清理: .nuxt
) else (
    echo ℹ️  目录不存在: .nuxt
)

if exist ".output" (
    rmdir /s /q ".output"
    echo ✅ 已清理: .output
) else (
    echo ℹ️  目录不存在: .output
)

if exist "node_modules\.cache" (
    rmdir /s /q "node_modules\.cache"
    echo ✅ 已清理: node_modules\.cache
) else (
    echo ℹ️  目录不存在: node_modules\.cache
)

if exist "node_modules\.vite" (
    rmdir /s /q "node_modules\.vite"
    echo ✅ 已清理: node_modules\.vite
) else (
    echo ℹ️  目录不存在: node_modules\.vite
)

REM 清理npm缓存
echo 🧹 清理npm缓存...
npm cache clean --force
echo ✅ 已清理npm缓存

REM 重新安装依赖
echo 📦 重新安装依赖...
npm install
echo ✅ 依赖重新安装完成

echo.
echo 🎉 清理完成！现在可以运行 npm run dev 了
pause 