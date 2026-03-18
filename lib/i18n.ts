// 多语言翻译文件
export type Locale = 'zh' | 'en';

export const translations = {
  zh: {
    // 导航
    'nav.home': '首页',
    'nav.products': '全部产品',
    'nav.countries': '国家',
    'nav.help': '帮助',
    'nav.cart': '购物车',
    
    // 首页 Hero
    'home.hero.title': '全球 eSIM，即时连接',
    'home.hero.subtitle': '覆盖 150+ 国家的 eSIM 服务，即买即用，无需实体 SIM 卡',
    'home.hero.cta': '立即选购',
    'home.hero.instant': '即买即用，无需等待',
    'home.hero.search_placeholder': '搜索国家或地区...',
    'home.hero.learn_more': '了解更多',
    'home.hero.popular': '热门目的地',
    
    // 首页特性
    'home.features.countries': '150+ 国家',
    'home.features.global': '全球覆盖',
    'home.features.instant': '即时送达',
    'home.features.delivery': '邮件秒发',
    'home.features.refund': '7 天退款',
    'home.features.unused': '未激活可退',
    
    // 产品
    'product.data': '数据流量',
    'product.validity': '有效期',
    'product.countries': '覆盖国家',
    'product.add_to_cart': '加入购物车',
    'product.buy_now': '立即购买',
    
    // 购物车
    'cart.title': '购物车',
    'cart.empty': '购物车是空的',
    'cart.continue_shopping': '继续购物',
    'cart.checkout': '去结账',
    'cart.total': '总计',
    'cart.remove': '移除',
    
    // 结账
    'checkout.title': '结账',
    'checkout.email': '邮箱地址',
    'checkout.email.placeholder': '用于接收 eSIM 二维码',
    'checkout.order_summary': '订单摘要',
    'checkout.pay': '立即支付',
    
    // 成功页
    'success.title': '支付成功！',
    'success.message': 'eSIM 信息已发送到您的邮箱',
    'success.check_email': '请检查邮箱（包括垃圾邮件箱）',
    
    // 帮助
    'help.title': '帮助中心',
    'help.how_to_install': '如何安装 eSIM',
    'help.contact': '联系我们',
    
    // 通用
    'common.loading': '加载中...',
    'common.error': '出错了',
    'common.retry': '重试',
    'common.close': '关闭',
    'common.search': '搜索',
    'common.currency': '美元',
    
    // 语言切换
    'lang.zh': '中文',
    'lang.en': 'English',
    'lang.switch': '切换语言',
  },
  en: {
    // 导航
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.countries': 'Countries',
    'nav.help': 'Help',
    'nav.cart': 'Cart',
    
    // 首页 Hero
    'home.hero.title': 'Global eSIM, Instant Connection',
    'home.hero.subtitle': 'eSIM service covering 150+ countries, ready to use without physical SIM',
    'home.hero.cta': 'Shop Now',
    'home.hero.instant': 'Ready to Use, No Wait',
    'home.hero.search_placeholder': 'Search countries or regions...',
    'home.hero.learn_more': 'Learn More',
    'home.hero.popular': 'Popular Destinations',
    
    // 首页特性
    'home.features.countries': '150+ Countries',
    'home.features.global': 'Global Coverage',
    'home.features.instant': 'Instant Delivery',
    'home.features.delivery': 'Email in Seconds',
    'home.features.refund': '7-Day Refund',
    'home.features.unused': 'Unused & Refundable',
    
    // 产品
    'product.data': 'Data',
    'product.validity': 'Validity',
    'product.countries': 'Countries',
    'product.add_to_cart': 'Add to Cart',
    'product.buy_now': 'Buy Now',
    
    // 购物车
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.continue_shopping': 'Continue Shopping',
    'cart.checkout': 'Checkout',
    'cart.total': 'Total',
    'cart.remove': 'Remove',
    
    // 结账
    'checkout.title': 'Checkout',
    'checkout.email': 'Email Address',
    'checkout.email.placeholder': 'For receiving eSIM QR code',
    'checkout.order_summary': 'Order Summary',
    'checkout.pay': 'Pay Now',
    
    // 成功页
    'success.title': 'Payment Successful!',
    'success.message': 'eSIM details have been sent to your email',
    'success.check_email': 'Please check your email (including spam folder)',
    
    // 帮助
    'help.title': 'Help Center',
    'help.how_to_install': 'How to Install eSIM',
    'help.contact': 'Contact Us',
    
    // 通用
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.retry': 'Retry',
    'common.close': 'Close',
    'common.search': 'Search',
    'common.currency': 'USD',
    
    // 语言切换
    'lang.zh': '中文',
    'lang.en': 'English',
    'lang.switch': 'Switch Language',
  },
};

export const defaultLocale: Locale = 'zh';
