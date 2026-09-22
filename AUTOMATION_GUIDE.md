# robotailpets.com 自动化内容营销系统

## 🎯 系统功能

这是一个完整的自动化内容营销系统，专为 **robotailpets.com** 品牌设计。

### 核心特性

1. ✅ **AI 自动生成带图片的博客文章**
2. ✅ **SEO 深度优化**（关键词、内链、外链）
3. ✅ **自动部署到公网**（Vercel/Netlify）
4. ✅ **定期自动发布**（GitHub Actions）
5. ✅ **结合独立站和亚马逊信息**

## 📊 系统架构

```
自动化内容营销系统
├── AI 内容生成引擎 (Claude API)
│   ├── 主题自动选择
│   ├── SEO 关键词优化
│   ├── 图片建议生成
│   └── 内外链规划
├── 博客系统 (Astro)
│   ├── 响应式设计
│   ├── SEO 友好
│   └── 图片优化
├── 自动化部署 (GitHub Actions)
│   ├── 定时生成文章
│   ├── 自动 Git 提交
│   └── 触发 Vercel 部署
└── 监控分析
    ├── Google Analytics
    └── Search Console
```

## 🚀 快速开始

### 1. 生成增强版文章（带图片）

```bash
cd /Users/longxiaohe/Documents/claude-seo/auto-blog-system
node scripts/generate-enhanced-content.js
```

生成的文章包含：
- SEO 优化标题和描述
- 5-8张图片占位符
- 内链和外链
- 关键词优化
- CTA 行动号召

### 2. 预览博客

```bash
npm run dev
```

访问 http://localhost:4321

### 3. 部署到公网

#### 方式 1：Vercel（推荐）

1. 将代码推送到 GitHub
2. 访问 https://vercel.com
3. 导入仓库并部署
4. 获得公网地址（如：robotailpets-blog.vercel.app）

#### 方式 2：Netlify

类似步骤，访问 https://netlify.com

## ⏰ 自动化定时发布

### GitHub Actions 配置

已创建 `.github/workflows/auto-publish.yml`

功能：
- ⏰ **每天自动生成**1篇新文章
- 📝 **自动提交**到 GitHub
- 🚀 **自动部署**到 Vercel/Netlify
- 🔄 **持续更新**，提升 Google 排名

### 设置步骤

1. **推送代码到 GitHub**

```bash
cd /Users/longxiaohe/Documents/claude-seo/auto-blog-system
git init
git add .
git commit -m "Initial commit: robotailpets 自动化博客系统"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/robotailpets-blog.git
git push -u origin main
```

2. **添加 GitHub Secrets**

在仓库 Settings → Secrets and variables → Actions，添加：

- `ANTHROPIC_API_KEY`: `sk-uiixTH8ZRaGf2EYvlaxH5WWTkpxsio3B7FON3k8bnSdlFFDx`
- `ANTHROPIC_BASE_URL`: `https://heyroute.ai`

3. **启用 Actions**

GitHub 会自动开始：
- 每天北京时间 9:00 生成新文章
- 自动提交并部署
- 无需人工干预

## 🎨 自定义配置

### 修改发布频率

编辑 `.github/workflows/auto-publish.yml`：

```yaml
schedule:
  # 每天 UTC 01:00 (北京时间 09:00)
  - cron: '0 1 * * *'
  
  # 改为每周一次：
  # - cron: '0 1 * * 1'
  
  # 改为每天两次：
  # - cron: '0 1,13 * * *'
```

### 修改文章主题

编辑 `scripts/generate-enhanced-content.js` 中的 `topics` 数组：

```javascript
const topics = [
  '你的主题1',
  '你的主题2',
  '你的主题3'
];
```

### 添加真实产品信息

编辑 `.env` 文件：

```env
# 品牌信息
BRAND_NAME=robotailpets
BRAND_WEBSITE=https://robotailpets.com
SHOPIFY_STORE=3fc127-0e.myshopify.com
AMAZON_STORE_US=https://amazon.com/s?me=YOUR_SELLER_ID

# 主打产品
PRODUCT_1=AI智能宠物玩具球
PRODUCT_2=智能视觉自动喂食器
PRODUCT_3=360°全景宠物监控摄像头
```

## 📈 SEO 优化策略

### Google 索引优化

1. **提交站点地图**
   - 部署后访问：`https://your-site.vercel.app/sitemap.xml`
   - 提交到 Google Search Console

2. **内链策略**
   - 每篇文章自动包含 3-5 个内链
   - 链接到产品页面和其他文章

3. **外链策略**
   - 自动链接到官网和亚马逊店铺
   - 提升品牌权威度

### 关键词策略

系统自动优化以下关键词：
- `robotailpets`
- `智能宠物玩具`
- `自动宠物喂食器`
- `宠物监控摄像头`
- `AI 宠物科技`

## 🖼️ 图片优化

### 当前方案（占位符）

系统生成图片占位符（placeholder）：
- 自动生成合适尺寸（800x600）
- 包含 SEO 友好的 alt 文本
- 快速加载

### 升级方案（真实图片）

1. **手动替换**
   - 将真实产品图片放到 `blog/public/images/posts/`
   - 修改文章中的图片链接

2. **自动生成**（可选）
   - 使用 DALL-E / Midjourney API
   - 生成产品效果图
   - 成本：约 $0.02-0.04/张

3. **从独立站抓取**
   - 自动从 Shopify 店铺获取产品图片
   - 需要配置 Shopify API

## 💰 运行成本

### 每月预算估算

| 项目 | 费用 |
|------|------|
| Claude API（30篇文章） | $1.5-3 |
| Vercel 托管 | $0（免费版） |
| 域名（可选） | $1/月 |
| **总计** | **$2.5-4/月** |

### ROI 预期

- 📈 **30天后**：Google 收录 20-30 篇文章
- 📈 **60天后**：自然搜索流量 +100-200/月
- 📈 **90天后**：品牌搜索量 +50%

## 🎯 使用场景

### 场景 1：提升品牌知名度

用户在 Google 搜索：
- "robotailpets 怎么样"
- "robotailpets 评测"
- "智能宠物玩具推荐"

→ 看到你的博客文章 → 建立信任 → 访问官网/亚马逊

### 场景 2：内容营销

- 每天自动发布高质量内容
- 覆盖不同关键词
- 长尾流量积累

### 场景 3：SEO 优化

- 为独立站和亚马逊店铺导流
- 提升整体搜索排名
- 增加品牌曝光

## 📋 下一步行动清单

### 立即执行（今天）

- [ ] 测试生成增强版文章
- [ ] 创建 GitHub 仓库
- [ ] 推送代码到 GitHub
- [ ] 部署到 Vercel

### 本周完成

- [ ] 配置 GitHub Actions
- [ ] 提交站点地图到 Google
- [ ] 生成 5-10 篇文章
- [ ] 配置自定义域名（可选）

### 持续优化

- [ ] 监控 Google Analytics
- [ ] 优化高流量文章
- [ ] 添加真实产品图片
- [ ] A/B 测试不同标题

## 🔧 故障排除

### 文章生成失败

```bash
# 测试 API 连接
node scripts/test-api.js

# 查看详细日志
node scripts/generate-enhanced-content.js
```

### 部署失败

1. 检查 GitHub Actions 日志
2. 确认 Secrets 配置正确
3. 验证 Vercel 构建配置

### 图片显示问题

1. 检查图片路径
2. 确认文件存在于 `blog/public/images/`
3. 清除浏览器缓存

## 📞 支持

遇到问题查看：
- `README.md` - 基础使用
- `FINAL_GUIDE.md` - 完整指南
- 本文档 - 自动化部署

---

**开始你的自动化内容营销之旅！** 🚀

每天自动生成，持续积累流量，让 Google 上到处都是你的品牌！
