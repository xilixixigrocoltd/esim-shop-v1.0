import { useRouter } from 'next/router';
import { Home, ArrowLeft, HelpCircle } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';
import SEO from '@/components/ui/SEO';

export default function NotFound() {
  const router = useRouter();
  const { t } = useI18n();

  return (
    <>
      <SEO
        title="404 - 页面未找到 | SimRyoko"
        description="抱歉，您访问的页面不存在"
        noIndex={true}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          {/* 404 图标 */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-white rounded-full shadow-lg">
              <HelpCircle className="w-16 h-16 text-blue-500" />
            </div>
          </div>

          {/* 标题 */}
          <h1 className="text-6xl font-bold text-slate-800 mb-4">
            404
          </h1>
          <p className="text-xl text-slate-600 mb-2">
            {t('error.pageNotFound.title')}
          </p>
          <p className="text-slate-500 mb-8">
            {t('error.pageNotFound.description')}
          </p>

          {/* 可能原因 */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
            <p className="text-sm text-slate-600 font-medium mb-2">
              {t('error.pageNotFound.possibleReasons')}
            </p>
            <ul className="text-sm text-slate-500 text-left space-y-1">
              <li>• {t('error.pageNotFound.reason1')}</li>
              <li>• {t('error.pageNotFound.reason2')}</li>
              <li>• {t('error.pageNotFound.reason3')}</li>
            </ul>
          </div>

          {/* 操作按钮 */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center px-6 py-3 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('error.pageNotFound.goBack')}
            </button>
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Home className="w-4 h-4 mr-2" />
              {t('error.pageNotFound.goHome')}
            </button>
          </div>

          {/* 帮助链接 */}
          <div className="mt-8">
            <p className="text-sm text-slate-500 mb-3">
              {t('error.pageNotFound.needHelp')}
            </p>
            <div className="flex gap-4 justify-center text-sm">
              <a
                href="/help"
                className="text-blue-600 hover:text-blue-700 hover:underline"
              >
                {t('nav.help')}
              </a>
              <span className="text-slate-300">|</span>
              <a
                href="/products"
                className="text-blue-600 hover:text-blue-700 hover:underline"
              >
                {t('nav.products')}
              </a>
              <span className="text-slate-300">|</span>
              <a
                href="/blog"
                className="text-blue-600 hover:text-blue-700 hover:underline"
              >
                {t('nav.blog') || '博客'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
