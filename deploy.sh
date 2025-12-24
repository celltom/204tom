#!/bin/bash

# 部署脚本 - 将网站推送到 GitHub

echo "🚀 MiniCloud 部署脚本"
echo "===================="
echo ""

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    exit 1
fi

# 检查 Git 是否已初始化
if [ ! -d ".git" ]; then
    echo "📦 初始化 Git 仓库..."
    git init
fi

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 发现未提交的更改，正在提交..."
    git add .
    git commit -m "更新: $(date '+%Y-%m-%d %H:%M:%S')"
fi

echo ""
echo "✅ 本地代码已准备好"
echo ""
echo "📋 下一步操作："
echo ""
echo "1. 在 GitHub 创建新仓库："
echo "   - 访问 https://github.com"
echo "   - 点击右上角 '+' → New repository"
echo "   - 输入仓库名称（例如: myclouddisk）"
echo "   - 选择 Public 或 Private"
echo "   - ⚠️  不要勾选 'Initialize with README'"
echo "   - 点击 Create repository"
echo ""
echo "2. 复制仓库地址后，运行以下命令："
echo ""
echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. 在 Vercel 部署："
echo "   - 访问 https://vercel.com"
echo "   - 使用 GitHub 登录"
echo "   - 导入你的仓库"
echo "   - 点击 Deploy"
echo ""
echo "📖 详细说明请查看 GITHUB_DEPLOY.md"
echo ""

