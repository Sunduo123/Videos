# Nuxt开发缓存清理脚本 (PowerShell版本)
Write-Host "🧹 开始清理Nuxt开发缓存..." -ForegroundColor Green

# 要清理的目录
$cleanPaths = @(
    ".nuxt",
    ".output", 
    "node_modules\.cache",
    "node_modules\.vite"
)

# 清理函数
foreach ($path in $cleanPaths) {
    if (Test-Path $path) {
        try {
            Remove-Item -Path $path -Recurse -Force
            Write-Host "✅ 已清理: $path" -ForegroundColor Green
        }
        catch {
            Write-Host "⚠️  清理失败: $path - $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "ℹ️  目录不存在: $path" -ForegroundColor Cyan
    }
}

# 清理npm缓存
Write-Host "🧹 清理npm缓存..." -ForegroundColor Green
try {
    npm cache clean --force
    Write-Host "✅ 已清理npm缓存" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  npm缓存清理失败" -ForegroundColor Yellow
}

# 重新安装依赖
Write-Host "📦 重新安装依赖..." -ForegroundColor Green
try {
    npm install
    Write-Host "✅ 依赖重新安装完成" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  依赖重新安装失败" -ForegroundColor Yellow
}

Write-Host "`n🎉 清理完成！现在可以运行 npm run dev 了" -ForegroundColor Green 