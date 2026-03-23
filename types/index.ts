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
  imageUrl?: string;  // 兼容字段
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
  dataSize?: number;
  validDays?: number;
  countries?: Country[];
}

export interface EsimData {
  iccid: string;
  qrCode: string;
  activationCode: string;
  msisdn?: string;
  lpa?: string;
}

// B2B API 返回的完整 SIM 卡数据（order.esimData.sims[]）
export interface B2BSimData {
  id: number;
  iccid: string;
  qrCode: string;        // LPA 激活码字符串，如 "LPA:1$wbg.prod.ondemandconnectivity.com$XXXXX"
  qrCodeUrl: string;     // QR 码图片 URL（用于邮件展示）
  activationCode: string; // matching_id，如 "HDFGO6T8VW7WM1QW"
  directAppleUrl?: string; // iOS 直接安装链接
  lpa?: string;
  apnType?: string;
  apnValue?: string;
  isRoaming?: boolean;
  createdAt?: string;
  confirmationCode?: string | null;
}

export interface Order {
  id: number;
  orderNumber: string;
  orderNo?: string;        // 冗余字段，同 orderNumber
  email?: string;
  customerEmail?: string;
  items?: OrderItem[];
  orderItems?: OrderItem[]; // 兼容旧代码
  product?: any;            // B2B API 返回的关联产品（单个，非数组）
  totalAmount: string | number;
  status: 'pending' | 'paid' | 'delivered' | 'refunded';
  deliveryStatus?: 'pending' | 'delivered' | 'failed';
  paymentMethod?: 'stripe' | 'usdt';
  paymentTime?: string;
  createdAt: string;
  // 快捷 eSIM 字段（B2B API 直接在订单根级返回）
  esimIccid?: string;
  esimQrCode?: string;      // LPA 激活码字符串
  esimActivationCode?: string; // matching_id
  // 完整 eSIM 数据（包含多个 SIM 卡）
  esimData?: {
    sims: B2BSimData[];
    totalCount: number;
  };
  esims?: any[];  // 兼容旧代码
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
