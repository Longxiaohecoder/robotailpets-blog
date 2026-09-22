import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const API_KEY = process.env.ANTHROPIC_API_KEY;
const BASE_URL = process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com';

const models = [
  'claude-3-opus-20240229',
  'claude-3-sonnet-20240229',
  'claude-3-haiku-20240307',
  'claude-3-5-sonnet-20240620',
  'claude-3-5-sonnet-20241022',
  'claude-sonnet-4-20250514',
  'claude-opus-4-20250514',
];

console.log('🔍 检测可用模型...\n');
console.log(`API 端点: ${BASE_URL}`);
console.log(`API Key: ${API_KEY.substring(0, 10)}...${API_KEY.substring(API_KEY.length - 4)}\n`);

async function testModel(model) {
  try {
    const response = await fetch(`${BASE_URL}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 10,
        messages: [{ role: 'user', content: 'hi' }]
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`✅ ${model} - 可用`);
      return true;
    } else if (data.error?.code === 'model_not_found') {
      console.log(`❌ ${model} - 未开通`);
      return false;
    } else {
      console.log(`⚠️  ${model} - ${data.error?.message || '未知错误'}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${model} - 请求失败: ${error.message}`);
    return false;
  }
}

async function main() {
  for (const model of models) {
    await testModel(model);
    await new Promise(resolve => setTimeout(resolve, 500)); // 避免请求过快
  }

  console.log('\n完成！');
  console.log('\n📝 如果所有模型都显示"未开通"，请：');
  console.log('1. 联系 heyroute.ai 管理员开通模型');
  console.log('2. 或者检查是否需要切换到其他分组');
  console.log('3. 或者确认 API Key 是否正确');
}

main().catch(console.error);
