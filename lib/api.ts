import type { Product, ProductListResponse, Order } from "@/types";

// JWT Token 缓存
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

async function getToken(): Promise<string> {
  // 如果 token 还有效（提前5分钟刷新）
  if (cachedToken && Date.now() < tokenExpiry - 5 * 60 * 1000) {
    return cachedToken;
  }

  const res = await fetch(`${process.env.B2B_API_URL || 'https://ciuh32wky.xigrocoltd.com'}/api/agent/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: process.env.B2B_USERNAME || 'lx001',
      password: process.env.B2B_PASSWORD || '123123'
    })
  });

  const data = await res.json();
  if (!data.success || !data.data?.token) {
    throw new Error('登录失败: ' + (data.message || '未知错误'));
  }

  cachedToken = data.data.token as string;
  // JWT 有效期30天，设置25天后刷新
  tokenExpiry = Date.now() + 25 * 24 * 60 * 60 * 1000;
  return cachedToken;
}

async function apiGet(endpoint: string): Promise<any> {
  const token = await getToken();
  const baseUrl = process.env.B2B_API_URL || 'https://ciuh32wky.xigrocoltd.com';

  const res = await fetch(`${baseUrl}${endpoint}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!res.ok) throw new Error(`请求失败: ${res.status}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'API错误');
  return data;
}

class B2BApiClient {
  async getProducts(page = 1, limit = 200): Promise<{ products: Product[]; pagination: any }> {
    const data = await apiGet(`/api/products?limit=${limit}&page=${page}`);
    // data.data 是数字键对象，转成数组
    const products = Object.values(data.data || {}) as Product[];
    return { products, pagination: data.pagination || {} };
  }

  async getAllProducts(): Promise<Product[]> {
    const all: Product[] = [];
    let page = 1;
    let totalPages = 1;

    do {
      const result = await this.getProducts(page, 200);
      all.push(...result.products);
      totalPages = result.pagination?.pages || 1;
      page++;
      if (page <= totalPages) await new Promise(r => setTimeout(r, 200));
    } while (page <= totalPages);

    return all;
  }

  async getProductById(id: string | number): Promise<Product> {
    const data = await apiGet(`/api/products/${id}`);
    return data.data;
  }

  async createOrder(orderData: any): Promise<Order> {
    const token = await getToken();
    const baseUrl = process.env.B2B_API_URL || 'https://ciuh32wky.xigrocoltd.com';

    const res = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.message || '下单失败');
    return data.data;
  }

  // 确认支付订单（用余额扣款，触发 eSIM 分配）
  async confirmOrderPayment(orderId: number): Promise<Order> {
    const token = await getToken();
    const baseUrl = process.env.B2B_API_URL || 'https://ciuh32wky.xigrocoltd.com';

    const res = await fetch(`${baseUrl}/api/orders/${orderId}/pay`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ payType: 'balance' })
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.message || '支付确认失败');
    return data.data;
  }

  // 查询 eSIM 流量使用情况
  async getEsimUsage(iccid: string): Promise<any> {
    const data = await apiGet(`/api/esims/${iccid}/usage`);
    return data.data;
  }

  // 查询产品库存
  async getInventory(productId: number): Promise<any> {
    const data = await apiGet(`/api/products/${productId}/inventory`);
    return data.data;
  }

  // 续费订单
  async topupOrder(orderId: string, packageId: number): Promise<any> {
    const token = await getToken();
    const baseUrl = process.env.B2B_API_URL || 'https://ciuh32wky.xigrocoltd.com';

    const res = await fetch(`${baseUrl}/api/orders/${orderId}/topup`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ packageId })
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.message || '续费失败');
    return data.data;
  }
}

export const b2bApi = new B2BApiClient();

// 工具函数
export function getCountryFlag(code: string): string {
  if (!code || code.length !== 2) return '🌐';
  return code.toUpperCase().replace(/./g, c =>
    String.fromCodePoint(c.charCodeAt(0) + 127397)
  );
}

export function formatDataSize(size: number): string {
  if (!size) return '无限流量';
  if (size >= 1024) return `${(size / 1024).toFixed(0)}GB`;
  return `${size}MB`;
}
