import Head from 'next/head';

export default function OfflinePage() {
  return (
    <>
      <Head>
        <title>离线 - SimRyoko eSIM</title>
        <meta name="description" content="您已离线，请检查网络连接" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center">
          {/* 离线图标 */}
          <div className="mb-8">
            <svg
              className="mx-auto h-24 w-24 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
              />
            </svg>
          </div>

          {/* 标题 */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            您已离线
          </h1>

          {/* 描述 */}
          <p className="text-gray-600 mb-8">
            请检查您的网络连接，然后刷新页面重试。
          </p>

          {/* 提示 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-blue-800">
              💡 <strong>提示：</strong>部分页面已缓存，您可以尝试访问已浏览过的内容。
            </p>
          </div>

          {/* 操作按钮 */}
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              刷新页面
            </button>

            <a
              href="/"
              className="w-full inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              返回首页
            </a>
          </div>

          {/* 网络状态提示 */}
          <div className="mt-8 text-sm text-gray-500">
            <p>网络状态：<span id="network-status" className="font-medium">检查中...</span></p>
          </div>
        </div>
      </div>

      {/* 网络状态检测脚本 */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            function updateNetworkStatus() {
              const statusEl = document.getElementById('network-status');
              if (navigator.onLine) {
                statusEl.textContent = '已连接 ✅';
                statusEl.className = 'font-medium text-green-600';
                // 自动刷新（可选）
                // setTimeout(() => window.location.reload(), 2000);
              } else {
                statusEl.textContent = '已断开 ❌';
                statusEl.className = 'font-medium text-red-600';
              }
            }

            window.addEventListener('online', updateNetworkStatus);
            window.addEventListener('offline', updateNetworkStatus);
            updateNetworkStatus();
          `,
        }}
      />
    </>
  );
}
