'use client';

import { HelpCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';

export default function FAQ() {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: t('faq.what_is_esim.q'), a: t('faq.what_is_esim.a') },
    { q: t('faq.check_compatibility.q'), a: t('faq.check_compatibility.a') },
    { q: t('faq.delivery.q'), a: t('faq.delivery.a') },
    { q: t('faq.installation.q'), a: t('faq.installation.a') },
    { q: t('faq.usage.q'), a: t('faq.usage.a') },
    { q: t('faq.refund.q'), a: t('faq.refund.a') },
    { q: t('faq.topup.q'), a: t('faq.topup.a') },
    { q: t('faq.contact.q'), a: t('faq.contact.a') },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('home.faq.title')}</h2>
          <p className="text-gray-600">{t('home.faq.subtitle')}</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${openIndex === index ? 'rotate-180' : ''}`}
                />
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-600">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">{t('faq.contact_us')}</p>
          <a 
            href="https://t.me/Simryokoesimbot" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
            {t('faq.contact_support')}
          </a>
        </div>
      </div>
    </section>
  );
}
