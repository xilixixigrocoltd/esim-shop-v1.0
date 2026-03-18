import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

const API_KEY = process.env.API_KEY || '';
const API_SECRET = process.env.API_SECRET || '';
const B2B_API_URL = process.env.B2B_API_URL || 'https://api.xigrocoltd.com';

function hmacSha256(message: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(message).digest('hex');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const timestamp = Date.now().toString();
  const nonce = 'test1234567890ab';
  const endpoint = '/api/v1/products?page=1&limit=5';
  const method = 'GET';
  const body = '';
  
  // 签名顺序：method + endpoint + timestamp + nonce + body
  const signString = method + endpoint + timestamp + nonce + body;
  const signature = hmacSha256(signString, API_SECRET);
  
  console.log('API_KEY:', API_KEY ? `${API_KEY.substring(0, 10)}...` : 'EMPTY');
  console.log('API_SECRET:', API_SECRET ? `${API_SECRET.substring(0, 10)}...` : 'EMPTY');
  console.log('Sign String:', signString);
  console.log('Signature:', signature);
  
  try {
    const response = await fetch(`${B2B_API_URL}${endpoint}`, {
      method,
      headers: {
        'x-api-key': API_KEY,
        'x-timestamp': timestamp,
        'x-nonce': nonce,
        'x-signature': signature,
        'Content-Type': 'application/json',
      },
    });
    
    const text = await response.text();
    
    res.status(200).json({
      success: response.ok,
      status: response.status,
      headers: {
        'x-api-key': API_KEY ? `${API_KEY.substring(0, 10)}...` : 'EMPTY',
      },
      response: text.substring(0, 500),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message || 'Unknown error',
    });
  }
}
