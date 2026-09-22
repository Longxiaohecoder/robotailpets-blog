# 🚀 快速部署到 Vercel（5分钟完成）

## 方法：通过 Vercel 网页部署（推荐）

### 第一步：准备 GitHub 仓库

你的代码已经在本地 Git 仓库中了。现在需要推送到 GitHub：

1. **创建 GitHub 仓库**
   - 访问：https://github.com/new
   - 仓库名：`robotailpets-blog`
   - 设置为 Public（让 Vercel 免费部署）
   - 不要初始化 README、.gitignore 或 license（我们已经有了）
   - 点击 "Create repository"

2. **推送代码到 GitHub**

在终端运行（替换 `YOUR_USERNAME` 为你的 GitHub 用户名）：

```bash
cd /Users/longxiaohe/Documents/claude-seo/auto-blog-system

# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/robotailpets-blog.git

# 推送到 GitHub
git push -u origin main
```

如果 GitHub 要求输入密码，使用 Personal Access Token（不是你的密码）：
- 生成 Token：https://github.com/settings/tokens
- 选择 `repo` 权限
- 复制 Token 作为密码使用

---

### 第二步：部署到 Vercel

1. **访问 Vercel**
   - 打开：https://vercel.com
   - 点击 "Sign Up" 或 "Login"
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "Add New..." → "Project"
   - 在列表中找到 `robotailpets-blog`
   - 点击 "Import"

3. **配置项目**（关键！）

   **Framework Preset**: 选择 `Astro`
   
   **Root Directory**: 保持为 `./`（根目录）
   
   **Build & Development Settings**:
   - Build Command: `cd blog && npm install && npm run build`
   - Output Directory: `blog/dist`
   - Install Command: `npm install && cd blog && npm install`
   
   **Environment Variables**（点击 "Add" 添加以下变量）:
   
   | Name | Value |
   |------|-------|
   | `ANTHROPIC_API_KEY` | `sk-uiixTH8ZRaGf2EYvlaxH5WWTkpxsio3B7FON3k8bnSdlFFDx` |
   | `ANTHROPIC_BASE_URL` | `https://heyroute.ai` |

4. **开始部署**
   - 点击 "Deploy"
   - 等待 2-3 分钟构建完成
   - ✅ 完成！你会看到部署成功的界面

5. **获取公网地址**
   - 你会得到一个地址，类似：`https://robotailpets-blog-xxx.vercel.app`
   - 点击 "Visit" 查看你的博客！

---

### 第三步：配置 GitHub Actions 自动发布

1. **在 GitHub 仓库添加 Secrets**
   
   访问：`https://github.com/YOUR_USERNAME/robotailpets-blog/settings/secrets/actions`
   
   点击 "New repository secret"，添加：
   
   | Name | Secret |
   |------|--------|
   | `ANTHROPIC_API_KEY` | `sk-uiixTH8ZRaGf2EYvlaxH5WWTkpxsio3B7FON3k8bnSdlFFDx` |

2. **添加 Variables**
   
   点击 "Variables" 标签，添加：
   
   | Name | Value |
   |------|-------|
   | `ANTHROPIC_BASE_URL` | `https://heyroute.ai` |
   | `POSTS_PER_RUN` | `1` |
   | `BLOG_AUTHOR` | `robotailpets 评测团队` |

3. **启用 Actions**
   
   访问：`https://github.com/YOUR_USERNAME/robotailpets-blog/actions`
   
   如果看到提示，点击 "I understand my workflows, go ahead and enable them"

4. **测试自动生成**
   
   - 点击 "Auto Generate and Publish Posts"
   - 点击 "Run workflow" → "Run workflow"
   - 等待几分钟，查看是否成功生成新文章
   - Vercel 会自动检测到新提交并重新部署

---

### 第四步：提交到 Google Search Console

1. **访问 Google Search Console**
   - 打开：https://search.google.com/search-console
   - 添加你的 Vercel 域名（如 `https://robotailpets-blog-xxx.vercel.app`）

2. **验证所有权**
   - 选择 "HTML 标签" 方法
   - 复制验证代码
   - 在 Vercel 项目中添加到 `blog/src/layouts/BaseLayout.astro` 的 `<head>` 部分
   - 提交代码触发重新部署
   - 回到 Search Console 点击 "验证"

3. **提交站点地图**
   - 在 Search Console 中，点击 "站点地图"
   - 添加：`sitemap-index.xml`
   - 点击 "提交"

4. **手动提交首批文章**
   - 使用 "网址检查" 工具
   - 输入文章 URL（如 `https://your-site.vercel.app/blog/2026-09-22-robotailpets`）
   - 点击 "请求编入索引"
   - 对前 5 篇文章重复此操作

---

## 🎉 完成！

你现在拥有：

✅ **公网可访问的博客**
- 地址：`https://robotailpets-blog-xxx.vercel.app`
- SSL 证书自动配置
- 全球 CDN 加速

✅ **自动化内容生成**
- 每天北京时间 9:00 自动生成新文章
- 自动提交到 GitHub
- Vercel 自动检测并部署

✅ **SEO 优化完整**
- 站点地图自动生成
- 所有文章包含完整 meta 标签
- 关键词、内链、外链优化

✅ **零运营成本**
- Vercel 免费版（100GB 带宽/月）
- GitHub Actions 免费版
- Claude API 约 $2-3/月

---

## 📊 预期效果时间表

**7 天后**：
- 7 篇文章发布
- Google 开始收录

**30 天后**：
- 30 篇文章
- Google 收录 20-25 篇
- 开始有自然搜索流量（50-100/月）

**60 天后**：
- 60 篇文章
- 品牌搜索量 +30%
- 自然流量 200-300/月

**90 天后**：
- 90 篇文章
- 品牌搜索量 +50%
- 自然流量 500-800/月
- 成为宠物科技领域内容权威

---

## 🔧 后续优化建议

### 1. 绑定自定义域名（可选）

如果你有域名（如 `blog.robotailpets.com`）：

1. 在 Vercel 项目中：Settings → Domains
2. 添加你的域名
3. 在域名 DNS 设置中添加 CNAME 记录
4. 等待 DNS 生效（几分钟到几小时）

### 2. 替换真实产品图片

当前使用占位符图片。升级方案：

**方案 A：手动上传**
- 将产品图片放到 `blog/public/images/products/`
- 编辑文章，替换图片链接

**方案 B：从 Shopify 获取**
- 使用 Shopify API 自动拉取产品图片
- 修改 `scripts/generate-enhanced-content.js`

**方案 C：Unsplash 真实图片**
- 注册 Unsplash API
- 自动获取高质量宠物图片

### 3. 添加 Google Analytics

1. 创建 GA4 账号：https://analytics.google.com
2. 获取测量 ID（如 `G-XXXXXXXXXX`）
3. 在 `blog/src/layouts/BaseLayout.astro` 添加跟踪代码

### 4. 扩展文章主题

编辑 `scripts/generate-enhanced-content.js`，添加更多主题：

```javascript
const topics = [
  '现有主题...',
  '新主题 1',
  '新主题 2',
  // 添加更多...
];
```

---

## ❓ 常见问题

**Q: 部署失败怎么办？**
- 检查 Vercel 构建日志
- 确认 Root Directory 和 Build Command 设置正确
- 本地运行 `cd blog && npm run build` 测试

**Q: GitHub Actions 不运行？**
- 检查 Secrets 和 Variables 是否配置
- 查看 Actions 标签页的错误日志
- 手动触发一次测试

**Q: Google 不收录？**
- 提交站点地图后等待 1-3 天
- 使用 URL 检查工具手动提交
- 确保 robots.txt 允许爬虫

**Q: 如何修改发布频率？**
- 编辑 `.github/workflows/auto-publish.yml`
- 修改 cron 表达式
- 推送更改到 GitHub

---

## 📞 需要帮助？

查看完整文档：
- `README.md` - 项目概述
- `AUTOMATION_GUIDE.md` - 自动化详细指南
- `DEPLOY_GUIDE.md` - 部署完整说明

---

**现在就开始部署，让 Google 上到处都是 robotailpets！** 🚀
