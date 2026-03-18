import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const env = {
    B2B_API_URL: process.env.B2B_API_URL ? '✅ 已配置' : '❌ 未配置',
    B2B_API_TOKEN: process.env.B2B_API_TOKEN ? `✅ 已配置 (${process.env.B2B_API_TOKEN.length} 字符)` : '❌ 未配置',
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL ? 'true' : 'false',
    VERCEL_ENV: process.env.VERCEL_ENV,
  };

  // 测试 B2B API 连接
  let b2bTest = '未测试';
  try {
    const response = await fetch(`${process.env.B2B_API_URL}/agent/products?page=1&pageSize=1`, {
      headers: {
        Authorization: `Bearer ${process.env.B2B_API_TOKEN || ''}`,
        'User-Agent': 'Mozilla/5.0',
      },
    });
    b2bTest = response.ok ? `✅ 成功 (${response.status})` : `❌ 失败 (${response.status})`;
  } catch (error: any) {
    b2bTest = `❌ 错误：${error?.message || '未知'}`;
  }

  return res.status(200).json({
    env,
    b2bTest,
    timestamp: new Date().toISOString(),
  });
}
