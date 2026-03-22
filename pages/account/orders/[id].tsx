'use client';

import { useRouter } from "next/router";
import SEO from "@/components/ui/SEO";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function OrderDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <SEO title="订单详情 - SimRyoko" description="eSIM 订单详情" canonical={`/account/orders/${id}`} noIndex />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/account/orders" className="flex items-center gap-1 text-orange-500 mb-6 hover:text-orange-600">
            <ChevronLeft className="w-4 h-4" /> 返回订单列表
          </Link>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h1 className="text-xl font-bold text-gray-900 mb-2">订单号: {id}</h1>
            <p className="text-gray-500">如需查询订单详情，请联系客服 @Simryokoesimbot</p>
          </div>
        </div>
      </div>
    </>
  );
}
