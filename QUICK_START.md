# 🚀 快速操作清单 - 启用 GitHub 自动发布

## ⚡️ 最快路径（10分钟完成）

### 步骤 1：创建 GitHub 仓库（2分钟）

1. **访问**：https://github.com/new
2. **仓库名**：`robotailpets-blog`
3. **设置为 Public** ✅
4. **不要**勾选 "Initialize with README" ❌
5. **点击 "Create repository"**

### 步骤 2：推送代码（1分钟）

在终端运行：

```bash
cd /Users/longxiaohe/Documents/claude-seo/auto-blog-system
./push-to-github.sh
```

或者手动运行：

```bash
# 替换 YOUR_USERNAME 为你的 GitHub 用户名
git remote add origin https://github.com/YOUR_USERNAME/robotailpets-blog.git
git push -u origin main
```

### 步骤 3：配置 GitHub Secrets（2分钟）

访问：`https://github.com/YOUR_USERNAME/robotailpets-blog/settings/secrets/actions`

**添加 Secret**：
- 点击 "New repository secret"
- Name: `ANTHROPIC_API_KEY`
- Value: `sk-uiixTH8ZRaGf2EYvlaxH5WWTkpxsio3B7FON3k8bnSdlFFDx`
- 点击 "Add secret"

**切换到 Variables 标签**，添加：
- Name: `ANTHROPIC_BASE_URL`, Value: `https://heyroute.ai`
- Name: `POSTS_PER_RUN`, Value: `1`

### 步骤 4：启用 Actions（30秒）

访问：`https://github.com/YOUR_USERNAME/robotailpets-blog/actions`

- 点击 "I understand my workflows, go ahead and enable them"

### 步骤 5：手动测试一次（1分钟）

在 Actions 页面：
1. 点击 "Auto Generate and Publish Posts"
2. 点击 "Run workflow"
3. 选择 `main` 分支
4. 点击绿色 "Run workflow"

等待 2-3 分钟，查看是否成功生成新文章。

### 步骤 6：连接 Vercel 到 GitHub（3分钟）

访问：https://vercel.com/robotail/auto-blog-system/settings/git

1. 点击 "Connect Git Repository"
2. 选择 GitHub
3. 授权并选择 `robotailpets-blog` 仓库
4. 确认构建设置：
   - Root Directory: `blog`
   - Build Command: `npm install && npm run build`
   - Output Directory: `dist`
5. 点击 "Connect"

---

## ✅ 完成！

**系统现在会自动**：
- ⏰ 每天北京时间 9:00 生成新文章
- 📝 自动提交到 GitHub
- 🚀 Vercel 自动部署到公网
- 🔍 Google 自动发现新内容

**无需任何人工操作！**

---

## 📊 验证成功的标志

### GitHub Actions
- ✅ 访问 Actions 页面看到绿色勾号
- ✅ 仓库中出现新的文章文件
- ✅ 提交历史中看到自动提交

### Vercel
- ✅ 部署历史中看到新的部署
- ✅ 访问网站看到新文章

### 网站
- ✅ https://auto-blog-system-omega.vercel.app 显示新文章
- ✅ 文章数量每天增加

---

## 🎯 预期时间表

| 时间 | 文章数量 | 预期效果 |
|------|---------|---------|
| 今天 | 4篇 | 网站已上线 |
| 7天后 | 11篇 | 可提交 Google |
| 30天后 | 34篇 | Google 收录 20-25 篇 |
| 60天后 | 64篇 | 自然流量 200-300/月 |
| 90天后 | 94篇 | 自然流量 500-800/月 |

---

## 💰 成本

- **GitHub**: $0（免费版）
- **Vercel**: $0（免费版）
- **Claude API**: $2-3/月
- **总计**: $2-3/月

---

## 📚 详细文档

如果遇到问题，查看：
- **[GITHUB_AUTO_PUBLISH_SETUP.md](GITHUB_AUTO_PUBLISH_SETUP.md)** - 详细图文教程
- **[DEPLOYMENT_SUCCESS.md](DEPLOYMENT_SUCCESS.md)** - 部署成功总结
- **[README.md](README.md)** - 完整项目说明

---

## 🔧 故障排除

### 问题 1：推送失败

**解决**：
- 检查 GitHub 仓库是否已创建
- 使用 Personal Access Token 而不是密码
- Token 生成：https://github.com/settings/tokens

### 问题 2：Actions 失败

**解决**：
- 检查 Secrets 配置是否正确
- 查看 Actions 日志找到错误信息
- API Key 是否有效

### 问题 3：Vercel 未自动部署

**解决**：
- 检查 Git 仓库是否已连接
- Root Directory 必须是 `blog`
- 查看 Vercel 部署日志

---

## 🎉 开始吧！

**现在就开始第一步**：访问 https://github.com/new 创建仓库！

10 分钟后，你将拥有一个完全自动化的内容营销系统！🚀
