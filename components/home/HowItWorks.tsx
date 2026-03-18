'use client';

import { Smartphone, QrCode, Wifi, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    icon: Smartphone,
    title: "确认设备支持",
    description: "确保您的手机支持 eSIM 功能（iPhone XR 及以上、部分安卓旗舰）",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: QrCode,
    title: "扫码安装",
    description: "收到邮件后，扫描二维码或手动输入激活码完成安装",
    color: "from-green-500 to-green-600"
  },
  {
    icon: Wifi,
    title: "激活使用",
    description: "到达目的地后开启 eSIM，自动连接当地网络",
    color: "from-orange-500 to-orange-600"
  }
];

export default function HowItWorks() {
  return (
    <section className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">如何使用 eSIM</h2>
          <p className="text-gray-300">简单三步，轻松连接全球网络</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-2/3 w-1/3 h-0.5 bg-gradient-to-r from-gray-600 to-transparent" />
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link 
            href="/help" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            <CheckCircle className="w-5 h-5" />
            查看详细安装教程
          </Link>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          <p>支持设备：iPhone XR/XS 及以上 • iPad Pro/Air • 部分安卓旗舰手机</p>
        </div>
      </div>
    </section>
  );
}
