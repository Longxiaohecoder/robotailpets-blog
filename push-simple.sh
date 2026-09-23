#!/bin/bash

# 🚀 robotailpets 博客 - GitHub 推送脚本（简化版）

echo "=================================="
echo "🚀 robotailpets 博客 - GitHub 推送"
echo "=================================="
echo ""

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    exit 1
fi

echo "✅ 当前目录正确"
echo ""

# 显示远程仓库
echo "📍 远程仓库地址:"
git remote -v
echo ""

echo "=================================="
echo "📝 请按照以下步骤操作："
echo "=================================="
echo ""
echo "1️⃣  在终端中运行以下命令："
echo ""
echo "   git push -u origin main"
echo ""
echo "2️⃣  输入你的 GitHub 凭证："
echo ""
echo "   Username: Longxiaohecoder"
echo "   Password: [你的 Personal Access Token]"
echo ""
echo "=================================="
echo "🔑 如何获取 Personal Access Token："
echo "=================================="
echo ""
echo "1. 访问: https://github.com/settings/tokens"
echo "2. 点击 'Generate new token' → 'Generate new token (classic)'"
echo "3. Note: robotailpets-blog-push"
echo "4. Expiration: 90 days"
echo "5. 勾选: repo (完整权限)"
echo "6. 点击 'Generate token'"
echo "7. 复制生成的 token (以 ghp_ 开头)"
echo "8. 在 Password 提示时粘贴 token"
echo ""
echo "=================================="
echo "💡 提示："
echo "=================================="
echo ""
echo "- Token 只会显示一次，请立即复制保存"
echo "- 粘贴时不会显示任何字符（这是正常的）"
echo "- 粘贴完按 Enter 即可"
echo ""
echo "🚀 准备好后，在终端运行: git push -u origin main"
echo ""
