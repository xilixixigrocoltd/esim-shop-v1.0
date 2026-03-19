import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from "@/components/ui/Layout";
import SEO from "@/components/ui/SEO";
import EsimUsageCard from "@/components/orders/EsimUsageCard";

interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
  name: string;
}

interface Order {
  id: string;
  orderId: string;
  status: string;
  totalAmount: number;
  currency: string;
  customerEmail: string;
  customerName: string | null;
  iccids: string[];
  items: OrderItem[];
  createdAt: string;
  paidAt: string | null;
  completedAt: string | null;
}

export default function OrderDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [usageLoading, setUsageLoading] = useState(false);

  // 未登录则跳转登录
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  // 获取订单详情
  useEffect(() => {
    if (status === "authenticated" && id) {
      fetchOrderDetail();
    }
  }, [status, id]);

  async function fetchOrderDetail() {
    try {
      const res = await fetch(`/api/account/orders/${id}`);
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
      } else {
        alert("订单不存在或无权访问");
        router.push("/account/orders");
      }
    } catch (error) {
      console.error("Failed to fetch order:", error);
    } finally {
      setLoading(false);
    }
  }

  async function checkUsage(iccid: string) {
    setUsageLoading(true);
    try {
      const res = await fetch(`/api/esim/usage?iccid=${iccid}`);
      const data = await res.json();
      if (data.success) {
        // 显示流量使用情况
        alert(`流量使用：${data.data.usedMB}/${data.data.totalMB} MB`);
      }
    } catch (error) {
      console.error("Failed to check usage:", error);
      alert("查询失败，请稍后重试");
    } finally {
      setUsageLoading(false);
    }
  }

  function getStatusText(status: string) {
    const statusMap: Record<string, string> = {
      pending: "待支付",
      paid: "已支付",
      completed: "已完成",
      cancelled: "已取消",
      refunded: "已退款",
    };
    return statusMap[status] || status;
  }

  function getStatusColor(status: string) {
    const colorMap: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800",
      cancelled: "bg-gray-100 text-gray-800",
      refunded: "bg-red-100 text-red-800",
    };
    return colorMap[status] || "bg-gray-100 text-gray-800";
  }

  if (status === "loading" || loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <Layout>
      <SEO
        title={`订单详情 ${order.orderId} - SimRyoko`}
        description="查看订单详细信息"
        canonical={`/account/orders/${id}`}
        noIndex={true}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 返回按钮 */}
        <button
          onClick={() => router.back()}
          className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2"
        >
          ← 返回订单列表
        </button>

        {/* 订单状态卡片 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              订单 {order.orderId}
            </h1>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                order.status
              )}`}
            >
              {getStatusText(order.status)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">下单时间</p>
              <p className="font-medium">
                {new Date(order.createdAt).toLocaleString("zh-CN")}
              </p>
            </div>
            {order.paidAt && (
              <div>
                <p className="text-gray-600">支付时间</p>
                <p className="font-medium">
                  {new Date(order.paidAt).toLocaleString("zh-CN")}
                </p>
              </div>
            )}
            <div>
              <p className="text-gray-600">联系邮箱</p>
              <p className="font-medium">{order.customerEmail}</p>
            </div>
            <div>
              <p className="text-gray-600">订单金额</p>
              <p className="font-bold text-lg text-orange-600">
                ${order.totalAmount.toFixed(2)} {order.currency}
              </p>
            </div>
          </div>
        </div>

        {/* 产品列表 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">订购产品</h2>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">数量：{item.quantity}</p>
                </div>
                <p className="font-medium text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* eSIM 信息 */}
        {order.iccids.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">eSIM 信息</h2>
            <div className="space-y-4">
              {order.iccids.map((iccid, index) => (
                <div key={iccid} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-mono text-sm text-gray-600">
                      ICCID {index + 1}: {iccid}
                    </p>
                    <button
                      onClick={() => checkUsage(iccid)}
                      disabled={usageLoading}
                      className="text-sm text-orange-600 hover:text-orange-700 disabled:opacity-50"
                    >
                      {usageLoading ? "查询中..." : "查询流量"}
                    </button>
                  </div>
                  
                  {/* eSIM 安装步骤 */}
                  <div className="mt-3 text-sm text-gray-600">
                    <p className="font-medium mb-2">安装步骤：</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>设置 → 蜂窝网络 → 添加 eSIM</li>
                      <li>扫描上方 ICCID 对应的二维码（见邮件）</li>
                      <li>开启 eSIM 和数据漫游</li>
                      <li>落地后自动连接当地网络</li>
                    </ol>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex gap-3">
          {order.status === "pending" && (
            <button
              onClick={() => router.push(`/checkout?orderId=${order.id}`)}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              继续支付
            </button>
          )}
          {order.status === "completed" && (
            <button
              onClick={() => router.push(`/account/orders/${id}?action=topup`)}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              续费充值
            </button>
          )}
          <button
            onClick={() => router.push("/products")}
            className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition"
          >
              继续购物
          </button>
        </div>
      </div>
    </Layout>
  );
}
