import type { AppProps } from 'next/app';
import Head from 'next/head';
import { I18nProvider } from '@/lib/i18n-context';
import Layout from '@/components/ui/Layout';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <I18nProvider>
      <Head>
        <title>SimRyoko - 全球 eSIM，即时连接</title>
        <meta name="description" content="覆盖 150+ 国家的 eSIM 服务，即买即用，无需实体 SIM 卡" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </I18nProvider>
  );
}
