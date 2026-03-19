import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from "@/components/ui/Layout";
import SEO from "@/components/ui/SEO";

interface Order {
  id: string;
  orderId: string;
  status: string;
  totalAmount: number;
  currency: string;
  customerEmail: string;
  iccids: string[];
  createdAt: string;
  paidAt: string | null;
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // 未登录则跳转登录
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  // 获取订单列表
  useEffect(() => {
    if (status === "authenticated") {
      fetchOrders();
    }
  }, [status]);

  async function fetchOrders() {
    try {
      const res = await fetch("/api/account/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
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

  return (
    <Layout>
      <SEO
        title="我的订单 - SimRyoko"
        description="查看您的 eSIM 订单历史"
        canonical="/account/orders"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">我的订单</h1>
          <p className="mt-2 text-gray-600">
            欢迎，{session?.user?.email} |{" "}
            <button
              onClick={() => signIn("signout")}
              className="text-orange-600 hover:text-orange-700"
            >
              退出登录
            </button>
          </p>
        </div>

        {/* 订单列表 */}
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              暂无订单
            </h3>
            <p className="text-gray-600 mb-6">
              您还没有购买过任何 eSIM 套餐
            </p>
            <button
              onClick={() => router.push("/products")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              浏览产品
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  {/* 订单信息 */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm text-gray-600">
                        {order.orderId}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>下单时间：{new Date(order.createdAt).toLocaleString("zh-CN")}</p>
                      {order.paidAt && (
                        <p>支付时间：{new Date(order.paidAt).toLocaleString("zh-CN")}</p>
                      )}
                      <p>订单邮箱：{order.customerEmail}</p>
                      {order.iccids.length > 0 && (
                        <p className="font-mono text-xs">
                          ICCID: {order.iccids.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 金额和操作 */}
                  <div className="mt-4 md:mt-0 md:text-right">
                    <div className="text-2xl font-bold text-gray-900 mb-3">
                      ${order.totalAmount.toFixed(2)} {order.currency}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => router.push(`/account/orders/${order.id}`)}
                        className="px-4 py-2 text-sm font-medium text-orange-600 hover:text-orange-700 border border-orange-600 rounded-lg hover:bg-orange-50 transition"
                      >
                        查看详情
                      </button>
                      {order.status === "completed" && (
                        <button
                          onClick={() => router.push(`/account/orders/${order.id}?action=topup`)}
                          className="px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition"
                        >
                          续费充值
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
