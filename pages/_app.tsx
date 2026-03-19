import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';
import { I18nProvider } from '@/lib/i18n-context';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import Layout from '@/components/ui/Layout';
import { SessionProvider } from 'next-auth/react';
import '@/styles/globals.css';

// PWA Service Worker 注册
function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.log('✅ Service Worker 注册成功:', registration.scope);
        })
        .catch((error) => {
          console.error('❌ Service Worker 注册失败:', error);
        });
    });
  }
}

// PWA 安装提示
function setupPWAInstallPrompt() {
  if (typeof window === 'undefined') return;

  let deferredPrompt: any = null;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('💡 PWA 可安装');

    // 显示安装提示（可选）
    setTimeout(() => {
      const shouldShowPrompt = !localStorage.getItem('pwa-install-dismissed');
      if (shouldShowPrompt) {
        // 触发自定义事件，让组件显示安装提示
        window.dispatchEvent(new CustomEvent('pwa-install-available'));
      }
    }, 3000);
  });

  window.addEventListener('appinstalled', () => {
    console.log('✅ PWA 已安装');
    deferredPrompt = null;
    localStorage.setItem('pwa-install-dismissed', 'true');
  });

  // 提供手动安装方法
  (window as any).installPWA = async () => {
    if (!deferredPrompt) {
      console.log('⚠️ 安装提示不可用');
      return false;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('用户选择：', outcome);

    if (outcome === 'accepted') {
      console.log('✅ 用户接受安装');
    }

    deferredPrompt = null;
    return outcome === 'accepted';
  };

  // 提供关闭提示方法
  (window as any).dismissPWAInstall = () => {
    localStorage.setItem('pwa-install-dismissed', 'true');
  };
}

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    registerServiceWorker();
    setupPWAInstallPrompt();
  }, []);

  return (
    <SessionProvider session={pageProps.session}>
      <I18nProvider>
        <Head>
          <title>SimRyoko - 全球 eSIM，即时连接</title>
          <meta name="description" content="覆盖 150+ 国家的 eSIM 服务，即买即用，无需实体 SIM 卡" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#2563eb" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="SimRyoko" />
          <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        </Head>
        <GoogleAnalytics />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </I18nProvider>
    </SessionProvider>
  );
}
