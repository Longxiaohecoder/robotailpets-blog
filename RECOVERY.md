# 新电脑恢复与当前运行方式

本说明取代旧文档中“所有功能完全正常”“自动发布已经完成”的描述。

## 本地使用

项目实际路径：`/Volumes/XLG-SSD/Users/longxiaohe/Documents/claude-seo/auto-blog-system`。

启动预览（无需在系统 PATH 中安装 npm；优先使用系统 Node，否则使用 Codex 自带 Node）：

```bash
bash /Volumes/XLG-SSD/Users/longxiaohe/Documents/claude-seo/auto-blog-system/scripts/blog.sh dev
```

换电脑或缺少依赖时先安装：

```bash
bash /Volumes/XLG-SSD/Users/longxiaohe/Documents/claude-seo/auto-blog-system/scripts/blog.sh install
```

其他命令：将最后的 `dev` 换为 `build`、`test`、`generate`。安装入口会用锁文件恢复依赖；缺少 npm 时在临时目录下载固定版本，并自动清理。若既没有系统 Node 也没有 Codex 运行时，需要安装 Node.js 22 LTS。

## 内容与发布

- `content/brand-sources.json` 是允许写入文章的事实及来源快照，核实日期为 2026-10-10。
- 当前已核实官网展示的产品名称与分类；没有核实亚马逊店铺、具体功能或技术参数。
- `2026-10-10-robotail-brand-guide.md` 是依据官网资料整理、可公开展示的品牌介绍。
- 原有六篇文章保留。未明确 `draft: false` 的文章默认是草稿，首页、列表、文章路由和站点地图全部排除。
- AI 生成的新文章一律 `draft: true`。核对事实及来源后，编辑 frontmatter 为 `draft: false`，构建成功后再同步部署。
- 来源快照超过 30 天将停止生成并报错，需要重新检查页面和事实后更新快照日期。不得仅修改日期假装核实。
- 不再生成占位图片、虚构用户评价、未经核实的产品链接。

## API 配置

`.env` 存在时只读取项目配置；不存在时读取 CI 环境变量。避免把桌面应用注入的其他供应商端点或模型拼接进博客请求。

```dotenv
ANTHROPIC_API_KEY=填写自己的密钥
ANTHROPIC_BASE_URL=https://heyroute.ai
ANTHROPIC_MODEL=claude-opus-4-8
CONTENT_TOPIC=Robotail 猫砂盆、喂食器及配件选购
CONTENT_LANGUAGE=zh
POSTS_PER_RUN=1
```

配置不输出密钥。生成失败（包括 402、无效 JSON、截断、来源链接不符）会返回失败退出码。

## 云端

GitHub 工作流每天 UTC 01:00（北京时间 09:00）计划运行，实际调度可能延迟。流程为安装锁定依赖 → 测试 → 生成草稿 → 构建 → 检测新文件 → 提交仓库。该流程自动保存草稿，不代表文章已经审核发布。

修复包含 `contents: write`、并发串行控制及新文件检测。仓库设置仍需允许工作流写入，且配置有效的 `ANTHROPIC_API_KEY` Secret。

Vercel 需要连接 `Longxiaohecoder/robotailpets-blog`；Root Directory 为仓库根目录，构建设置由 `vercel.json` 指定。域名默认 `https://auto-blog-system-omega.vercel.app`，可用 `BLOG_SITE_URL` 修改；新增 `/sitemap.xml` 与 `/robots.txt`。

初次检查时这台电脑 GitHub 推送 dry-run 缺少认证。用户完成认证后，推送权限已验证。现有 GitHub → Vercel 集成无需重新连接；同步本次修复后检查 Actions 和 Vercel 部署结果。

公网请求超时只能说明本次环境无法访问，不能据此断定网站已经下线。

## 2026-10-10 验收记录

- 锁文件恢复入口 `bash scripts/blog.sh install` 已实际执行成功。
- `bash scripts/blog.sh test`：6 项通过，包括桌面配置污染、API 402、截断/无效输出、来源链接限制、Markdown 引号及空行、文件名冲突与草稿存储。
- `bash scripts/blog.sh build`：真实生成的新草稿加入后构建成功，公开输出仅包含官网资料整理稿；新增 robots.txt 与 sitemap.xml。
- 本地首页、整理稿文章页返回 HTTP 200，旧品牌稿返回 HTTP 404；站点地图排除草稿。
- `claude-opus-4-8` 最小请求返回 HTTP 200，完整草稿保存至 `blog/src/content/posts/2026-10-10-robotail-13c3baaf.md`。该草稿仍需审核，未对外发布。
- 最近云端运行记录中，Commit and push new posts 被跳过。任务成功状态不能当作发布成功证据。
- 初次本地验收时 GitHub `git push --dry-run` 缺少 HTTPS 身份凭据，尚未提交或推送；随后用户完成认证，见下方云端验收记录。

## 2026-10-10 云端验收

- 修复提交 `acb5d08` 已推送到原仓库 `Longxiaohecoder/robotailpets-blog`，沿用原 Vercel 集成。
- 手动触发的工作流 [38039156217](https://github.com/Longxiaohecoder/robotailpets-blog/actions/runs/38039156217) 全流程成功：安装、6 项测试、实际生成、构建、新文件检测、Commit and push new posts 均成功。
- 自动任务创建提交 `5784ae2` 和草稿 `2026-10-10-robotail-a299eaf1.md`，已快进同步回本地。
- GitHub 上该提交的 Vercel 状态为 success，生产部署 6978509216 为 success，地址为 `https://auto-blog-system-eo4x9uviv-robotail.vercel.app`。
- 公开文章仍为已核实官网来源的品牌介绍，AI 生成稿保持 `draft: true`，未对外展示。
- 本环境访问原主域名和新部署地址均连接超时，尚未完成公网页面 HTTP 验收；该结果不等同于 Vercel 构建失败或网站下线。
- 下次换电脑可按本说明恢复依赖；GitHub 定时任务和 Vercel 部署运行在云端，不依赖旧电脑开机。
