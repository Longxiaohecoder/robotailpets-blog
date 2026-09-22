# ✅ robotailpets 博客部署清单

**按照这个清单逐步完成，5-10 分钟内让你的博客上线！**

---

## 📋 部署前检查

- ✅ Git 仓库已初始化
- ✅ 所有文件已提交（3 个 commits）
- ✅ 博客构建测试成功
- ✅ 已生成示例文章（2026-09-22-robotailpets.md）
- ✅ GitHub Actions 配置文件就绪
- ✅ Vercel 配置文件就绪

**状态：准备就绪，可以开始部署！** 🚀

---

## 第一步：推送到 GitHub（5 分钟）

### 1.1 创建 GitHub 仓库

1. 打开浏览器，访问：https://github.com/new
2. 填写信息：
   - Repository name: `robotailpets-blog`
   - Description: `robotailpets 自动化博客营销系统`
   - 设置为：**Public**（Vercel 免费版需要公开仓库）
   - **不要**勾选 "Initialize this repository with"（我们已有代码）
3. 点击 "Create repository"

### 1.2 推送代码

复制 GitHub 显示的命令，或者运行（替换 `YOUR_USERNAME` 为你的用户名）：

```bash
cd /Users/longxiaohe/Documents/claude-seo/auto-blog-system

git remote add origin https://github.com/YOUR_USERNAME/robotailpets-blog.git
git push -u origin main
```

**如果需要认证**：
- GitHub 不再支持密码登录
- 需要使用 Personal Access Token
- 生成地址：https://github.com/settings/tokens/new
- 选择 `repo` 权限
- 复制 Token 作为密码使用

✅ **完成标志**：在 GitHub 仓库页面看到所有文件

---

## 第二步：部署到 Vercel（3 分钟）

### 2.1 登录 Vercel

1. 访问：https://vercel.com
2. 点击 "Sign Up" 或 "Login"
3. 选择 "Continue with GitHub"
4. 授权 Vercel 访问你的 GitHub 账号

### 2.2 导入项目

1. 在 Vercel Dashboard，点击 "Add New..." → "Project"
2. 在项目列表中找到 `robotailpets-blog`
3. 点击 "Import"

### 2.3 配置项目（重要！）

**Framework Preset**：
- 选择：`Astro`

**Root Directory**：
- 保持：`./`（根目录）

**Build and Output Settings**：

点击 "Override" 并填写：

| 字段 | 值 |
|------|-----|
| Build Command | `cd blog && npm install && npm run build` |
| Output Directory | `blog/dist` |
| Install Command | `npm install && cd blog && npm install` |

**Environment Variables**（重要！点击 "Add" 逐个添加）：

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | `sk-uiixTH8ZRaGf2EYvlaxH5WWTkpxsio3B7FON3k8bnSdlFFDx` |
| `ANTHROPIC_BASE_URL` | `https://heyroute.ai` |

### 2.4 开始部署

1. 检查所有配置正确
2. 点击 "Deploy"
3. 等待 2-3 分钟（观看构建日志）
4. 看到 "🎉 Congratulations!" 表示成功

✅ **完成标志**：获得公网地址，如 `https://robotailpets-blog-abc123.vercel.app`

### 2.5 测试访问

1. 点击 "Visit" 或直接访问你的域名
2. 应该看到博客首页
3. 点击文章列表，查看已生成的文章

**如果看不到文章**：检查 `blog/src/content/posts/` 目录是否有文章文件

---

## 第三步：配置自动发布（5 分钟）

### 3.1 添加 GitHub Secrets

1. 访问你的 GitHub 仓库
2. 进入：`Settings` → `Secrets and variables` → `Actions`
3. 点击 "New repository secret"

添加以下 Secret：

| Name | Secret |
|------|--------|
| `ANTHROPIC_API_KEY` | `sk-uiixTH8ZRaGf2EYvlaxH5WWTkpxsio3B7FON3k8bnSdlFFDx` |

### 3.2 添加 GitHub Variables

1. 在同一页面，点击 "Variables" 标签
2. 点击 "New repository variable"

添加以下 Variables：

| Name | Value |
|------|-------|
| `ANTHROPIC_BASE_URL` | `https://heyroute.ai` |
| `POSTS_PER_RUN` | `1` |
| `BLOG_AUTHOR` | `robotailpets 评测团队` |

### 3.3 启用 GitHub Actions

1. 访问：`Actions` 标签页
2. 如果看到提示，点击 "I understand my workflows, go ahead and enable them"
3. 应该看到 "Auto Generate and Publish Posts" workflow

### 3.4 测试手动生成

1. 点击 "Auto Generate and Publish Posts"
2. 点击右侧 "Run workflow" 按钮
3. 确认 "Run workflow"
4. 等待几分钟，查看执行状态

✅ **完成标志**：
- Workflow 执行成功（绿色✓）
- 仓库中出现新的提交（新文章）
- Vercel 自动检测并重新部署
- 网站上出现新文章

---

## 第四步：提交到 Google（可选，建议完成）

### 4.1 提交站点地图

1. 访问：https://search.google.com/search-console
2. 点击 "添加资源"
3. 输入你的 Vercel 域名
4. 选择验证方法（推荐 HTML 标签）
5. 验证成功后，提交站点地图：`sitemap-index.xml`

### 4.2 手动提交首批文章

使用 "网址检查" 工具，提交前 3-5 篇文章 URL，加速索引。

---

## 🎉 部署完成！

恭喜！你现在拥有：

✅ **公网可访问的博客**
- 地址：`https://your-site.vercel.app`
- SSL 证书（HTTPS）
- 全球 CDN 加速

✅ **自动化内容生成**
- 每天北京时间 9:00 自动生成新文章
- 自动提交到 GitHub
- Vercel 自动部署

✅ **SEO 完整优化**
- 所有文章包含完整 meta 标签
- 关键词优化
- 内链和外链布局
- 站点地图自动生成

✅ **极低运营成本**
- Vercel: $0（免费版）
- GitHub: $0（免费版）
- Claude API: $2-3/月

---

## 📊 下一步行动

### 立即行动（今天）

- [ ] 分享博客地址给团队
- [ ] 在社交媒体发布第一篇文章
- [ ] 监控 GitHub Actions 自动运行（明天 9:00）

### 本周完成

- [ ] 提交站点地图到 Google Search Console
- [ ] 配置 Google Analytics 4（可选）
- [ ] 绑定自定义域名（可选，如 blog.robotailpets.com）
- [ ] 生成 10 篇文章建立内容基础

### 持续优化

- [ ] 每周查看 Search Console 数据
- [ ] 优化高流量文章
- [ ] 替换真实产品图片
- [ ] 扩展更多主题

---

## 🔧 故障排除

### Vercel 部署失败？

**检查**：
1. Build Command 是否正确：`cd blog && npm install && npm run build`
2. Output Directory 是否为：`blog/dist`
3. 查看 Vercel 构建日志找到错误信息
4. 本地测试：`cd blog && npm run build`

**常见问题**：
- 依赖安装失败：检查 `package.json` 是否正确
- 构建超时：Vercel 免费版有时间限制，通常不会超

### GitHub Actions 不运行？

**检查**：
1. Secrets 是否正确配置
2. Actions 是否已启用
3. 查看 Actions 日志找到错误
4. 手动触发测试一次

### 文章不显示？

**检查**：
1. 文章是否在 `blog/src/content/posts/` 目录
2. 文章 frontmatter 格式是否正确
3. Vercel 是否成功部署
4. 清除浏览器缓存重试

---

## 📞 需要帮助？

查看详细文档：

- **[README.md](README.md)** - 项目概述
- **[VERCEL_DEPLOY.md](VERCEL_DEPLOY.md)** - 详细部署指南
- **[DEPLOY_GUIDE.md](DEPLOY_GUIDE.md)** - 完整优化指南
- **[AUTOMATION_GUIDE.md](AUTOMATION_GUIDE.md)** - 自动化系统说明

---

## 🚀 开始部署

**现在就开始第一步：创建 GitHub 仓库！**

每完成一步，勾选对应的复选框 ✓

祝部署顺利！让 Google 搜索结果里到处都是 robotailpets！🎉
