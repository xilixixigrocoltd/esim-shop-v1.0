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
    
    // 首页 - 套餐类型
    'home.types.title': '选择适合您的套餐',
    'home.types.subtitle': '根据您的出行需求，选择本地、区域或全球套餐',
    'home.types.local': '本地套餐',
    'home.types.local.desc': '单个国家使用，价格实惠',
    'home.types.regional': '区域套餐',
    'home.types.regional.desc': '多国通用，畅游整个区域',
    'home.types.global': '全球套餐',
    'home.types.global.desc': '全球通用，商务出行首选',
    'home.types.view_all': '查看全部',
    
    // 首页 - 热门目的地
    'home.popular.title': '热门目的地',
    'home.popular.view_all': '查看全部',
    'home.popular.products': '款产品',
    
    // 首页 - 使用步骤
    'home.how_it_works.title': '如何使用',
    'home.how_it_works.step1.title': '选择套餐',
    'home.how_it_works.step1.desc': '浏览并选择适合您的 eSIM 套餐',
    'home.how_it_works.step2.title': '安全支付',
    'home.how_it_works.step2.desc': '使用信用卡或支付宝安全支付',
    'home.how_it_works.step3.title': '接收二维码',
    'home.how_it_works.step3.desc': 'eSIM 二维码即时发送到邮箱',
    'home.how_it_works.step4.title': '扫码安装',
    'home.how_it_works.step4.desc': '扫描二维码，完成安装',
    
    // 首页 - 用户评价
    'home.testimonials.title': '用户评价',
    'home.testimonials.subtitle': '听听使用过 SimRyoko 的用户怎么说',
    'home.testimonials.user1.name': '张先生',
    'home.testimonials.user1.location': '北京 → 日本',
    'home.testimonials.user1.content': '太方便了！下飞机就有网络，不用换卡，扫码就能用。价格也比机场买便宜多了。',
    'home.testimonials.user2.name': '李女士',
    'home.testimonials.user2.location': '上海 → 欧洲',
    'home.testimonials.user2.content': '欧洲 15 国通用，一个套餐搞定整个行程。客服响应也很快，有问题马上解决。',
    'home.testimonials.user3.name': '王先生',
    'home.testimonials.user3.location': '深圳 → 泰国',
    'home.testimonials.user3.content': '第三次购买了，每次出国都用 SimRyoko。信号稳定，速度也快，强烈推荐！',
    'home.testimonials.user4.name': '陈女士',
    'home.testimonials.user4.location': '广州 → 美国',
    'home.testimonials.user4.content': '第一次用 eSIM 有点担心，但安装很简单，客服很耐心指导。美国信号满格！',
    'home.testimonials.view_more': '在 Telegram 查看更多评价',
    
    // 首页 - 使用步骤补充
    'home.how_it_works.subtitle': '简单三步，轻松连接全球网络',
    'home.how_it_works.view_tutorial': '查看详细安装教程',
    'home.how_it_works.devices': '支持设备：iPhone XR/XS 及以上 • iPad Pro/Air • 部分安卓旗舰手机',
    
    // 首页 - 支付方式
    'home.payment.title': '支付方式',
    'home.payment.subtitle': '支持多种安全支付方式',
    
    // 首页 - 信任标识
    'home.trust.title': '值得信赖',
    
    // 首页 - FAQ
    'home.faq.title': '常见问题',
    
    // 产品列表页
    'products.all': '全部',
    'products.popular': '热门国家',
    'products.regional': '区域',
    'products.global': '全球',
    'products.select_country': '选择目的地国家/地区',
    'products.select_region': '选择大洲区域',
    'products.select_type': '选择套餐类型',
    'products.back': '返回',
    'products.loading': '加载中...',
    'products.count': '共 {count} 款产品',
    'products.no_products': '该分类下暂无产品',
    'products.type.data_only': '纯数据',
    'products.type.data_voice_sms': '数据 + 语音 + 短信',
    'products.type.data_only.desc': '仅流量，无语音短信',
    'products.type.data_voice_sms.desc': '全功能套餐',
    
    // 产品卡片
    'product.data': '数据流量',
    'product.validity': '有效期',
    'product.countries': '覆盖国家',
    'product.add_to_cart': '加入购物车',
    'product.buy_now': '立即购买',
    'product.days': '{days} 天',
    'product.unlimited': '无限流量',
    'product.data_gb': '{gb}GB',
    'product.data_mb': '{mb}MB',
    
    // 购物车
    'cart.title': '购物车',
    'cart.empty': '购物车是空的',
    'cart.continue_shopping': '继续购物',
    'cart.checkout': '去结账',
    'cart.total': '总计',
    'cart.remove': '移除',
    'cart.quantity': '数量',
    
    // 结账
    'checkout.title': '结账',
    'checkout.email': '邮箱地址',
    'checkout.email.placeholder': '用于接收 eSIM 二维码',
    'checkout.order_summary': '订单摘要',
    'checkout.pay': '立即支付',
    'checkout.security': '安全支付，请放心',
    
    // 成功页
    'success.title': '支付成功！',
    'success.message': 'eSIM 信息已发送到您的邮箱',
    'success.check_email': '请检查邮箱（包括垃圾邮件箱）',
    'success.order_id': '订单号',
    'success.back_home': '返回首页',
    
    // 帮助页
    'help.title': '帮助中心',
    'help.how_to_install': '如何安装 eSIM',
    'help.contact': '联系我们',
    'help.iphone': 'iPhone 用户',
    'help.android': 'Android 用户',
    'help.step': '步骤 {step}',
    
    // 国家列表页
    'countries.title': '所有国家/地区',
    'countries.search': '搜索国家...',
    'countries.count': '{count} 个国家/地区',
    
    // 通用
    'common.loading': '加载中...',
    'common.error': '出错了',
    'common.retry': '重试',
    'common.close': '关闭',
    'common.search': '搜索',
    'common.currency': '美元',
    'common.view_all': '查看全部',
    'common.learn_more': '了解更多',
    
    // 语言切换
    'lang.zh': '中文',
    'lang.en': 'English',
    'lang.switch': '切换语言',
    
    // 产品详情页
    'product.detail.title': '产品详情',
    'product.detail.data': '数据流量',
    'product.detail.validity': '有效期',
    'product.detail.price': '价格',
    'product.detail.coverage': '覆盖国家',
    'product.detail.network': '网络运营商',
    'product.detail.features': '套餐特点',
    'product.detail.description': '套餐说明',
    'product.detail.installation': '安装说明',
    'product.detail.terms': '购买须知',
    'product.detail.warning.china': '⚠️ 重要提示：中国国行手机无法使用',
    'product.detail.warning.china.desc': '中国大陆版本 iPhone 为实体双卡，不支持 eSIM 功能。',
    'product.detail.warning.china.note': '请确认您的设备支持 eSIM 后再购买，非国行设备（如港版、美版、日版等）可正常使用。',
    'product.detail.terms.item1': '即买即用，邮件秒发 eSIM 二维码',
    'product.detail.terms.item2': '支持热点共享',
    'product.detail.terms.item3': '无需实名认证',
    'product.detail.terms.item4': '7 天未激活可退款',
    'product.detail.terms.item5': '请确保设备支持 eSIM 功能',
    'product.detail.add_to_cart': '加入购物车',
    'product.detail.buy_now': '立即购买',
    'product.detail.back': '返回',
    
    // 购物车页
    'cart.item': '商品',
    'cart.items': '商品',
    'cart.empty.title': '购物车是空的',
    'cart.empty.desc': '快去挑选心仪的 eSIM 套餐吧',
    'cart.continue_shopping': '继续购物',
    'cart.checkout': '去结账',
    'cart.remove': '移除',
    'cart.quantity': '数量',
    'cart.total': '总计',
    
    // 结算页
    'checkout.contact': '联系邮箱',
    'checkout.payment_method': '支付方式',
    'checkout.payment.card': '信用卡/借记卡',
    'checkout.payment.card.desc': '支持 Visa, MasterCard',
    'checkout.payment.usdt': 'USDT',
    'checkout.payment.usdt.desc': 'TRC-20 网络',
    'checkout.agree': '我已阅读并同意',
    'checkout.terms': '购买须知',
    'checkout.confirm_device': '，确认我的设备支持 eSIM 功能',
    'checkout.processing': '处理中...',
    'checkout.confirm_pay': '确认支付',
    
    // 成功页
    'success.email.sent': 'eSIM 信息已发送到您的邮箱',
    'success.email.check': '请检查邮箱（包括垃圾邮件箱）',
    'success.email.resend': '未收到邮件？',
    'success.email.contact': '联系客服',
    'success.order.details': '订单详情',
    'success.back_home': '返回首页',
    
    // 帮助页
    'help.subtitle': '如有其他问题，请随时联系我们',
    'help.install.title': '如何安装 eSIM',
    'help.install.iphone': 'iPhone 用户',
    'help.install.android': 'Android 用户',
    'help.install.step': '步骤 {step}',
    'help.contact.title': '联系我们',
    'help.contact.desc': '如有任何问题，请通过以下方式联系我们',
    'help.contact.email': '邮箱',
    'help.contact.telegram': 'Telegram',
    
    // 国家列表页
    'countries.all': '全部',
    'countries.popular': '热门',
    'countries.search_placeholder': '搜索国家...',
    'countries.no_results': '未找到匹配的国家',
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
    
    // 首页 - 套餐类型
    'home.types.title': 'Choose Your Plan',
    'home.types.subtitle': 'Select local, regional, or global plan based on your needs',
    'home.types.local': 'Local Plan',
    'home.types.local.desc': 'Single country, budget-friendly',
    'home.types.regional': 'Regional Plan',
    'home.types.regional.desc': 'Multiple countries, seamless roaming',
    'home.types.global': 'Global Plan',
    'home.types.global.desc': 'Worldwide coverage, business travel',
    'home.types.view_all': 'View All',
    
    // 首页 - 热门目的地
    'home.popular.title': 'Popular Destinations',
    'home.popular.view_all': 'View All',
    'home.popular.products': 'products',
    
    // 首页 - 使用步骤
    'home.how_it_works.title': 'How It Works',
    'home.how_it_works.step1.title': 'Choose Plan',
    'home.how_it_works.step1.desc': 'Browse and select your eSIM plan',
    'home.how_it_works.step2.title': 'Secure Payment',
    'home.how_it_works.step2.desc': 'Pay with card or Alipay',
    'home.how_it_works.step3.title': 'Get QR Code',
    'home.how_it_works.step3.desc': 'eSIM QR sent to email instantly',
    'home.how_it_works.step4.title': 'Scan & Install',
    'home.how_it_works.step4.desc': 'Scan QR code to install',
    
    // 首页 - 用户评价
    'home.testimonials.title': 'Customer Reviews',
    'home.testimonials.subtitle': 'See what SimRyoko users say',
    'home.testimonials.user1.name': 'Mr. Zhang',
    'home.testimonials.user1.location': 'Beijing → Japan',
    'home.testimonials.user1.content': 'So convenient! Had internet as soon as I landed, no SIM swap needed, just scan and go. Much cheaper than buying at the airport.',
    'home.testimonials.user2.name': 'Ms. Li',
    'home.testimonials.user2.location': 'Shanghai → Europe',
    'home.testimonials.user2.content': 'Works across 15 European countries, one plan for the whole trip. Customer support is very responsive.',
    'home.testimonials.user3.name': 'Mr. Wang',
    'home.testimonials.user3.location': 'Shenzhen → Thailand',
    'home.testimonials.user3.content': 'Third time buying! Always use SimRyoko when traveling. Stable signal and fast speed, highly recommend!',
    'home.testimonials.user4.name': 'Ms. Chen',
    'home.testimonials.user4.location': 'Guangzhou → USA',
    'home.testimonials.user4.content': 'First time using eSIM, was worried. But installation was simple, support helped patiently. Full signal in the US!',
    'home.testimonials.view_more': 'View more reviews on Telegram',
    
    // 首页 - 使用步骤补充
    'home.how_it_works.subtitle': '3 easy steps to get connected',
    'home.how_it_works.view_tutorial': 'View detailed tutorial',
    'home.how_it_works.devices': 'Compatible: iPhone XR/XS+ • iPad Pro/Air • Select Android flagships',
    
    // 首页 - 支付方式
    'home.payment.title': 'Payment Methods',
    'home.payment.subtitle': 'Multiple secure payment options',
    
    // 首页 - 信任标识
    'home.trust.title': 'Trusted By',
    
    // 首页 - FAQ
    'home.faq.title': 'FAQ',
    
    // 产品列表页
    'products.all': 'All',
    'products.popular': 'Popular',
    'products.regional': 'Regional',
    'products.global': 'Global',
    'products.select_country': 'Select Destination Country',
    'products.select_region': 'Select Region',
    'products.select_type': 'Select Plan Type',
    'products.back': 'Back',
    'products.loading': 'Loading...',
    'products.count': '{count} products',
    'products.no_products': 'No products in this category',
    'products.type.data_only': 'Data Only',
    'products.type.data_voice_sms': 'Data + Voice + SMS',
    'products.type.data_only.desc': 'Data only, no voice/SMS',
    'products.type.data_voice_sms.desc': 'Full-featured plan',
    
    // 产品卡片
    'product.data': 'Data',
    'product.validity': 'Validity',
    'product.countries': 'Countries',
    'product.add_to_cart': 'Add to Cart',
    'product.buy_now': 'Buy Now',
    'product.days': '{days} days',
    'product.unlimited': 'Unlimited',
    'product.data_gb': '{gb}GB',
    'product.data_mb': '{mb}MB',
    
    // 购物车
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.continue_shopping': 'Continue Shopping',
    'cart.checkout': 'Checkout',
    'cart.total': 'Total',
    'cart.remove': 'Remove',
    'cart.quantity': 'Quantity',
    
    // 结账
    'checkout.title': 'Checkout',
    'checkout.email': 'Email Address',
    'checkout.email.placeholder': 'For receiving eSIM QR code',
    'checkout.order_summary': 'Order Summary',
    'checkout.pay': 'Pay Now',
    'checkout.security': 'Secure payment',
    
    // 成功页
    'success.title': 'Payment Successful!',
    'success.message': 'eSIM details sent to your email',
    'success.check_email': 'Check your email (including spam)',
    'success.order_id': 'Order ID',
    'success.back_home': 'Back to Home',
    
    // 帮助页
    'help.title': 'Help Center',
    'help.how_to_install': 'How to Install eSIM',
    'help.contact': 'Contact Us',
    'help.iphone': 'iPhone Users',
    'help.android': 'Android Users',
    'help.step': 'Step {step}',
    
    // 国家列表页
    'countries.title': 'All Countries',
    'countries.search': 'Search countries...',
    'countries.count': '{count} countries',
    
    // 通用
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.retry': 'Retry',
    'common.close': 'Close',
    'common.search': 'Search',
    'common.currency': 'USD',
    'common.view_all': 'View All',
    'common.learn_more': 'Learn More',
    
    // 语言切换
    'lang.zh': '中文',
    'lang.en': 'English',
    'lang.switch': 'Switch Language',
    
    // 产品详情页
    'product.detail.title': 'Product Details',
    'product.detail.data': 'Data',
    'product.detail.validity': 'Validity',
    'product.detail.price': 'Price',
    'product.detail.coverage': 'Coverage',
    'product.detail.network': 'Carrier',
    'product.detail.features': 'Features',
    'product.detail.description': 'Description',
    'product.detail.installation': 'Installation',
    'product.detail.terms': 'Terms & Conditions',
    'product.detail.warning.china': '⚠️ Important: China Mainland iPhone NOT Compatible',
    'product.detail.warning.china.desc': 'China mainland version iPhone uses dual physical SIM cards and does NOT support eSIM functionality.',
    'product.detail.warning.china.note': 'Please confirm your device supports eSIM before purchasing. Non-China versions (HK, US, JP, etc.) work normally.',
    'product.detail.terms.item1': 'Instant delivery, eSIM QR code sent via email',
    'product.detail.terms.item2': 'Hotspot sharing supported',
    'product.detail.terms.item3': 'No identity verification required',
    'product.detail.terms.item4': '7-day refund if not activated',
    'product.detail.terms.item5': 'Ensure your device supports eSIM',
    'product.detail.add_to_cart': 'Add to Cart',
    'product.detail.buy_now': 'Buy Now',
    'product.detail.back': 'Back',
    
    // 购物车页
    'cart.item': 'Item',
    'cart.items': 'Items',
    'cart.empty.title': 'Your cart is empty',
    'cart.empty.desc': 'Start shopping for eSIM plans',
    'cart.continue_shopping': 'Continue Shopping',
    'cart.checkout': 'Checkout',
    'cart.remove': 'Remove',
    'cart.quantity': 'Quantity',
    'cart.total': 'Total',
    
    // 结算页
    'checkout.contact': 'Contact Email',
    'checkout.payment_method': 'Payment Method',
    'checkout.payment.card': 'Credit/Debit Card',
    'checkout.payment.card.desc': 'Visa, MasterCard supported',
    'checkout.payment.usdt': 'USDT',
    'checkout.payment.usdt.desc': 'TRC-20 Network',
    'checkout.agree': 'I have read and agree to the',
    'checkout.terms': 'Terms & Conditions',
    'checkout.confirm_device': ', and confirm my device supports eSIM',
    'checkout.processing': 'Processing...',
    'checkout.confirm_pay': 'Pay Now',
    
    // 成功页
    'success.email.sent': 'eSIM details sent to your email',
    'success.email.check': 'Check your email (including spam folder)',
    'success.email.resend': "Didn't receive email?",
    'success.email.contact': 'Contact Support',
    'success.order.details': 'Order Details',
    'success.back_home': 'Back to Home',
    
    // 帮助页
    'help.subtitle': 'Contact us if you have other questions',
    'help.install.title': 'How to Install eSIM',
    'help.install.iphone': 'iPhone Users',
    'help.install.android': 'Android Users',
    'help.install.step': 'Step {step}',
    'help.contact.title': 'Contact Us',
    'help.contact.desc': 'Contact us through any of these channels',
    'help.contact.email': 'Email',
    'help.contact.telegram': 'Telegram',
    
    // 国家列表页
    'countries.all': 'All',
    'countries.popular': 'Popular',
    'countries.search_placeholder': 'Search countries...',
    'countries.no_results': 'No countries found',
  },
};

export const defaultLocale: Locale = 'zh';
