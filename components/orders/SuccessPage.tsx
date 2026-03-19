'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { CheckCircle, Mail, ShoppingBag, QrCode, AlertCircle } from 'lucide-react';
import { storage, CART_KEY } from '@/lib/utils';
import { useI18n } from '@/lib/i18n-context';

interface SuccessPageProps {
  orderId?: string;
  email?: string;
}

export default function SuccessPage({ orderId: propOrderId, email: propEmail }: SuccessPageProps) {
  const router = useRouter();
  const { t } = useI18n();
  const [orderId, setOrderId] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fetchingDetails, setFetchingDetails] = useState(false);

  useEffect(() => {
    storage.remove(CART_KEY);

    const { orderId: urlOrderId, email: urlEmail, session_id } = router.query;
    
    if (session_id) {
      setFetchingDetails(true);
      fetch(`/api/payment/status?session_id=${session_id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setOrderId(data.orderId || `Stripe-${(session_id as string).slice(-8)}`);
            setEmail(data.email || '');
            setOrderDetails(data);
          } else {
            setOrderId(`Stripe-${(session_id as string).slice(-8)}`);
          }
        })
        .catch(() => {
          setOrderId(`Stripe-${(session_id as string).slice(-8)}`);
        })
        .finally(() => {
          setFetchingDetails(false);
          setLoading(false);
        });
      return;
    }
    
    if (urlOrderId) {
      setOrderId(urlOrderId as string);
    } else if (propOrderId) {
      setOrderId(propOrderId);
    }

    if (urlEmail) {
      setEmail(urlEmail as string);
    } else if (propEmail) {
      setEmail(propEmail);
    }

    setLoading(false);
  }, [router.query, propOrderId, propEmail]);

  if (loading || fetchingDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('success.title')}</h1>
        <p className="text-gray-600 mb-6">{t('success.message')}</p>

        <div className="bg-white rounded-xl p-6 shadow-sm mb-6 text-left">
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">{t('success.order_id')}</p>
            <p className="font-semibold text-gray-900">{orderId || t('common.loading')}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">{t('checkout.email')}</p>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <p className="font-semibold text-gray-900">{email || t('common.error')}</p>
            </div>
          </div>
          <div className="border-t pt-4">
            <p className="text-sm text-gray-500 mb-2 font-medium">{t('product.detail.installation')}</p>
            <ol className="space-y-2 text-sm text-gray-700 text-left">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                <span>{t('help.install.iphone')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                <span>{t('product.detail.installation')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                <span>{t('product.detail.coverage')}</span>
              </li>
            </ol>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
          <div className="flex items-start gap-3">
            <QrCode className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800 font-medium">
                {t('success.email.sent')}
              </p>
              <p className="text-sm text-blue-700 mt-1">
                {t('success.email.check')}
              </p>
            </div>
          </div>
        </div>

        {orderDetails?.paymentStatus === 'paid' && (
          <div className="bg-green-50 rounded-xl p-4 mb-6 text-left">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-green-800 font-medium">
                  {t('checkout.payment.card')}
                </p>
                <p className="text-sm text-green-700 mt-1">
                  {t('success.email.sent')}
                </p>
              </div>
            </div>
          </div>
        )}

        {orderDetails?.paymentStatus === 'unpaid' && (
          <div className="bg-yellow-50 rounded-xl p-4 mb-6 text-left">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-800 font-medium">
                  {t('checkout.processing')}
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  {t('success.email.check')}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Link href="/countries" className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl">
            <ShoppingBag className="w-5 h-5" />
            {t('cart.continue_shopping')}
          </Link>
          <Link href="/" className="block w-full py-3 text-gray-600 hover:text-gray-900">
            {t('success.back_home')}
          </Link>
        </div>
      </div>
    </div>
  );
}
