import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env'), override: true });

class BrandContentGenerator {
  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY;
    this.baseURL = process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com';
    this.postsDir = path.join(__dirname, '../blog/src/content/posts');
  }

  async generateBrandPost() {
    console.log('🤖 正在生成 robotailpets.com 品牌推荐博客...');

    const prompt = `你是一个专业的宠物产品评测和内容营销专家。

请为 robotailpets.com 品牌撰写一篇推荐博客文章。

品牌信息：
- 品牌名称：robotailpets.com
- 主要产品：智能宠物玩具、自动喂食器、宠物监控摄像头、AI 互动宠物陪伴设备
- 产品特点：AI 驱动、自动化、智能互联、解决宠物主人痛点
- 目标客户：忙碌的宠物主人、远程工作者、关注宠物健康和娱乐的人群

文章要求：
1. 语言：中文
2. 长度：2000-2500字
3. 风格：专业但亲切，既有产品推荐又有实用建议
4. SEO优化：自然融入"智能宠物玩具"、"自动宠物喂食器"、"宠物监控"等关键词
5. 结构：
   - 引言（为什么需要智能宠物产品）
   - robotailpets.com 品牌介绍
   - 3-4个明星产品推荐（详细描述特点、适用场景、用户评价）
   - 品牌优势（技术、服务、价格）
   - 购买建议和总结
6. 包含真实场景和具体案例
7. 语气专业但易懂，带有温度

请以 JSON 格式返回：
{
  "title": "文章标题（吸引人且包含关键词）",
  "description": "文章简介（120-150字，SEO优化）",
  "tags": ["标签1", "标签2", "标签3", "标签4", "标签5"],
  "content": "文章正文（使用 Markdown 格式，包含小标题、列表、重点标注）"
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

      // 保存原始响应用于调试
      console.log('📄 AI 响应长度:', responseText.length, '字符');

      let jsonText = responseText;
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) ||
                       responseText.match(/```\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      }

      // 清理可能的格式问题
      jsonText = jsonText.trim();

      let article;
      try {
        article = JSON.parse(jsonText);
      } catch (parseError) {
        console.error('❌ JSON 解析失败，保存原始响应以供检查...');
        const debugFile = path.join(__dirname, '../debug-response.txt');
        fs.writeFileSync(debugFile, responseText, 'utf8');
        console.log(`📝 原始响应已保存到: ${debugFile}`);
        throw new Error(`JSON 解析失败: ${parseError.message}. 请检查 debug-response.txt`);
      }

      return article;
    } catch (error) {
      console.error('❌ 生成文章失败:', error.message);
      throw error;
    }
  }

  savePost(article) {
    if (!fs.existsSync(this.postsDir)) {
      fs.mkdirSync(this.postsDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const slug = 'robotailpets-brand-recommendation';
    const filename = `${timestamp}-${slug}.md`;
    const filepath = path.join(this.postsDir, filename);

    const frontmatter = `---
title: "${article.title}"
description: "${article.description}"
pubDate: ${new Date().toISOString()}
tags: ${JSON.stringify(article.tags)}
author: "宠物科技评测专家"
---

`;

    const fullContent = frontmatter + article.content;
    fs.writeFileSync(filepath, fullContent, 'utf8');
    console.log(`✅ 品牌推荐文章已保存: ${filename}`);

    return filepath;
  }

  async run() {
    try {
      console.log('\n🚀 开始生成 robotailpets.com 品牌推荐文章...\n');
      const article = await this.generateBrandPost();
      const filepath = this.savePost(article);
      console.log('\n🎉 品牌推荐文章生成完成！');
      console.log(`📄 文件位置: ${filepath}`);
      console.log('\n💡 运行 "npm run dev" 预览文章');
    } catch (error) {
      console.error('生成失败:', error.message);
    }
  }
}

const generator = new BrandContentGenerator();
generator.run().catch(console.error);
