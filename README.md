# 🤖 自动化博客系统

一个完全自主可控的 AI 驱动内容营销自动化系统。

## ✨ 特性

- ✅ **AI 自动生成**：使用 Claude AI 自动生成高质量博客文章
- ✅ **SEO 优化**：自动生成元标签、关键词优化
- ✅ **完全可控**：所有数据和代码都在你本地，无需第三方账号
- ✅ **现代化界面**：基于 Astro 的快速响应式博客
- ✅ **易于部署**：支持 Vercel、Netlify 等平台一键部署
- ✅ **定时发布**：支持 GitHub Actions 定时自动生成内容

## 📁 项目结构

```
auto-blog-system/
├── scripts/
│   ├── generate-content.js  # 内容生成脚本
│   └── setup.js            # 配置向导
├── blog/
│   ├── src/
│   │   ├── content/posts/  # 文章存储目录
│   │   ├── pages/          # 页面
│   │   └── layouts/        # 布局模板
│   └── public/             # 静态资源
├── package.json
└── .env                    # 配置文件（需要创建）
```

## 🚀 快速开始

### 1. 安装依赖

```bash
cd auto-blog-system
npm install
cd blog
npm install
cd ..
```

### 2. 配置系统

运行配置向导：

```bash
npm run setup
```

配置向导会询问你：
- **Claude API Key**：从 [console.anthropic.com](https://console.anthropic.com) 获取
- **博客标题**：你的博客名称
- **博客描述**：博客简介
- **作者名称**：文章作者
- **内容主题**：你想生成的内容类型（如：技术、营销、SEO）
- **内容语言**：zh（中文）或 en（英文）
- **每次生成数量**：每次运行生成几篇文章

### 3. 生成第一篇文章

```bash
npm run generate
```

这个命令会：
1. 连接 Claude API
2. 根据你设置的主题生成文章
3. 自动保存到 `blog/src/content/posts/` 目录

### 4. 预览博客

```bash
npm run dev
```

打开浏览器访问：`http://localhost:4321`

## 📝 使用说明

### 生成内容

```bash
npm run generate
```

每次运行会根据 `.env` 中的 `POSTS_PER_RUN` 设置生成相应数量的文章。

### 自定义主题

编辑 `.env` 文件中的 `CONTENT_TOPIC`：

```env
CONTENT_TOPIC=人工智能、机器学习、深度学习
```

### 修改语言

```env
CONTENT_LANGUAGE=en  # 英文
CONTENT_LANGUAGE=zh  # 中文
```

### 构建生产版本

```bash
npm run build
```

构建完成后，静态文件会生成在 `blog/dist/` 目录。

### 本地预览生产版本

```bash
npm run preview
```

## 🌐 部署到线上

### 部署到 Vercel（推荐）

1. 将代码推送到 GitHub
2. 访问 [vercel.com](https://vercel.com)
3. 导入你的 GitHub 仓库
4. 设置构建配置：
   - **Framework Preset**: Astro
   - **Root Directory**: `blog`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. 点击 Deploy

**完全免费！**

### 部署到 Netlify

1. 将代码推送到 GitHub
2. 访问 [netlify.com](https://netlify.com)
3. 导入你的 GitHub 仓库
4. 设置构建配置：
   - **Base directory**: `blog`
   - **Build command**: `npm run build`
   - **Publish directory**: `blog/dist`
5. 点击 Deploy

### 部署到 GitHub Pages

1. 编辑 `blog/astro.config.mjs`，设置你的仓库名：

```js
export default defineConfig({
  site: 'https://yourusername.github.io',
  base: '/your-repo-name',
  // ...
});
```

2. 推送代码到 GitHub
3. 在仓库设置中启用 GitHub Pages
4. 选择 `gh-pages` 分支

## ⏰ 自动化定时发布

### 使用 GitHub Actions

创建 `.github/workflows/auto-publish.yml`：

```yaml
name: Auto Publish Posts

on:
  schedule:
    # 每天 UTC 时间 00:00 运行（北京时间 08:00）
    - cron: '0 0 * * *'
  workflow_dispatch: # 允许手动触发

jobs:
  generate-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          npm install
          cd blog && npm install
      
      - name: Generate content
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: npm run generate
      
      - name: Commit new posts
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add blog/src/content/posts/
          git commit -m "Auto: Add new blog posts" || exit 0
          git push
```

然后在 GitHub 仓库设置中添加 Secret：
- `ANTHROPIC_API_KEY`：你的 Claude API 密钥

## 🎨 自定义样式

### 修改博客标题和描述

编辑 `blog/src/layouts/BaseLayout.astro`

### 修改主题颜色

编辑 `BaseLayout.astro` 中的 CSS 变量

### 添加自定义页面

在 `blog/src/pages/` 目录创建新的 `.astro` 文件

## 📊 内容策略建议

### 最佳实践

1. **明确主题**：在 `.env` 中设置清晰的内容主题
2. **定期发布**：设置合理的发布频率（建议每天 1-2 篇）
3. **质量检查**：生成后可以手动编辑 Markdown 文件优化
4. **SEO 优化**：确保每篇文章都有合适的标签和描述
5. **内容多样性**：定期调整主题方向

### 推荐发布频率

- **初期**：每天 1 篇，建立内容基础
- **成长期**：每天 2-3 篇，快速积累
- **稳定期**：每周 5-7 篇，保持更新

## 🔧 故障排除

### Claude API 错误

确保：
1. API Key 正确设置在 `.env` 文件中
2. API Key 有足够的配额
3. 网络连接正常

### 文章生成失败

检查：
1. `CONTENT_TOPIC` 是否设置
2. API 配额是否充足
3. 查看错误日志

### 博客无法启动

确保：
1. 已安装博客依赖：`cd blog && npm install`
2. Node.js 版本 >= 18
3. 端口 4321 未被占用

## 💰 成本估算

### Claude API 使用成本

- 每篇文章约 2000-3000 tokens
- Claude Sonnet 价格：约 $0.003/1K tokens（输入）+ $0.015/1K tokens（输出）
- **每篇文章成本约 $0.05-0.10**
- 每月生成 30 篇文章约 **$1.5-3**

### 部署成本

- Vercel/Netlify 免费版：**$0/月**
- 域名（可选）：**约 $10/年**

**总计：基本免费运行！**

## 🤝 支持

遇到问题？
1. 检查本文档的故障排除部分
2. 查看 `.env.example` 确保配置正确
3. 检查 Claude API 控制台

## 📝 更新日志

### v1.0.0 (2024-09-18)
- ✨ 初始版本发布
- ✅ AI 内容自动生成
- ✅ Astro 博客系统
- ✅ 完整配置向导
- ✅ 部署文档

## 📄 许可证

MIT License

---

**开始你的内容营销自动化之旅吧！** 🚀
