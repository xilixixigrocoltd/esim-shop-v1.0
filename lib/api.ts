const B2B_API_URL = process.env.B2B_API_URL || "https://api.xigrocoltd.com";
const API_KEY = process.env.API_KEY || "";
const API_SECRET = process.env.API_SECRET || "";

import type { Product, ProductListResponse, Order } from "@/types";

// HMAC-SHA256 签名
async function hmacSha256(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);
  
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

class B2BApiClient {
  private async request<T>(endpoint: string, method: "GET" | "POST" = "GET", data?: any): Promise<T> {
    const timestamp = Date.now().toString();
    const nonce = Math.random().toString(36).substring(2, 15);
    const body = data ? JSON.stringify(data) : "";
    
    const signString = timestamp + nonce + method + endpoint + body;
    const signature = await hmacSha256(signString, API_SECRET);
    
    const url = `${B2B_API_URL}${endpoint}`;
    const response = await fetch(url, {
      method,
      headers: {
        "x-api-key": API_KEY,
        "x-timestamp": timestamp,
        "x-nonce": nonce,
        "x-signature": signature,
        "Content-Type": "application/json",
      },
      body: data ? body : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API request failed: ${response.status}`, errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText.slice(0, 100)}`);
    }

    const result = await response.json();
    if (result.code !== 0) {
      throw new Error(result.message || "API 返回错误");
    }
    
    return result.message;
  }

  async getProducts(page = 1, limit = 100): Promise<{ products: Product[]; pagination: any }> {
    return this.request(`/api/v1/products?limit=${limit}&page=${page}`);
  }

  async getAllProducts(): Promise<Product[]> {
    const allProducts: Product[] = [];
    let page = 1;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
      const result = await this.getProducts(page, limit);
      allProducts.push(...result.products);
      
      const totalPages = result.pagination?.totalPages || 1;
      if (page >= totalPages || result.products.length < limit) {
        hasMore = false;
      } else {
        page++;
      }
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
    const allProducts = await this.getAllProducts();
    
    return allProducts.filter(
      (p: Product) =>
        p.type === "local" &&
        p.countries?.some((c) => c.code.toLowerCase() === countryCode.toLowerCase())
    );
  }

  async createOrder(items: Array<{ id: number; quantity: number }>): Promise<Order> {
    return this.request("/api/v1/orders", "POST", { items });
  }

  async getOrder(orderId: string): Promise<Order> {
    return this.request(`/api/v1/orders/${orderId}`);
  }
}

export const b2bApi = new B2BApiClient();

// 获取国家旗帜
export function getCountryFlag(code: string): string {
  const codePoints = code
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// 格式化流量显示
export function formatDataSize(dataSize: number): string {
  if (dataSize === 0) return '无限流量';
  if (dataSize >= 1024) return `${(dataSize / 1024).toFixed(1)} GB`;
  return `${dataSize} MB`;
}
