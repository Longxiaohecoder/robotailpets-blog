import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env'), override: true });

class EnhancedContentGenerator {
  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY;
    this.baseURL = process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com';
    this.postsDir = path.join(__dirname, '../blog/src/content/posts');
    this.imagesDir = path.join(__dirname, '../blog/public/images/posts');

    // 品牌信息
    this.brandInfo = {
      name: 'robotailpets',
      website: 'https://robotailpets.com',
      shopify: '3fc127-0e.myshopify.com',
      amazonUS: 'https://amazon.com/s?me=YOUR_STORE_ID', // 需要更新
      products: [
        'AI智能宠物玩具球',
        '智能视觉自动喂食器',
        '360°全景宠物监控摄像头',
        'AI语音互动宠物陪伴机器人'
      ]
    };

    console.log(`📡 使用 API 端点: ${this.baseURL}`);
  }

  async generateEnhancedPost() {
    const topics = [
      '智能宠物玩具选购指南',
      '宠物独自在家的解决方案',
      '如何用科技提升宠物生活质量',
      '2024年最值得买的智能宠物产品',
      '自动宠物喂食器完全评测',
      '宠物监控摄像头对比',
      '如何解决宠物分离焦虑',
      '智能宠物产品使用技巧'
    ];

    const randomTopic = topics[Math.floor(Math.random() * topics.length)];

    console.log(`🤖 正在生成文章主题：${randomTopic}...`);

    const prompt = `你是一个专业的宠物产品评测和SEO内容专家。

请为 robotailpets.com 品牌撰写一篇SEO优化的博客文章。

品牌信息：
- 品牌：robotailpets.com（美国智能宠物产品品牌）
- 独立站：https://robotailpets.com
- Shopify店铺：3fc127-0e.myshopify.com
- 主打产品：AI智能宠物玩具、自动喂食器、宠物监控摄像头、AI陪伴机器人
- 目标市场：美国、欧洲、中国
- SEO目标：提升 Google 搜索排名，增加品牌曝光

文章主题：${randomTopic}

要求：
1. 语言：中文
2. 长度：1800-2200字
3. SEO优化：
   - 自然融入关键词（智能宠物、robotailpets、宠物科技等）
   - 包含内链建议（链接到产品页面）
   - 包含外链（亚马逊、独立站）
4. 结构清晰：
   - 吸引人的引言
   - 3-5个小标题
   - 每个部分有具体建议
   - 实用的总结
5. 包含图片建议（5-8张）：
   - 描述每张图片应该展示什么内容
   - 图片的 alt 文本（SEO优化）
6. 语气：专业但亲切，有温度
7. 包含 CTA（行动号召）：引导访问官网或亚马逊店铺

请以 JSON 格式返回：
{
  "title": "SEO优化的标题（60字以内，包含主关键词）",
  "description": "Meta描述（150-160字，吸引点击）",
  "tags": ["标签1", "标签2", "标签3", "标签4", "标签5"],
  "keywords": ["主关键词1", "关键词2", "长尾词3"],
  "images": [
    {
      "filename": "image-1-description.jpg",
      "alt": "SEO友好的alt文本",
      "description": "图片内容描述（用于生成提示）",
      "placement": "introduction|section1|section2|conclusion"
    }
  ],
  "content": "文章正文（Markdown格式，在需要插入图片的地方用 {{IMAGE:filename}} 标记）",
  "internalLinks": [
    {"text": "链接文字", "url": "/products/smart-cat-toy"}
  ],
  "externalLinks": [
    {"text": "robotailpets官网", "url": "https://robotailpets.com"}
  ],
  "cta": "访问 robotailpets.com 探索更多智能宠物产品"
}

直接返回 JSON，不要添加其他说明。`;

    try {
      const response = await fetch(`${this.baseURL}/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-opus-4-8',
          max_tokens: 4096,
          messages: [{
            role: 'user',
            content: prompt
          }]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API 请求失败 (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      const responseText = data.content[0].text;

      let jsonText = responseText;
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) ||
                       responseText.match(/```\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      }

      const article = JSON.parse(jsonText.trim());
      return article;
    } catch (error) {
      console.error('❌ 生成文章失败:', error.message);
      throw error;
    }
  }

  async generatePlaceholderImages(article) {
    // 确保图片目录存在
    if (!fs.existsSync(this.imagesDir)) {
      fs.mkdirSync(this.imagesDir, { recursive: true });
    }

    console.log(`\n📸 生成图片占位符...`);

    const images = article.images || [];
    const imageUrls = [];

    for (const img of images) {
      // 使用 placeholder 服务生成临时图片
      const width = 800;
      const height = 600;
      const placeholderUrl = `https://via.placeholder.com/${width}x${height}/4A90E2/FFFFFF?text=${encodeURIComponent(img.description || 'Image')}`;

      imageUrls.push({
        filename: img.filename,
        url: placeholderUrl,
        alt: img.alt
      });

      console.log(`  ✓ ${img.filename} - ${img.alt}`);
    }

    return imageUrls;
  }

  saveEnhancedPost(article, imageUrls) {
    if (!fs.existsSync(this.postsDir)) {
      fs.mkdirSync(this.postsDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const slug = this.generateSlug(article.title);
    const filename = `${timestamp}-${slug}.md`;
    const filepath = path.join(this.postsDir, filename);

    // 替换图片标记为实际的 Markdown 图片语法
    let content = article.content;

    for (const img of imageUrls) {
      const marker = `{{IMAGE:${img.filename}}}`;
      const markdown = `\n\n![${img.alt}](${img.url})\n*${img.alt}*\n\n`;
      content = content.replace(marker, markdown);
    }

    // 添加 SEO 关键词和链接信息
    const seoInfo = `
<!-- SEO关键词：${article.keywords?.join(', ')} -->

`;

    // 添加内链和外链
    let linksSection = '\n\n---\n\n## 相关资源\n\n';

    if (article.externalLinks && article.externalLinks.length > 0) {
      linksSection += '### 官方渠道\n';
      article.externalLinks.forEach(link => {
        linksSection += `- [${link.text}](${link.url})\n`;
      });
    }

    if (article.internalLinks && article.internalLinks.length > 0) {
      linksSection += '\n### 推荐阅读\n';
      article.internalLinks.forEach(link => {
        linksSection += `- [${link.text}](${link.url})\n`;
      });
    }

    // 添加 CTA
    if (article.cta) {
      linksSection += `\n\n**${article.cta}**\n`;
    }

    const frontmatter = `---
title: "${article.title}"
description: "${article.description}"
pubDate: ${new Date().toISOString()}
tags: ${JSON.stringify(article.tags)}
keywords: ${JSON.stringify(article.keywords || [])}
author: "robotailpets 评测团队"
featured: true
---

`;

    const fullContent = frontmatter + seoInfo + content + linksSection;
    fs.writeFileSync(filepath, fullContent, 'utf8');

    console.log(`✅ 文章已保存: ${filename}`);
    console.log(`📊 SEO关键词: ${article.keywords?.join(', ')}`);
    console.log(`🔗 包含 ${article.externalLinks?.length || 0} 个外链，${article.internalLinks?.length || 0} 个内链`);

    return filepath;
  }

  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  }

  async run() {
    try {
      console.log('\n🚀 开始生成增强版博客文章...\n');

      const article = await this.generateEnhancedPost();
      console.log(`✓ 文章生成完成: ${article.title}`);

      const imageUrls = await this.generatePlaceholderImages(article);
      console.log(`✓ 图片占位符生成完成: ${imageUrls.length} 张`);

      const filepath = this.saveEnhancedPost(article, imageUrls);

      console.log('\n🎉 增强版文章生成完成！');
      console.log(`📄 文件位置: ${filepath}`);
      console.log(`\n💡 下一步：`);
      console.log(`1. 运行 "npm run dev" 预览文章`);
      console.log(`2. 运行 "npm run build" 构建生产版本`);
      console.log(`3. 部署到 Vercel/Netlify 自动发布到公网`);
    } catch (error) {
      console.error('\n❌ 生成失败:', error.message);
    }
  }
}

const generator = new EnhancedContentGenerator();
generator.run().catch(console.error);
