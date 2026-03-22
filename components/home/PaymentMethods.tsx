'use client';

import { CreditCard, Smartphone, Apple, Wallet } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';

export default function PaymentMethods() {
  const { t } = useI18n();

  const paymentMethods = [
    {
      icon: CreditCard,
      name: t('home.payment.card'),
      description: t('home.payment.card.desc'),
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Apple,
      name: "Apple Pay",
      description: t('home.payment.apple_pay.desc'),
      color: "from-gray-700 to-gray-900"
    },
    {
      icon: Smartphone,
      name: "Google Pay",
      description: t('home.payment.google_pay.desc'),
      color: "from-blue-600 to-blue-700"
    },
    {
      icon: Wallet,
      name: t('home.payment.alipay'),
      description: t('home.payment.alipay.desc'),
      color: "from-blue-400 to-blue-500"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('home.payment.title')}</h2>
          <p className="text-gray-600">{t('home.payment.subtitle')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {paymentMethods.map((method) => (
            <div key={method.name} className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all">
              <div className={`w-14 h-14 bg-gradient-to-br ${method.color} rounded-xl flex items-center justify-center mb-4`}>
                <method.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{method.name}</h3>
              <p className="text-sm text-gray-500">{method.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            {t('home.payment.secure_note')}
          </p>
        </div>
      </div>
    </section>
  );
}
