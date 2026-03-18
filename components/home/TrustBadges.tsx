'use client';

import { Shield, Clock, Headphones, RefreshCw } from 'lucide-react';

const trustBadges = [
  {
    icon: Shield,
    title: "安全支付",
    description: "Stripe 加密处理，PCI DSS 认证",
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    icon: Clock,
    title: "即时送达",
    description: "支付成功后 1 分钟内收到 eSIM",
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    icon: Headphones,
    title: "7×24 客服",
    description: "Telegram 在线客服随时待命",
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    icon: RefreshCw,
    title: "7 天退款",
    description: "未激活可全额退款",
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  }
];

export default function TrustBadges() {
  return (
    <section className="py-12 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustBadges.map((badge) => (
            <div key={badge.title} className="flex flex-col items-center text-center">
              <div className={`w-14 h-14 ${badge.bgColor} rounded-xl flex items-center justify-center mb-3`}>
                <badge.icon className={`w-7 h-7 ${badge.color}`} />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{badge.title}</h3>
              <p className="text-sm text-gray-500">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
