import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  console.log('🚀 欢迎使用自动博客系统设置向导\n');

  // 检查 .env 文件是否存在
  const envPath = path.join(__dirname, '../.env');
  const envExamplePath = path.join(__dirname, '../.env.example');

  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env 文件已存在');
    const overwrite = await question('是否要重新配置？(y/n): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('设置已取消');
      rl.close();
      return;
    }
  }

  // 收集配置信息
  console.log('\n📝 请输入以下配置信息:\n');

  const apiKey = await question('Claude API Key (从 console.anthropic.com 获取): ');
  const blogTitle = await question('博客标题 (默认: 我的自动化博客): ') || '我的自动化博客';
  const blogDescription = await question('博客描述 (默认: AI 驱动的内容营销): ') || 'AI 驱动的内容营销';
  const blogAuthor = await question('作者名称 (默认: AI Content Generator): ') || 'AI Content Generator';
  const contentTopic = await question('内容主题 (默认: 技术、营销、SEO): ') || '技术、营销、SEO';
  const contentLanguage = await question('内容语言 zh/en (默认: zh): ') || 'zh';
  const postsPerRun = await question('每次生成文章数 (默认: 1): ') || '1';

  // 生成 .env 文件
  const envContent = `# Claude API 配置
ANTHROPIC_API_KEY=${apiKey}

# 博客配置
BLOG_TITLE=${blogTitle}
BLOG_DESCRIPTION=${blogDescription}
BLOG_AUTHOR=${blogAuthor}

# 内容生成配置
CONTENT_TOPIC=${contentTopic}
CONTENT_LANGUAGE=${contentLanguage}
POSTS_PER_RUN=${postsPerRun}
`;

  fs.writeFileSync(envPath, envContent);
  console.log('\n✅ 配置文件已创建: .env');

  console.log('\n🎉 设置完成！');
  console.log('\n下一步：');
  console.log('1. 运行 "npm install" 安装依赖');
  console.log('2. 运行 "cd blog && npm install" 安装博客依赖');
  console.log('3. 运行 "npm run generate" 生成第一篇文章');
  console.log('4. 运行 "npm run dev" 预览博客\n');

  rl.close();
}

setup().catch(console.error);
