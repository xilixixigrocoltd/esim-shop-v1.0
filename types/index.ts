export interface Country {
  code: string;
  name: string;
  nameEn: string;
  cn?: string;  // B2B API 返回的中文字段
  en?: string;  // B2B API 返回的英文字段
  flag?: string;
  productCount?: number;
}

export interface Product {
  id: number;
  name: string;
  nameEn: string;
  description?: string;
  descriptionEn?: string;
  type: 'local' | 'regional' | 'global';
  countries: Country[];
  dataSize: number;
  validDays: number;
  price: number | string;
  costPrice?: number | string;
  agentPrice?: number | string;  // 兼容旧字段
  stock?: number;
  image?: string;
  features: string[];
  status?: 'active' | 'inactive';
  isHot?: boolean;
  isRecommend?: boolean;
  sortOrder?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface EsimData {
  iccid: string;
  qrCode: string;
  activationCode: string;
  msisdn?: string;
  lpa?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  email: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'delivered' | 'refunded';
  paymentMethod?: 'stripe' | 'usdt';
  paymentTime?: string;
  createdAt: string;
  esimData?: EsimData[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ProductListResponse {
  list: Product[];
  total: number;
  pageSize: number;
  currentPage: number;
}
