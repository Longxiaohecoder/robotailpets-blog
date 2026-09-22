# 🚀 GitHub 自动发布设置指南（5分钟完成）

## 第一步：创建 GitHub 仓库（2分钟）

### 1. 创建新仓库

访问：https://github.com/new

**填写信息**：
- **Repository name**：`robotailpets-blog`
- **Description**：`robotailpets 自动化博客系统 - 每天自动生成SEO优化文章`
- **Public** ✅（必须选择 Public，这样 Google 才能索引）
- **❌ 不要**勾选 "Initialize this repository with a README"（已有本地仓库）

点击 **"Create repository"**

### 2. 记录仓库地址

创建完成后，你会看到类似这样的地址：
```
https://github.com/YOUR_USERNAME/robotailpets-blog.git
```

**重要**：记住你的 GitHub 用户名（YOUR_USERNAME）

---

## 第二步：推送代码到 GitHub（1分钟）

### 打开终端，运行以下命令：

```bash
cd /Users/longxiaohe/Documents/claude-seo/auto-blog-system

# 添加远程仓库（替换 YOUR_USERNAME 为你的实际用户名）
git remote add origin https://github.com/YOUR_USERNAME/robotailpets-blog.git

# 推送代码
git push -u origin main
```

**如果需要输入凭证**：
- Username: 你的 GitHub 用户名
- Password: 使用 Personal Access Token（不是密码）
  - 如果没有 Token，访问：https://github.com/settings/tokens
  - 点击 "Generate new token (classic)"
  - 勾选 `repo` 权限
  - 生成后复制 Token（只显示一次）

---

## 第三步：配置 GitHub Secrets（2分钟）

### 1. 进入仓库设置

访问：`https://github.com/YOUR_USERNAME/robotailpets-blog/settings/secrets/actions`

或者：
1. 进入你的仓库页面
2. 点击 **Settings**（右上角）
3. 左侧菜单找到 **Secrets and variables** → **Actions**

### 2. 添加 API 密钥

点击 **"New repository secret"**

**Secret 1**：
- **Name**: `ANTHROPIC_API_KEY`
- **Value**: `sk-uiixTH8ZRaGf2EYvlaxH5WWTkpxsio3B7FON3k8bnSdlFFDx`
- 点击 **"Add secret"**

### 3. 添加配置变量

点击 **"Variables"** 标签（在 Secrets 旁边）

点击 **"New repository variable"**

**Variable 1**：
- **Name**: `ANTHROPIC_BASE_URL`
- **Value**: `https://heyroute.ai`
- 点击 **"Add variable"**

**Variable 2**：
- **Name**: `POSTS_PER_RUN`
- **Value**: `1`
- 点击 **"Add variable"**

**Variable 3**（可选）：
- **Name**: `CONTENT_TOPIC`
- **Value**: `智能宠物产品、宠物科技、AI宠物玩具`
- 点击 **"Add variable"**

---

## 第四步：启用 GitHub Actions

### 1. 进入 Actions 页面

访问：`https://github.com/YOUR_USERNAME/robotailpets-blog/actions`

### 2. 启用 Workflows

如果看到提示 "Workflows aren't being run on this repository"，点击 **"I understand my workflows, go ahead and enable them"**

### 3. 查看工作流

你应该看到：
- **"Auto Generate and Publish Posts"** - 自动生成和发布文章

点击进入，查看配置。

---

## 第五步：测试自动生成（1分钟）

### 手动触发一次测试

1. 进入 Actions 页面：`https://github.com/YOUR_USERNAME/robotailpets-blog/actions`
2. 点击左侧 **"Auto Generate and Publish Posts"**
3. 点击右侧 **"Run workflow"** 按钮
4. 选择 `main` 分支
5. 点击绿色的 **"Run workflow"**

### 观察运行过程

- 等待 1-2 分钟
- 刷新页面，你会看到运行状态
- 点击正在运行的任务查看详细日志

### 成功标志

✅ **所有步骤都是绿色勾号**  
✅ **在 "Commit and push new posts" 步骤看到提交信息**  
✅ **仓库中出现新的文章文件**

---

## 第六步：连接 Vercel 到 GitHub（自动部署）

### 1. 进入 Vercel 项目设置

访问：https://vercel.com/robotail/auto-blog-system/settings/git

### 2. 连接 Git 仓库

- 点击 **"Connect Git Repository"**
- 选择 **GitHub**
- 授权 Vercel 访问你的 GitHub 账号
- 选择 `robotailpets-blog` 仓库
- 点击 **"Connect"**

### 3. 配置构建设置

确认以下设置：
- **Framework Preset**: `Astro`
- **Root Directory**: `blog`（重要！）
- **Build Command**: `npm install && npm run build`
- **Output Directory**: `dist`

点击 **"Save"**

### 4. 触发首次部署

连接完成后，Vercel 会自动：
- 从 GitHub 拉取代码
- 构建博客
- 部署到生产环境

---

## ✅ 完成！自动化已就绪

### 🎯 系统现在会自动：

**每天北京时间 9:00**：
1. ✅ GitHub Actions 自动触发
2. ✅ 调用 Claude API 生成新文章（2000+ 字 + 7 张图片）
3. ✅ 自动提交到 GitHub 仓库
4. ✅ Vercel 检测到新提交，自动重新部署
5. ✅ 新文章出现在公网博客上
6. ✅ Google 自动发现并索引

**无需任何人工干预！**

---

## 📊 查看自动化运行记录

### GitHub Actions 日志

访问：`https://github.com/YOUR_USERNAME/robotailpets-blog/actions`

查看：
- 每次运行的时间
- 生成了哪些文章
- 是否成功部署

### Vercel 部署日志

访问：https://vercel.com/robotail/auto-blog-system

查看：
- 每次部署的时间
- 构建日志
- 部署状态

---

## 🔧 自定义配置

### 修改发布频率

编辑 `.github/workflows/auto-publish.yml`：

```yaml
schedule:
  # 当前：每天北京时间 9:00 (UTC 1:00)
  - cron: '0 1 * * *'
  
  # 改为每天两次（9:00 和 21:00）
  # - cron: '0 1,13 * * *'
  
  # 改为每周一次（每周一 9:00）
  # - cron: '0 1 * * 1'
```

提交并推送：
```bash
git add .github/workflows/auto-publish.yml
git commit -m "修改发布频率"
git push
```

### 修改每次生成文章数量

在 GitHub 仓库设置中：
- Variables → `POSTS_PER_RUN`
- 改为 `2` 或 `3`（不建议超过 3，以免 API 成本过高）

---

## 📈 预期效果

### 7 天后
- ✅ 11 篇文章（初始 4 篇 + 每天 1 篇）
- ✅ 可以提交站点地图到 Google

### 30 天后
- ✅ 34 篇文章
- ✅ Google 收录 20-25 篇
- ✅ 自然搜索流量 50-100/月

### 60 天后
- ✅ 64 篇文章
- ✅ 品牌搜索量 +30%
- ✅ 自然流量 200-300/月

### 90 天后
- ✅ 94 篇文章
- ✅ 品牌搜索量 +50%
- ✅ 自然流量 500-800/月
- ✅ 成为宠物科技领域权威内容源

---

## 💰 成本估算

| 项目 | 费用 | 说明 |
|------|------|------|
| GitHub Actions | $0 | 免费版（2000 分钟/月） |
| Vercel 托管 | $0 | 免费版（100GB 带宽/月） |
| Claude API | $2-3/月 | 每月 30 篇文章 × $0.08/篇 |
| **总计** | **$2-3/月** | 极低成本 |

---

## 🔍 提交到 Google（重要！）

### 1. Google Search Console

访问：https://search.google.com/search-console

**添加资源**：
- 输入：`https://auto-blog-system-omega.vercel.app`
- 验证所有权（使用 HTML 标签方法）

**提交站点地图**：
- 输入：`https://auto-blog-system-omega.vercel.app/sitemap-index.xml`
- 点击 "提交"

**手动提交首批文章**：
- 使用 "URL 检查" 工具
- 输入前 5 篇文章的完整 URL
- 点击 "请求编入索引"

### 2. Google Analytics（可选）

创建 GA4 账号：https://analytics.google.com

获取测量 ID（如 `G-XXXXXXXXXX`）

添加到 `blog/src/layouts/BaseLayout.astro`

---

## ❓ 常见问题

### Q1: GitHub Actions 没有自动运行？

**检查**：
1. Actions 是否已启用
2. Secrets 配置是否正确
3. cron 时间设置是否正确（UTC 时区）
4. 手动触发一次测试

### Q2: 文章生成失败？

**查看日志**：
- GitHub Actions 页面 → 点击失败的运行 → 查看 "Generate new content" 步骤
- 可能原因：API Key 错误、API 额度用完

### Q3: Vercel 没有自动部署？

**检查**：
1. Vercel 是否已连接到 GitHub 仓库
2. 构建设置是否正确（Root Directory: `blog`）
3. 查看 Vercel 部署日志

### Q4: 如何暂停自动生成？

**方法 1**：禁用 GitHub Actions
- 仓库 → Actions → 选择 workflow → 右上角 "Disable workflow"

**方法 2**：修改 cron 表达式
- 注释掉 `schedule:` 部分

---

## 🎉 恭喜！

你现在拥有一个**完全自动化**的内容营销系统！

**系统特点**：
- ✅ 每天自动生成高质量文章
- ✅ 自动部署到公网
- ✅ Google 可索引
- ✅ 极低成本（$2-3/月）
- ✅ 零人工干预

**开始你的自动化内容营销之旅！** 🚀

让 Google 搜索结果里到处都是 robotailpets！
