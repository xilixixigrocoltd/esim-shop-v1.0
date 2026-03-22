'use client';

import { Shield, Clock, Headphones, RefreshCw } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';

export default function TrustBadges() {
  const { t } = useI18n();

  const trustBadges = [
    {
      icon: Shield,
      title: t('home.trust.secure_payment'),
      description: t('home.trust.secure_payment.desc'),
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: Clock,
      title: t('home.trust.instant'),
      description: t('home.trust.instant.desc'),
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Headphones,
      title: t('home.trust.support'),
      description: t('home.trust.support.desc'),
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: RefreshCw,
      title: t('home.trust.refund'),
      description: t('home.trust.refund.desc'),
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <section className="py-12 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustBadges.map((badge) => (
            <div key={badge.title} className="flex flex-col items-center text-center">
              <div className={`w-14 h-14 ${badge.bgColor} rounded-xl flex items-center justify-center mb-3`}>
                <badge.icon className={`w-7 h-7 ${badge.color}`} />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{badge.title}</h3>
              <p className="text-sm text-gray-500">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
