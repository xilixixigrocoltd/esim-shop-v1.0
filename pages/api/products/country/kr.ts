// Korea products - 2026-03-22
import type { NextApiRequest, NextApiResponse } from 'next';
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json({ success: true, data: [{ id: 2, name: "韩国 2GB/5 天", price: 3.50 }] });
}
