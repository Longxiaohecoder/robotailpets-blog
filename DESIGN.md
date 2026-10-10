# Robotail 宠物家庭生活志：界面改版

日期：2026-10-10

## 设计与保留范围

将通用博客改为温馨的宠物家庭生活杂志：暖白、鼠尾草绿、木质与亚麻场景；以人和宠物共同生活为主视觉。Design variance 6 / motion 3 / visual density 3。原生 Astro + CSS，没有新增前端框架或运行时依赖。

- 保留 Robotail 名称、所有已发布文章及 URL、品牌官网入口、canonical、sitemap 和 robots。
- 首页包含居家陪伴主视觉、最新文章、生活主题和相处理念；文章列表增加分类与搜索；阅读页增加目录、阅读时长和标签入口。
- 适配手机菜单、键盘导航、减少动态效果偏好、日夜配色及配色持久化。
- 草稿筛选、事实来源规则、自动生成与 GitHub 发布工作流未更改。没有为填满页面虚构文章；未有已发布内容的分类显示真实空状态。
- 本次三张图片是 AI 生成的生活方式示意，不是 Robotail 产品实拍、用户案例或客户背书。保留原始生成图片，发布版本为 WebP；每张提供 640 / 960 / 1500 像素响应式尺寸。

## 检查证据

- `bash scripts/blog.sh build` 成功；现有 6 项生成器测试全部通过。
- Chrome：1440px 桌面、390px 手机，日间/夜间截图复核；图片正常加载，没有横向溢出。
- 手机菜单及 Escape 关闭、分类空状态、关键词匹配/无结果、重置、文章目录 3 个锚点、刷新后配色保持均通过。
- Lighthouse 针对本地生产构建的默认移动设备模拟：Performance 99 / Accessibility 100 / Best Practices 100 / SEO 100；LCP 2.0s，CLS 0。不是线上网站的现场实测成绩。
- 截图：`output/playwright/`（本地保留，不上传 GitHub）；审计：`.local/design-lighthouse.json`。

## 图片与完整生成提示词

### home-together

发布资源：

- `blog/public/images/journal/home-together.webp`
- `blog/public/images/journal/home-together-640.webp`
- `blog/public/images/journal/home-together-960.webp`

原始文件：`/Users/longxiaohe/.codex/generated_images/01a0bdd3-f1a3-7913-9334-dcfb360528e8/exec-2442f83b-d489-4c20-956f-921e665af220.png`

完整提示词：

```text
Use case: photorealistic-natural. Asset type: landscape hero photograph for a warm home and pet lifestyle journal. Primary request: people and pets living harmoniously in a welcoming contemporary home. Wide horizontal editorial photograph, 3:2 aspect. One adult woman in soft sage knit clothing seated casually on an ivory linen sofa, naturally petting one relaxed golden retriever beside her; one orange tabby cat curled on the rug near the sofa. Soft morning light through sheer curtains, natural oak floor and furniture, restful warm white walls, subtle green cushions, a small safe non-toxic house plant out of pets' reach. Genuine tactile linen and fur, intimate lived-in room, candid natural posture, camera at seated eye height, full dog and cat visible, believable anatomy. Refined but homely magazine photograph, restrained colors, realistic textures. No products, logos, text, watermark, borders, collage, illustration or graphical UI.
```

### window-cat

发布资源：

- `blog/public/images/journal/window-cat.webp`
- `blog/public/images/journal/window-cat-640.webp`
- `blog/public/images/journal/window-cat-960.webp`

原始文件：`/Users/longxiaohe/.codex/generated_images/01a0bdd3-f1a3-7913-9334-dcfb360528e8/exec-9b14a9fe-91d7-4803-be97-ff0c6fb622ec.png`

完整提示词：

```text
Use case: photorealistic-natural. Asset type: landscape supporting photograph for a home and pet lifestyle journal. A relaxed orange tabby cat sitting on a soft sage cushion beside a sunlit window in a warm minimalist living room, natural oak bench, sheer linen curtains, a warm white ceramic bowl nearby. Close editorial composition with cat and interior details, landscape 3:2. Natural afternoon sunlight, realistic fur and linen, calm lived-in home feeling. No people, branded products, logos, text, watermark, collage or illustration.
```

### daily-companion

发布资源：

- `blog/public/images/journal/daily-companion.webp`
- `blog/public/images/journal/daily-companion-640.webp`
- `blog/public/images/journal/daily-companion-960.webp`

原始文件：`/Users/longxiaohe/.codex/generated_images/01a0bdd3-f1a3-7913-9334-dcfb360528e8/exec-8b6e2135-aefc-4a5b-a014-cc79a256b120.png`

完整提示词：

```text
Use case: photorealistic-natural. Asset type: landscape supporting photograph for a warm home and pet journal. An adult man's hand gently resting on the head of a relaxed golden retriever beside his knees while seated on a soft linen armchair, cropped candid scene focused on the bond with the pet, warm light, oak floor, tasteful sage throw, comfortable homely interior. Landscape 3:2 editorial photography, realistic hands and dog anatomy, tactile fur, natural imperfect textures. No text, logos, watermark, products or collage.
```


