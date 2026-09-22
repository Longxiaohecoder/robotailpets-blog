# 🚀 robotailpets 博客一键部署指南

## 第一步：部署到 Vercel（推荐，5分钟完成）

### 1. 准备 GitHub 仓库

```bash
cd /Users/longxiaohe/Documents/claude-seo/auto-blog-system

# 初始化 Git（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "🚀 robotailpets 自动化博客系统 v1.0"

# 创建 main 分支
git branch -M main

# 添加远程仓库（替换为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/robotailpets-blog.git

# 推送到 GitHub
git push -u origin main
```

### 2. 部署到 Vercel

#### 方式 A：通过网页（最简单）

1. 访问 [https://vercel.com](https://vercel.com)
2. 点击 "Add New" → "Project"
3. 导入你的 GitHub 仓库 `robotailpets-blog`
4. 配置：
   - **Framework Preset**: Astro
   - **Root Directory**: `blog`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. 添加环境变量：
   - `ANTHROPIC_API_KEY`: `sk-uiixTH8ZRaGf2EYvlaxH5WWTkpxsio3B7FON3k8bnSdlFFDx`
   - `ANTHROPIC_BASE_URL`: `https://heyroute.ai`
6. 点击 "Deploy"

✅ **完成！** 你会获得一个公网地址：`https://robotailpets-blog.vercel.app`

#### 方式 B：通过 CLI

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
cd blog
vercel

# 添加环境变量
vercel env add ANTHROPIC_API_KEY
vercel env add ANTHROPIC_BASE_URL

# 生产部署
vercel --prod
```

### 3. 绑定自定义域名（可选）

在 Vercel 项目设置中：
1. Settings → Domains
2. 添加你的域名（如 `blog.robotailpets.com`）
3. 按照提示配置 DNS 记录

---

## 第二步：启用自动化发布

### 配置 GitHub Actions

1. 在 GitHub 仓库，进入 **Settings** → **Secrets and variables** → **Actions**

2. 点击 "New repository secret"，添加：

   | 名称 | 值 |
   |------|-----|
   | `ANTHROPIC_API_KEY` | `sk-uiixTH8ZRaGf2EYvlaxH5WWTkpxsio3B7FON3k8bnSdlFFDx` |

3. 在 **Variables** 标签页，添加：

   | 名称 | 值 |
   |------|-----|
   | `ANTHROPIC_BASE_URL` | `https://heyroute.ai` |
   | `POSTS_PER_RUN` | `1` |

4. 进入 **Actions** 标签页，启用 workflows

### 自动化时间表

系统会在以下时间自动生成并发布文章：

- ⏰ **每天北京时间 9:00**（UTC 01:00）
- 📝 自动生成 1 篇新文章
- 🚀 自动提交并部署到 Vercel
- 🔄 无需人工干预

### 手动触发生成

如果你想立即生成文章：

1. GitHub 仓库 → Actions
2. 选择 "Auto Publish Blog Posts"
3. 点击 "Run workflow" → "Run workflow"

---

## 第三步：提交到 Google（让全世界看到）

### 1. 提交站点地图

你的站点地图地址：
```
https://your-site.vercel.app/sitemap-index.xml
```

提交到：
- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)

### 2. 验证所有权

在 Google Search Console：
1. 添加资源（网站）
2. 选择验证方法：
   - HTML 文件上传
   - HTML 标签
   - DNS 记录

### 3. 首次索引加速

在 Search Console：
1. URL 检查工具
2. 输入你的文章 URL
3. 点击 "请求编入索引"

对前 5-10 篇文章重复此操作。

---

## 📊 SEO 效果追踪

### Google Analytics 4

1. 创建 GA4 账号：[https://analytics.google.com](https://analytics.google.com)
2. 获取测量 ID（如 `G-XXXXXXXXXX`）
3. 添加到 `blog/src/layouts/BaseLayout.astro`：

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 追踪指标

- 📈 **流量增长**：每日访问量、页面浏览量
- 🔍 **搜索表现**：关键词排名、点击率
- 👥 **用户行为**：跳出率、停留时间
- 🎯 **转化追踪**：点击官网/亚马逊链接次数

---

## 🎯 优化建议

### 内容策略

**第 1-2 周**：建立基础内容
- 每天发布 1 篇文章
- 覆盖核心产品关键词
- 目标：10-15 篇高质量文章

**第 3-4 周**：扩展长尾词
- 开始涉及更多细分话题
- 添加产品对比文章
- 添加用户指南和 FAQ

**第 2 个月**：内链优化
- 文章间相互链接
- 建立话题聚类
- 提升网站权重

### 关键词策略

**品牌词**（优先级最高）：
- robotailpets
- robotailpets 怎么样
- robotailpets 评测
- robotailpets 可靠吗

**产品词**：
- 智能宠物玩具
- 自动宠物喂食器
- 宠物监控摄像头
- AI 宠物机器人

**长尾词**：
- 上班族宠物喂养方案
- 宠物独处焦虑解决办法
- 2024 最好用的宠物摄像头

### 图片优化（重要！）

**升级图片方案**：

1. **从 Shopify 获取产品图**

```javascript
// 添加到 generate-enhanced-content.js
async fetchShopifyProductImages() {
  const response = await fetch(
    `https://${SHOPIFY_STORE}/admin/api/2024-01/products.json`,
    {
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN
      }
    }
  );
  const data = await response.json();
  return data.products.map(p => p.images).flat();
}
```

2. **使用 Unsplash 真实宠物图片**

注册 Unsplash API：[https://unsplash.com/developers](https://unsplash.com/developers)

```javascript
async fetchUnsplashImage(query) {
  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${query}&client_id=YOUR_KEY`
  );
  const data = await response.json();
  return data.results[0].urls.regular;
}
```

3. **AI 生成产品图**（可选）

使用 DALL-E 或 Midjourney API 生成：
- 产品使用场景图
- 宠物互动效果图
- 对比图表

---

## 💰 成本估算

### 每月运营成本

| 项目 | 费用 | 说明 |
|------|------|------|
| Vercel 托管 | $0 | 免费版足够（每月 100GB 带宽） |
| Claude API | $2-3 | 每月 30 篇文章 |
| GitHub Actions | $0 | 免费版足够 |
| Unsplash API | $0 | 免费（50 次/小时） |
| 自定义域名 | $1/月 | 可选 |
| **总计** | **$2-4/月** | 极低成本 |

### ROI 预期

**30 天后**：
- ✅ 30 篇高质量文章发布
- ✅ Google 收录 20-25 篇
- ✅ 自然搜索流量 50-100/月

**60 天后**：
- ✅ 60 篇文章
- ✅ 品牌搜索量 +30%
- ✅ 自然流量 200-300/月
- ✅ 转化到官网/亚马逊 20-30 次

**90 天后**：
- ✅ 90 篇文章
- ✅ 品牌搜索量 +50%
- ✅ 自然流量 500-800/月
- ✅ 成为宠物科技领域权威内容源

---

## 🔧 常见问题

### Q1: GitHub Actions 没有自动运行？

**解决方案**：
1. 检查 Actions 是否已启用
2. 确认 Secrets 配置正确
3. 查看 Actions 日志排查错误
4. 手动触发一次测试

### Q2: Vercel 部署失败？

**解决方案**：
1. 检查 Root Directory 设置为 `blog`
2. 确认 Build Command: `npm run build`
3. 查看 Vercel 构建日志
4. 本地测试 `npm run build` 是否成功

### Q3: Google 不收录我的文章？

**解决方案**：
1. 提交站点地图（等待 1-3 天）
2. 使用 URL 检查工具手动提交
3. 确保 robots.txt 没有禁止爬虫
4. 检查 sitemap.xml 是否可访问
5. 添加 Google Analytics 加速发现

### Q4: 如何修改文章生成主题？

编辑 `scripts/generate-enhanced-content.js`：

```javascript
const topics = [
  '你的自定义主题 1',
  '你的自定义主题 2',
  // 添加更多...
];
```

### Q5: 如何添加更多产品信息？

更新 `brandInfo` 对象：

```javascript
this.brandInfo = {
  name: 'robotailpets',
  website: 'https://robotailpets.com',
  amazonUS: 'https://amazon.com/shops/YOUR_SHOP',
  products: [
    '产品 1',
    '产品 2',
    // 添加更多...
  ]
};
```

---

## 📞 下一步行动

### 今天完成（必须）：
- [ ] 推送代码到 GitHub
- [ ] 部署到 Vercel
- [ ] 配置 GitHub Secrets
- [ ] 测试自动化生成

### 本周完成（重要）：
- [ ] 提交站点地图到 Google
- [ ] 配置 Google Analytics
- [ ] 生成 10 篇文章
- [ ] 绑定自定义域名

### 持续优化（长期）：
- [ ] 每周查看 Search Console 数据
- [ ] 优化高流量文章
- [ ] 添加真实产品图片
- [ ] 扩展到更多话题

---

## 🎉 恭喜！

你现在拥有一个：
- ✅ 全自动内容生成系统
- ✅ 每天自动发布高质量文章
- ✅ SEO 深度优化
- ✅ 公网可访问
- ✅ Google 可索引
- ✅ 极低运营成本

**开始你的自动化内容营销之旅！** 🚀

每天自动生成，持续积累流量，让 Google 搜索结果里到处都是 robotailpets！
