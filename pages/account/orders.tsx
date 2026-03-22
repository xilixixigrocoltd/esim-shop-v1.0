'use client';

import { useState, useEffect } from "react";
import SEO from "@/components/ui/SEO";
import Link from "next/link";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";

interface Order {
  id: string;
  productName: string;
  price: number;
  status: string;
  createdAt: string;
  email: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('simryoko_orders') || '[]');
      setOrders(saved);
    } catch {}
  }, []);

  return (
    <>
      <SEO title="我的订单 - SimRyoko" description="查看您的 eSIM 订单" canonical="/account/orders" noIndex />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">我的订单</h1>
          {orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">暂无订单记录</p>
              <Link href="/products" className="px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600">
                去购买套餐
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{order.productName}</h3>
                      <p className="text-sm text-gray-500 mt-1">订单号: {order.id}</p>
                      <p className="text-sm text-gray-500">邮箱: {order.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-orange-600">${Number(order.price).toFixed(2)}</p>
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full mt-1 ${
                        order.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status === 'paid' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {order.status === 'paid' ? '已支付' : '待支付'}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-3">{new Date(order.createdAt).toLocaleString('zh-CN')}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
