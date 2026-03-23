import type { AppProps } from 'next/app'
import React from 'react'
import { I18nProvider } from '../lib/i18n-context'
import Layout from '../components/Layout'
import '../styles/globals.css'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">页面出现错误</h1>
            <p className="text-gray-600 mb-6">抱歉，页面加载时遇到了问题，请刷新重试。</p>
            <button
              onClick={() => { this.setState({ hasError: false }); window.location.reload() }}
              className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition"
            >
              刷新页面
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <I18nProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </I18nProvider>
    </ErrorBoundary>
  )
}
