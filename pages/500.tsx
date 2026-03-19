import { useRouter } from 'next/router';
import { Home, RefreshCw, Mail } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';
import SEO from '@/components/ui/SEO';

export default function ServerError() {
  const router = useRouter();
  const { t } = useI18n();

  const handleRetry = () => {
    router.reload();
  };

  return (
    <>
      <SEO
        title="500 - 服务器错误 | SimRyoko"
        description="抱歉，服务器遇到了一些问题"
        noIndex={true}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          {/* 错误图标 */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-white rounded-full shadow-lg">
              <svg
                className="w-16 h-16 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          {/* 标题 */}
          <h1 className="text-6xl font-bold text-slate-800 mb-4">
            500
          </h1>
          <p className="text-xl text-slate-600 mb-2">
            {t('error.serverError.title') || '服务器错误'}
          </p>
          <p className="text-slate-500 mb-8">
            {t('error.serverError.description') || '抱歉，服务器遇到了一些问题，请稍后重试'}
          </p>

          {/* 错误信息 */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
            <p className="text-sm text-slate-600 font-medium mb-2">
              {t('error.serverError.whatHappened') || '发生了什么？'}
            </p>
            <p className="text-sm text-slate-500 text-left">
              {t('error.serverError.explanation') || '我们的服务器暂时无法处理您的请求。这可能是由于：'}
            </p>
            <ul className="text-sm text-slate-500 text-left space-y-1 mt-2">
              <li>• {t('error.serverError.reason1') || '服务器临时维护'}</li>
              <li>• {t('error.serverError.reason2') || '访问量过大'}</li>
              <li>• {t('error.serverError.reason3') || '技术故障'}</li>
            </ul>
          </div>

          {/* 操作按钮 */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <button
              onClick={handleRetry}
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {t('error.serverError.retry') || '重试'}
            </button>
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center justify-center px-6 py-3 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Home className="w-4 h-4 mr-2" />
              {t('error.serverError.goHome') || '返回首页'}
            </button>
          </div>

          {/* 联系支持 */}
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-slate-600 mb-3">
              {t('error.serverError.stillNeedHelp') || '仍然需要帮助？'}
            </p>
            <a
              href="mailto:support@simryoko.com"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              <Mail className="w-4 h-4 mr-2" />
              support@simryoko.com
            </a>
            <p className="text-xs text-slate-500 mt-2">
              {t('error.serverError.responseTime') || '我们通常会在 24 小时内回复'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
