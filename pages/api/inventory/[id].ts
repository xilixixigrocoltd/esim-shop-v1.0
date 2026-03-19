import type { NextApiRequest, NextApiResponse } from 'next';
import { b2bApi } from '@/lib/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: '缺少产品 ID' });
    }

    const inventory = await b2bApi.getInventory(Number(id));
    
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate');
    return res.status(200).json({ success: true, data: inventory });
  } catch (error: any) {
    console.error('Failed to fetch inventory:', error);
    return res.status(500).json({ error: `获取库存失败：${error.message}` });
  }
}
