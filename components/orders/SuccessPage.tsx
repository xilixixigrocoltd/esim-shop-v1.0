'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, Mail, ShoppingBag } from 'lucide-react';
import { storage, CART_KEY } from '@/lib/utils';

interface SuccessPageProps {
  orderId: string;
  email: string;
}

export default function SuccessPage({ orderId, email }: SuccessPageProps) {
  useEffect(() => {
    storage.remove(CART_KEY);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">订单提交成功</h1>
        <p className="text-gray-600 mb-6">感谢您的购买！</p>

        <div className="bg-white rounded-xl p-6 shadow-sm mb-6 text-left">
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">订单号</p>
            <p className="font-semibold text-gray-900">{orderId || '处理中...'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">接收邮箱</p>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <p className="font-semibold text-gray-900">{email}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
          <p className="text-sm text-blue-800">
            <span className="font-medium">下一步：</span>
            请查收邮件获取eSIM二维码。如未收到，请检查垃圾邮件文件夹或联系客服。
          </p>
        </div>

        <div className="space-y-3">
          <Link href="/countries" className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl">
            <ShoppingBag className="w-5 h-5" />
            继续购物
          </Link>
          <Link href="/" className="block w-full py-3 text-gray-600 hover:text-gray-900">
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
