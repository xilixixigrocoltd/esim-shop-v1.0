'use client';

import { Star, MessageCircle } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "张先生",
    location: "北京 → 日本",
    rating: 5,
    content: "太方便了！下飞机就有网络，不用换卡，扫码就能用。价格也比机场买便宜多了。",
    avatar: "👨‍💼"
  },
  {
    id: 2,
    name: "李女士",
    location: "上海 → 欧洲",
    rating: 5,
    content: "欧洲 15 国通用，一个套餐搞定整个行程。客服响应也很快，有问题马上解决。",
    avatar: "👩‍💼"
  },
  {
    id: 3,
    name: "王先生",
    location: "深圳 → 泰国",
    rating: 5,
    content: "第三次购买了，每次出国都用 SimRyoko。信号稳定，速度也快，强烈推荐！",
    avatar: "👨‍🔧"
  },
  {
    id: 4,
    name: "陈女士",
    location: "广州 → 美国",
    rating: 5,
    content: "第一次用 eSIM 有点担心，但安装很简单，客服很耐心指导。美国信号满格！",
    avatar: "👩‍🎓"
  }
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">用户评价</h2>
          <p className="text-gray-600">听听使用过 SimRyoko 的用户怎么说</p>
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
            在 Telegram 查看更多评价
          </a>
        </div>
      </div>
    </section>
  );
}
