'use client';

import { HelpCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: "什么是 eSIM？",
    answer: "eSIM 是嵌入式 SIM 卡，无需实体卡片，通过扫描二维码即可激活。您的手机必须支持 eSIM 功能才能使用。"
  },
  {
    question: "如何确认我的手机支持 eSIM？",
    answer: "iPhone XR/XS 及以上型号全部支持。安卓手机请查看设置中是否有「添加 eSIM」或「添加移动套餐」选项。常见支持机型：三星 S20 及以上、Google Pixel 3 及以上、华为 P40 Pro 等。"
  },
  {
    question: "购买后如何收到 eSIM？",
    answer: "支付成功后，eSIM 二维码和激活说明会立即发送到您提供的邮箱。同时也可以在订单页面查看。"
  },
  {
    question: "eSIM 如何安装？",
    answer: "收到邮件后，打开手机相机扫描二维码，或手动输入激活码。详细教程请查看帮助中心。"
  },
  {
    question: "到达目的地后如何使用？",
    answer: "到达后在手机设置中开启 eSIM，启用「数据漫游」。手机会自动连接当地合作网络，无需其他操作。"
  },
  {
    question: "可以退款吗？",
    answer: "eSIM 未激活前可全额退款。一旦扫描二维码或手动激活，将无法退款。"
  },
  {
    question: "流量用完后可以充值吗？",
    answer: "部分套餐支持充值，请在产品页面查看具体说明。不支持充值的套餐可重新购买新套餐。"
  },
  {
    question: "如何联系客服？",
    answer: "点击网站右下角的 Telegram 图标，或发送邮件至 xilixi@xigrocoltd.com，我们会在 24 小时内回复。"
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">常见问题</h2>
          <p className="text-gray-600">快速找到您想知道的答案</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${openIndex === index ? 'rotate-180' : ''}`}
                />
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-600">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">没有找到答案？</p>
          <a 
            href="https://t.me/Simryokoesimbot" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
            联系在线客服
          </a>
        </div>
      </div>
    </section>
  );
}
