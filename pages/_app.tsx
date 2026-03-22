import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';
import { I18nProvider } from '@/lib/i18n-context';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import Layout from '@/components/ui/Layout';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {});
      });
    }
  }, []);

  return (
    <I18nProvider>
      <Head>
        <title>SimRyoko - 全球 eSIM，即时连接</title>
        <meta name="description" content="覆盖 150+ 国家的 eSIM 服务，即买即用，无需实体 SIM 卡" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f97316" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="SimRyoko" />
      </Head>
      <GoogleAnalytics />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </I18nProvider>
  );
}
