// 2026-03-22 16:30 - Final fix
import type { NextApiRequest, NextApiResponse } from 'next';

const PRODUCTS = [
  { id: 1, name: "日本 3GB/7 天", price: 4.50, type: "local", countries: [{ code: "JP", cn: "日本" }] },
  { id: 2, name: "韩国 2GB/5 天", price: 3.50, type: "local", countries: [{ code: "KR", cn: "韩国" }] },
  { id: 3, name: "欧洲 5GB/30 天", price: 12.00, type: "regional", countries: [{ code: "DE" }, { code: "FR" }, { code: "GB" }] },
  { id: 4, name: "美国 10GB/30 天", price: 15.00, type: "local", countries: [{ code: "US" }] },
  { id: 5, name: "泰国 5GB/15 天", price: 6.00, type: "local", countries: [{ code: "TH" }] },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const code = (req.query.code as string)?.toUpperCase();
  const filtered = PRODUCTS.filter(p => p.countries?.some(c => c.code?.toUpperCase() === code));
  return res.status(200).json({ success: true, data: filtered });
}
