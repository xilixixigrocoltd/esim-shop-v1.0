'use client';
import { useState, useEffect } from 'react';

/**
 * PWA 安装提示组件
 * 
 * 功能：
 * - 检测 PWA 可安装状态
 * - 显示安装提示横幅
 * - 引导用户添加到主屏幕
 * - 支持 iOS 和 Android
 */
export default function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'unknown'>('unknown');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // 检查是否已Dismiss
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) return;

    // 检测平台
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform('ios');
    } else if (/android/.test(userAgent)) {
      setPlatform('android');
    }

    // Android Chrome 安装事件
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as any);
      
      // 延迟显示提示（避免打扰用户）
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 监听自定义安装事件（从 _app.tsx 触发）
    const handlePWAInstallAvailable = () => {
      setShowPrompt(true);
    };

    window.addEventListener('pwa-install-available', handlePWAInstallAvailable);

    // 已安装事件
    const handleAppInstalled = () => {
      setShowPrompt(false);
      localStorage.setItem('pwa-install-dismissed', 'true');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('pwa-install-available', handlePWAInstallAvailable);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
      localStorage.setItem('pwa-install-dismissed', 'true');
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">
            {platform === 'ios' ? '📱 添加到主屏幕' : '📱 安装 SimRyoko App'}
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            {platform === 'ios' ? (
              <>
                在 Safari 中，点击 <strong>分享</strong> 按钮，然后选择 <strong>添加到主屏幕</strong>
              </>
            ) : (
              <>
                点击下方按钮，将 SimRyoko 添加到您的主屏幕，享受更好的体验！
              </>
            )}
          </p>

          {platform === 'ios' && (
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-2 rounded">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span>点击右上角分享图标 → 添加到主屏幕</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {platform === 'android' && deferredPrompt && (
            <button
              onClick={handleInstall}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              安装
            </button>
          )}

          <button
            onClick={handleDismiss}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="关闭"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
