# 快速开始指南

## 5 分钟快速上手

### 第一步：安装依赖

```bash
cd auto-blog-system
npm install
cd blog
npm install
cd ..
```

### 第二步：配置系统

```bash
npm run setup
```

按照提示输入：
1. **Claude API Key** - 从 https://console.anthropic.com 获取
2. 其他信息可以直接回车使用默认值

### 第三步：生成第一篇文章

```bash
npm run generate
```

### 第四步：查看效果

```bash
npm run dev
```

打开浏览器访问 http://localhost:4321

## 获取 Claude API Key

1. 访问 https://console.anthropic.com
2. 注册/登录账号
3. 点击 "API Keys" 
4. 创建新的 API Key
5. 复制并保存（只显示一次）

## 常用命令

```bash
# 生成新文章
npm run generate

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 下一步

- 📖 查看 [README.md](README.md) 了解完整功能
- 🚀 学习如何部署到 Vercel/Netlify
- ⏰ 设置 GitHub Actions 自动发布
- 🎨 自定义博客样式

## 需要帮助？

- 检查 `.env.example` 文件查看所有配置选项
- 确保 Node.js 版本 >= 18
- 确保网络可以访问 Anthropic API
