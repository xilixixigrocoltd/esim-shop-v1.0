import type { AppProps } from 'next/app';
import Head from 'next/head';
import Layout from '@/components/ui/Layout';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>SimRyoko - 全球eSIM，即时连接</title>
        <meta name="description" content="覆盖150+国家的eSIM服务，即买即用，无需实体SIM卡" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
