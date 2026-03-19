import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/ui/Layout";
import SEO from "@/components/ui/SEO";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await signIn("email", {
        email,
        redirect: false,
        callbackUrl: "/account/orders",
      });
      setMessage("✅ 登录链接已发送到您的邮箱，请查收！");
    } catch (error) {
      setMessage("❌ 发送失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    await signIn("google", { callbackUrl: "/account/orders" });
  }

  return (
    <Layout>
      <SEO
        title="登录 - SimRyoko"
        description="登录您的 SimRyoko 账户"
        canonical="/auth/signin"
        noIndex={true}
      />

      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* 标题 */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">登录 SimRyoko</h1>
            <p className="mt-2 text-gray-600">
              查看订单、流量使用和续费充值
            </p>
          </div>

          {/* 登录表单 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            {/* 邮箱登录 */}
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  邮箱地址
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="your@email.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-4 py-3 rounded-lg font-medium transition"
              >
                {loading ? "发送中..." : "发送登录链接"}
              </button>
            </form>

            {/* 提示信息 */}
            {message && (
              <div className={`mt-4 p-3 rounded-lg text-sm ${
                message.startsWith("✅") 
                  ? "bg-green-50 text-green-800" 
                  : "bg-red-50 text-red-800"
              }`}>
                {message}
              </div>
            )}

            {/* 说明 */}
            <p className="mt-6 text-xs text-gray-500 text-center">
              使用邮箱登录会收到一封包含魔法链接的邮件，点击即可登录，无需密码。
            </p>
          </div>

          {/* 返回 */}
          <button
            onClick={() => router.back()}
            className="w-full text-gray-600 hover:text-gray-900 text-sm"
          >
            ← 返回上一页
          </button>
        </div>
      </div>
    </Layout>
  );
}
