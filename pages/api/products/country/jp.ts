// Japan products - 2026-03-22
import type { NextApiRequest, NextApiResponse } from 'next';
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json({ success: true, data: [{ id: 1, name: "日本 3GB/7 天", price: 4.50 }] });
}
