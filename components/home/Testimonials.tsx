'use client';

import { Star, MessageCircle } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';

export default function Testimonials() {
  const { t } = useI18n();

  const testimonials = [
    {
      id: 1,
      name: t('home.testimonials.user1.name'),
      location: t('home.testimonials.user1.location'),
      rating: 5,
      content: t('home.testimonials.user1.content'),
      avatar: "👨‍💼"
    },
    {
      id: 2,
      name: t('home.testimonials.user2.name'),
      location: t('home.testimonials.user2.location'),
      rating: 5,
      content: t('home.testimonials.user2.content'),
      avatar: "👩‍💼"
    },
    {
      id: 3,
      name: t('home.testimonials.user3.name'),
      location: t('home.testimonials.user3.location'),
      rating: 5,
      content: t('home.testimonials.user3.content'),
      avatar: "👨‍🔧"
    },
    {
      id: 4,
      name: t('home.testimonials.user4.name'),
      location: t('home.testimonials.user4.location'),
      rating: 5,
      content: t('home.testimonials.user4.content'),
      avatar: "👩‍🎓"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('home.testimonials.title')}</h2>
          <p className="text-gray-600">{t('home.testimonials.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <p className="text-gray-700 mb-4 line-clamp-4">"{testimonial.content}"</p>
              
              <div className="flex items-center gap-3">
                <span className="text-3xl">{testimonial.avatar}</span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
                  <p className="text-xs text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a 
            href="https://t.me/Simryokoesimbot" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700"
          >
            <MessageCircle className="w-5 h-5" />
            {t('home.testimonials.view_more')}
          </a>
        </div>
      </div>
    </section>
  );
}
