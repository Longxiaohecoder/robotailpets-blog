#!/bin/bash

# robotailpets 博客 - 推送到 GitHub 脚本
# 运行前请先在 GitHub 创建仓库：https://github.com/new

echo "🚀 robotailpets 博客 - GitHub 推送脚本"
echo "================================================"
echo ""

# 检查是否已配置远程仓库
if git remote get-url origin &> /dev/null; then
    echo "✅ 已配置远程仓库"
    git remote -v
    echo ""
else
    echo "📝 请输入你的 GitHub 用户名："
    read GITHUB_USERNAME

    echo ""
    echo "添加远程仓库: https://github.com/$GITHUB_USERNAME/robotailpets-blog.git"
    git remote add origin https://github.com/$GITHUB_USERNAME/robotailpets-blog.git
    echo "✅ 远程仓库已添加"
    echo ""
fi

# 确认推送
echo "📤 准备推送代码到 GitHub..."
echo ""
echo "确认推送? (y/n)"
read CONFIRM

if [ "$CONFIRM" = "y" ] || [ "$CONFIRM" = "Y" ]; then
    echo ""
    echo "🔄 正在推送..."
    git push -u origin main

    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 推送成功！"
        echo ""
        echo "📋 下一步操作："
        echo "1. 访问你的 GitHub 仓库查看代码"
        echo "2. 按照 GITHUB_AUTO_PUBLISH_SETUP.md 配置 Secrets"
        echo "3. 启用 GitHub Actions"
        echo "4. 连接 Vercel 到 GitHub 仓库"
        echo ""
        echo "完成后，系统将每天自动生成新文章！🎉"
    else
        echo ""
        echo "❌ 推送失败"
        echo ""
        echo "可能的原因："
        echo "1. GitHub 仓库尚未创建 - 访问 https://github.com/new"
        echo "2. 需要输入凭证 - 使用 Personal Access Token"
        echo "3. 网络连接问题"
        echo ""
        echo "详细设置请查看：GITHUB_AUTO_PUBLISH_SETUP.md"
    fi
else
    echo ""
    echo "❌ 已取消推送"
fi
