import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 加载环境变量 - 使用 override 选项覆盖系统环境变量
dotenv.config({ path: path.join(__dirname, '../.env'), override: true });

class ContentGenerator {
  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY;
    this.baseURL = process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com';
    this.postsDir = path.join(__dirname, '../blog/src/content/posts');

    console.log(`📡 使用 API 端点: ${this.baseURL}`);
    console.log(`🔑 API Key: ${this.apiKey.substring(0, 10)}...${this.apiKey.substring(this.apiKey.length - 4)}`);
  }

  /**
   * 生成博客文章
   */
  async generatePost(topic = null) {
    const contentTopic = topic || process.env.CONTENT_TOPIC || '技术与创新';
    const language = process.env.CONTENT_LANGUAGE || 'zh';

    console.log(`🤖 正在生成文章，主题：${contentTopic}...`);

    const prompt = `你是一个专业的内容营销专家和技术博客作者。

请基于以下主题生成一篇高质量的博客文章：${contentTopic}

要求：
1. 文章语言：${language === 'zh' ? '中文' : '英文'}
2. 文章长度：1500-2000字
3. 包含实用的见解和可操作的建议
4. SEO 友好：自然融入相关关键词
5. 结构清晰：有引言、主体（2-3个小节）、结论
6. 语气专业但易懂

请以 JSON 格式返回，格式如下：
{
  "title": "文章标题",
  "description": "文章简介（100-150字）",
  "tags": ["标签1", "标签2", "标签3"],
  "content": "文章正文内容（使用 Markdown 格式）"
}

直接返回 JSON，不要添加其他说明文字。`;

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

      // 提取 JSON（处理可能的代码块包装）
      let jsonText = responseText;
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) ||
                       responseText.match(/```\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      }

      const article = JSON.parse(jsonText);

      return article;
    } catch (error) {
      console.error('❌ 生成文章失败:', error.message);
      throw error;
    }
  }

  /**
   * 保存文章到博客目录
   */
  savePost(article) {
    // 确保目录存在
    if (!fs.existsSync(this.postsDir)) {
      fs.mkdirSync(this.postsDir, { recursive: true });
    }

    // 生成文件名（使用时间戳和标题）
    const timestamp = new Date().toISOString().split('T')[0];
    const slug = this.generateSlug(article.title);
    const filename = `${timestamp}-${slug}.md`;
    const filepath = path.join(this.postsDir, filename);

    // 生成 Markdown frontmatter
    const frontmatter = `---
title: "${article.title}"
description: "${article.description}"
pubDate: ${new Date().toISOString()}
tags: ${JSON.stringify(article.tags)}
author: "${process.env.BLOG_AUTHOR || 'AI Content Generator'}"
---

`;

    const fullContent = frontmatter + article.content;

    // 保存文件
    fs.writeFileSync(filepath, fullContent, 'utf8');
    console.log(`✅ 文章已保存: ${filename}`);

    return filepath;
  }

  /**
   * 生成 URL 友好的 slug
   */
  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  }

  /**
   * 运行内容生成
   */
  async run() {
    const postsCount = parseInt(process.env.POSTS_PER_RUN || '1');

    console.log(`\n🚀 开始生成 ${postsCount} 篇文章...\n`);

    for (let i = 0; i < postsCount; i++) {
      try {
        console.log(`📝 生成第 ${i + 1}/${postsCount} 篇文章...`);
        const article = await this.generatePost();
        this.savePost(article);
        console.log('');
      } catch (error) {
        console.error(`第 ${i + 1} 篇文章生成失败:`, error.message);
      }
    }

    console.log('🎉 内容生成完成！');
  }
}

// 运行
const generator = new ContentGenerator();
generator.run().catch(console.error);
