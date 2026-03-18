const B2B_API_URL = process.env.B2B_API_URL || "https://ciuh32wky.xigrocoltd.com/api";
const B2B_API_TOKEN = process.env.B2B_API_TOKEN || "";

import type { Product, ProductListResponse, Order } from "@/types";

class B2BApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${B2B_API_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${B2B_API_TOKEN}`,
        "User-Agent": "Mozilla/5.0",
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API request failed: ${response.status}`, errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText.slice(0, 100)}`);
    }

    const data = await response.json();
    return data.data;
  }

  async getProducts(page = 1, pageSize = 100): Promise<ProductListResponse> {
    return this.request(`/agent/products?page=${page}&pageSize=${pageSize}`);
  }

  async getAllProducts(): Promise<Product[]> {
    const allProducts: Product[] = [];
    let page = 1;
    const pageSize = 100;

    while (true) {
      const response = await this.getProducts(page, pageSize);
      allProducts.push(...response.list);
      if (response.list.length < pageSize) break;
      page++;
      if (page > 30) break;
    }

    return allProducts;
  }

  async getProduct(id: number): Promise<Product> {
    const products = await this.getAllProducts();
    const product = products.find((p: Product) => p.id === id);
    if (!product) throw new Error("Product not found");
    return product;
  }

  async getProductsByCountry(countryCode: string): Promise<Product[]> {
    // 优化：只加载前 10 页（1000 个产品），避免超时
    const allProducts: Product[] = [];
    for (let page = 1; page <= 10; page++) {
      const response = await this.getProducts(page, 100);
      allProducts.push(...response.list);
      if (response.list.length < 100) break;
    }
    
    return allProducts.filter(
      (p: Product) =>
        p.type === "local" &&
        p.countries?.some((c) => c.code.toLowerCase() === countryCode.toLowerCase())
    );
  }

  async createOrder(items: { id: number; quantity: number }[]): Promise<Order> {
    return this.request("/agent/orders", {
      method: "POST",
      body: JSON.stringify({ items }),
    });
  }

  async getOrders(): Promise<Order[]> {
    // 获取最近订单列表（实际项目中可能需要分页）
    const result = await this.request<{ list: Order[] }>("/agent/orders");
    return result.list || [];
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    const orders = await this.getOrders();
    return orders.find(o => o.orderNumber === orderId) || null;
  }
}

export const b2bApi = new B2BApiClient();

export function formatDataSize(mb: number): string {
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)}GB`;
  return `${mb}MB`;
}

export function getCountryFlag(code: string): string {
  const flags: Record<string, string> = {
    CN: "🇨🇳", JP: "🇯🇵", KR: "🇰🇷", TH: "🇹🇭", SG: "🇸🇬", MY: "🇲🇾",
    US: "🇺🇸", GB: "🇬🇧", DE: "🇩🇪", FR: "🇫🇷", IT: "🇮🇹", ES: "🇪🇸",
    AU: "🇦🇺", CA: "🇨🇦", NZ: "🇳🇿", HK: "🇭🇰", TW: "🇹🇼", MO: "🇲🇴",
    ID: "🇮🇩", PH: "🇵🇭", VN: "🇻🇳", IN: "🇮🇳", AE: "🇦🇪", SA: "🇸🇦",
    TR: "🇹🇷", NL: "🇳🇱", CH: "🇨🇭", AT: "🇦🇹", BE: "🇧🇪", DK: "🇩🇰",
    SE: "🇸🇪", NO: "🇳🇴", FI: "🇫🇮", PL: "🇵🇱", CZ: "🇨🇿", HU: "🇭🇺",
    GR: "🇬🇷", PT: "🇵🇹", IE: "🇮🇪", BR: "🇧🇷", MX: "🇲🇽", AR: "🇦🇷",
  };
  return flags[code.toUpperCase()] || "🏳️";
}
