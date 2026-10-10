# Robotail 宠物家庭生活志：界面改版

## 当前版本：英文与猫咪主题（2026-10-10）

验收：构建成功，9 项测试通过；Chrome 检查首页 320/390/768/1024/1440px，无横向溢出；页面语言、搜索、分类、空状态、文章目录与配色持久化通过。首页、文章列表、阅读页与图片说明无中文残留；旧含狗图片 URL 返回 404；草稿仍不对外公开。最新截图以 `output/playwright/cats-` 开头，以下历史性能评分不代表本次重新测量。

- 网站受众：美国与欧洲的养猫家庭；统一使用自然英文，语气温暖、亲切、实用，不添加新产品效果或未经核实的事实。
- HTML 语言、SEO/分享信息、导航、按钮、空状态、搜索、图片说明、作者、日期与现有已发布文章均改为英文；文章 URL 不变。
- 新的语言与受众契约位于 `content/editorial-policy.json`。自动生成强制按该契约执行，不再被旧的本地/CI `CONTENT_LANGUAGE=zh` 设置覆盖；输出中文或犬类内容会在保存前失败。设置向导与 Actions 默认值同步更新。
- 所有含狗的图片已从发布资源中撤下。旧版本由 Git 保留，原始生成文件未删除；本地备份位于 `.local/replaced-dog-images/`，不部署。
- 当前配图仅含猫咪，使用内置图片生成工具编辑两个原始生活方式场景；不是产品实拍或客户故事。另保留现有的 `window-cat` 猫咪窗边图。
- 新资源存放于 `blog/public/images/journal/`，每组包含 1500px、960px、640px WebP。以下为最终提示词与原图路径。

### home-with-cats

资源：`blog/public/images/journal/home-with-cats.webp`、`home-with-cats-960.webp`、`home-with-cats-640.webp`。

原图：`/Users/longxiaohe/.codex/generated_images/01a0bdd3-f1a3-7913-9334-dcfb360528e8/exec-0fe56d91-a86f-4592-9f55-2c3949dc5654.png`

```text
Use case: precise-object-edit. Image 1 is the edit target: the current warm home journal hero photograph. Replace the golden retriever on the sofa with one realistically sized, relaxed silver-gray domestic shorthair cat nestled beside the woman's thigh. Adjust her hands naturally so she gently strokes the cat. Completely remove every trace of the dog. Preserve the adult woman's identity, sage knit outfit, seated posture, ivory linen sofa, natural oak furniture, window light, color palette, camera angle, wide 3:2 composition and the existing orange tabby curled on the rug. The only animals anywhere in the image must be those two cats. Natural feline anatomy, realistic fur and hands, candid photorealistic editorial photography. No dogs, dog imagery, other animals, logos, branded products, text, watermarks or collage.
```

### quiet-cat-moments

资源：`blog/public/images/journal/quiet-cat-moments.webp`、`quiet-cat-moments-960.webp`、`quiet-cat-moments-640.webp`。

原图：`/Users/longxiaohe/.codex/generated_images/01a0bdd3-f1a3-7913-9334-dcfb360528e8/exec-37755674-cdfa-41b7-8921-84c9492ddf9f.png`

```text
Use case: precise-object-edit. Image 1 is the edit target: the current warm home journal companionship photograph. Replace the golden retriever completely with one realistically sized relaxed orange tabby cat perched beside the seated man's knees on the linen armchair, his hand gently stroking the cat's head. Adjust hand position and nearby seating as needed for natural human-cat scale, no oversized cat. Preserve the cropped man's identity and clothing, warm sunlight, soft linen armchair, sage throw, oak floor and intimate wide 3:2 editorial composition. Only one cat, no dogs or other animals anywhere in the scene. Natural feline anatomy, realistic hands and fur, candid photorealistic home-life photography. No logos, products, text, watermarks or collage.
```

## 历史设计记录（以下为先前版本，含狗资源已停用）

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


