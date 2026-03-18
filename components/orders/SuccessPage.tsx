'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { CheckCircle, Mail, ShoppingBag, QrCode, AlertCircle } from 'lucide-react';
import { storage, CART_KEY } from '@/lib/utils';

interface SuccessPageProps {
  orderId?: string;
  email?: string;
}

export default function SuccessPage({ orderId: propOrderId, email: propEmail }: SuccessPageProps) {
  const router = useRouter();
  const [orderId, setOrderId] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fetchingDetails, setFetchingDetails] = useState(false);

  useEffect(() => {
    // 清空购物车
    storage.remove(CART_KEY);

    // 从 URL 参数获取订单信息
    const { orderId: urlOrderId, email: urlEmail, session_id } = router.query;
    
    // 处理 Stripe session_id
    if (session_id) {
      setFetchingDetails(true);
      fetch(`/api/payment/status?session_id=${session_id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setOrderId(data.orderId || `Stripe-${(session_id as string).slice(-8)}`);
            setEmail(data.email || '');
            setOrderDetails(data);
          } else {
            setOrderId(`Stripe-${(session_id as string).slice(-8)}`);
          }
        })
        .catch(() => {
          setOrderId(`Stripe-${(session_id as string).slice(-8)}`);
        })
        .finally(() => {
          setFetchingDetails(false);
          setLoading(false);
        });
      return;
    }
    
    if (urlOrderId) {
      setOrderId(urlOrderId as string);
    } else if (propOrderId) {
      setOrderId(propOrderId);
    }

    if (urlEmail) {
      setEmail(urlEmail as string);
    } else if (propEmail) {
      setEmail(propEmail);
    }

    setLoading(false);
  }, [router.query, propOrderId, propEmail]);

  if (loading || fetchingDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">正在获取订单信息...</p>
        </div>
      </div>
    );
  }

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
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">接收邮箱</p>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <p className="font-semibold text-gray-900">{email || '未提供'}</p>
            </div>
          </div>
          <div className="border-t pt-4">
            <p className="text-sm text-gray-500 mb-2 font-medium">eSIM 安装步骤</p>
            <ol className="space-y-2 text-sm text-gray-700 text-left">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                <span>打开设置 → 蜂窝网络 → 添加 eSIM</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                <span>扫描二维码或手动输入激活码</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                <span>启用数据漫游，选择新 eSIM 用于数据</span>
              </li>
            </ol>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
          <div className="flex items-start gap-3">
            <QrCode className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800 font-medium">
                eSIM 二维码将通过邮件发送
              </p>
              <p className="text-sm text-blue-700 mt-1">
                如 5 分钟内未收到，请检查垃圾邮件文件夹或联系客服<br />
                Telegram: @Simryokoesimbot | Email: xilixi@xigrocoltd.com
              </p>
            </div>
          </div>
        </div>

        {orderDetails?.paymentStatus === 'paid' && (
          <div className="bg-green-50 rounded-xl p-4 mb-6 text-left">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-green-800 font-medium">
                  支付已成功确认
                </p>
                <p className="text-sm text-green-700 mt-1">
                  您的 eSIM 已激活，请立即查收邮件
                </p>
              </div>
            </div>
          </div>
        )}

        {orderDetails?.paymentStatus === 'unpaid' && (
          <div className="bg-yellow-50 rounded-xl p-4 mb-6 text-left">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-800 font-medium">
                  支付待确认
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  支付成功后 eSIM 将自动发送到您的邮箱
                </p>
              </div>
            </div>
          </div>
        )}

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
