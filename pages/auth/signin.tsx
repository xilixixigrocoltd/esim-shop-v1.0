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
            {/* Google 登录 */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-lg font-medium transition mb-6"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              使用 Google 账号登录
            </button>

            {/* 分割线 */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">或</span>
              </div>
            </div>

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
