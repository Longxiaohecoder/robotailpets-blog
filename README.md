# 🤖 robotailpets 自动化博客营销系统

**一个完整的 AI 驱动内容营销自动化系统**，专为 robotailpets 品牌打造。

自动生成 SEO 优化文章 → 自动部署到公网 → 定期发布 → Google 索引 → 提升品牌知名度

---

## ✨ 核心功能

✅ **AI 自动生成高质量文章**
- 使用 Claude Opus 生成 2000+ 字深度文章
- 自动包含 5-8 张图片（带 SEO 优化的 alt 文本）
- 智能选择热门主题和关键词

✅ **完整 SEO 优化**
- 关键词优化（robotailpets、智能宠物、AI 宠物玩具等）
- 内链策略（文章互链）
- 外链布局（链接到官网和亚马逊店铺）
- 站点地图自动生成

✅ **全自动化发布**
- GitHub Actions 定时生成（每天北京时间 9:00）
- 自动提交到 GitHub
- Vercel 自动检测并部署到公网
- 零人工干预

✅ **公网访问 + Google 索引**
- 部署到 Vercel（免费 SSL + CDN）
- 提交站点地图到 Google Search Console
- 自然搜索流量持续增长

---

## 🚀 5 分钟快速部署

### 步骤 1：推送到 GitHub

```bash
# 已经初始化完成，只需推送到你的 GitHub 仓库

# 1. 在 GitHub 创建新仓库：https://github.com/new
#    仓库名：robotailpets-blog
#    设置为 Public

# 2. 添加远程仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/robotailpets-blog.git

# 3. 推送代码
git push -u origin main
```

### 步骤 2：部署到 Vercel

1. 访问 [https://vercel.com](https://vercel.com) 并用 GitHub 登录
2. 点击 "Add New..." → "Project"
3. 导入 `robotailpets-blog` 仓库
4. 配置构建设置：
   - **Framework**: Astro
   - **Build Command**: `cd blog && npm install && npm run build`
   - **Output Directory**: `blog/dist`
5. 添加环境变量：
   - `ANTHROPIC_API_KEY`: `sk-uiixTH8ZRaGf2EYvlaxH5WWTkpxsio3B7FON3k8bnSdlFFDx`
   - `ANTHROPIC_BASE_URL`: `https://heyroute.ai`
6. 点击 "Deploy" 等待 2-3 分钟

✅ **完成！** 你会获得公网地址：`https://robotailpets-blog-xxx.vercel.app`

### 步骤 3：配置自动发布

1. 在 GitHub 仓库添加 Secrets：
   - 访问：`Settings` → `Secrets and variables` → `Actions`
   - 添加 `ANTHROPIC_API_KEY`
   
2. 添加 Variables：
   - `ANTHROPIC_BASE_URL`: `https://heyroute.ai`
   - `POSTS_PER_RUN`: `1`

3. 启用 GitHub Actions：
   - 访问 `Actions` 标签页
   - 点击启用 workflows

✅ **完成！** 系统每天自动生成并发布新文章

---

## 📊 系统架构

```
┌─────────────────────────────────────────────────┐
│  GitHub Actions (定时触发)                        │
│  • 每天北京时间 9:00 自动运行                      │
│  • 调用 Claude API 生成新文章                     │
│  • 自动提交到 GitHub                              │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  GitHub Repository                               │
│  • 存储所有文章（Markdown 格式）                  │
│  • 触发 Vercel 自动部署                          │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  Vercel (公网托管)                               │
│  • 自动构建 Astro 静态站点                       │
│  • SSL 证书 + 全球 CDN                          │
│  • 公网访问：robotailpets-blog.vercel.app       │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  Google Search Console                           │
│  • 提交站点地图                                  │
│  • Google 爬虫索引                               │
│  • 用户搜索"robotailpets"可以看到文章            │
└─────────────────────────────────────────────────┘
```

---

## 📁 项目结构

```
auto-blog-system/
├── blog/                          # Astro 博客
│   ├── src/
│   │   ├── content/posts/         # 文章存储目录
│   │   ├── layouts/               # 页面布局
│   │   └── pages/                 # 路由页面
│   ├── public/                    # 静态资源
│   └── astro.config.mjs           # Astro 配置
├── scripts/
│   ├── generate-enhanced-content.js  # 增强版内容生成（带图片）
│   ├── generate-brand-content.js     # 品牌推荐文章生成
│   └── test-api.js                   # API 测试脚本
├── .github/workflows/
│   └── auto-publish.yml           # GitHub Actions 自动化配置
├── VERCEL_DEPLOY.md               # 详细部署指南
└── DEPLOY_GUIDE.md                # 完整部署和优化指南
```

---

## 🎯 已生成文章示例

✅ **2026-09-22-robotailpets.md**
- 标题：如何用科技提升宠物生活质量？robotailpets智能宠物产品完整指南
- 字数：2000+
- 图片：7 张（带描述性 alt 文本）
- 关键词：智能宠物、robotailpets、AI宠物玩具、自动喂食器
- 内链：4 个产品页面链接
- 外链：3 个（官网、Shopify、亚马逊）

查看文章：[blog/src/content/posts/2026-09-22-robotailpets.md](blog/src/content/posts/2026-09-22-robotailpets.md)

---

## 💰 成本预算

| 项目 | 费用 | 说明 |
|------|------|------|
| Vercel 托管 | $0 | 免费版（100GB 带宽/月） |
| Claude API | $2-3/月 | 每月 30 篇文章 |
| GitHub Actions | $0 | 免费版足够使用 |
| **总计** | **$2-3/月** | 极低成本 |

---

## 📈 预期效果

**30 天后**：
- ✅ 30 篇高质量文章发布
- ✅ Google 收录 20-25 篇
- ✅ 自然搜索流量 50-100/月

**60 天后**：
- ✅ 60 篇文章
- ✅ 品牌搜索量 +30%
- ✅ 自然流量 200-300/月

**90 天后**：
- ✅ 90 篇文章
- ✅ 品牌搜索量 +50%
- ✅ 自然流量 500-800/月
- ✅ 成为宠物科技领域权威内容源

---

## 🔧 本地开发

```bash
# 安装依赖
npm install
cd blog && npm install

# 生成新文章
npm run generate:enhanced

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

---

## 📖 详细文档

- **[VERCEL_DEPLOY.md](VERCEL_DEPLOY.md)** - Vercel 部署快速指南
- **[DEPLOY_GUIDE.md](DEPLOY_GUIDE.md)** - 完整部署和优化指南
- **[AUTOMATION_GUIDE.md](AUTOMATION_GUIDE.md)** - 自动化系统详细说明

---

## 🎨 自定义配置

### 修改文章主题

编辑 `scripts/generate-enhanced-content.js`：

```javascript
const topics = [
  '你的自定义主题 1',
  '你的自定义主题 2',
  // 添加更多...
];
```

### 修改发布频率

编辑 `.github/workflows/auto-publish.yml`：

```yaml
schedule:
  # 每天一次：UTC 01:00 (北京时间 09:00)
  - cron: '0 1 * * *'
  
  # 改为每周一次：
  # - cron: '0 1 * * 1'
  
  # 改为每天两次：
  # - cron: '0 1,13 * * *'
```

---

## 🚀 立即开始

1. **现在就推送到 GitHub**（见上方步骤 1）
2. **部署到 Vercel**（见上方步骤 2）
3. **配置自动发布**（见上方步骤 3）
4. **提交到 Google Search Console**（见 DEPLOY_GUIDE.md）

**让 Google 搜索结果里到处都是 robotailpets！** 🎉

---

## 📄 许可证

MIT License
# 测试 Vercel 自动部署
