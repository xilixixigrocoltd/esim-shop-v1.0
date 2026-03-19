# 🌐 中英文切换功能实现文档

**实现时间**: 2026-03-19  
**技术栈**: React Context + localStorage + 自定义 Hook

---

## 📋 功能概述

网站支持中英文切换，用户偏好保存在 localStorage，刷新页面后保持选择。

### 用户体验
1. 点击右上角语言切换按钮（🌐 图标）
2. 中文 ↔ English 一键切换
3. 刷新页面/重新访问自动记住上次选择

---

## 🏗️ 技术架构

### 文件结构
```
esim-shop-v1.0/
├── lib/
│   ├── i18n.ts              # 翻译文件（zh/en）
│   └── i18n-context.tsx     # React Context + Provider
├── components/ui/
│   └── LanguageSwitcher.tsx # 语言切换按钮组件
└── pages/
    └── _app.tsx             # 包裹 I18nProvider
```

---

## 💻 实现细节

### 1. 翻译文件 (lib/i18n.ts)

```typescript
export type Locale = 'zh' | 'en';

export const translations = {
  zh: {
    'nav.home': '首页',
    'home.hero.title': '全球 eSIM，即时连接',
    // ... 更多翻译
  },
  en: {
    'nav.home': 'Home',
    'home.hero.title': 'Global eSIM, Instant Connection',
    // ... 更多翻译
  },
};
```

**翻译键命名规范**:
- 格式：`模块。功能。内容`
- 示例：`home.hero.title`, `nav.products`, `common.loading`

---

### 2. React Context (lib/i18n-context.tsx)

```typescript
const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    // 从 localStorage 读取用户偏好
    const saved = localStorage.getItem('simryoko_locale') as Locale;
    if (saved && (saved === 'zh' || saved === 'en')) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('simryoko_locale', newLocale);
  };

  const t = (key: string): string => {
    return translations[locale][key as keyof typeof translations.zh] || key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
```

**核心功能**:
- `locale`: 当前语言
- `setLocale`: 切换语言（自动保存）
- `t(key)`: 翻译函数

---

### 3. 语言切换按钮 (components/ui/LanguageSwitcher.tsx)

```typescript
export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  const toggleLocale = () => {
    setLocale(locale === 'zh' ? 'en' : 'zh');
  };

  return (
    <button onClick={toggleLocale}>
      <Globe className="w-4 h-4" />
      <span className="font-medium">
        {locale === 'zh' ? 'EN' : '中文'}
      </span>
    </button>
  );
}
```

**显示逻辑**:
- 当前中文 → 显示 "EN"（切换到英文）
- 当前英文 → 显示 "中文"（切换到中文）

---

### 4. 全局包裹 (_app.tsx)

```typescript
export default function App({ Component, pageProps }: AppProps) {
  return (
    <I18nProvider>
      <Head>...</Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </I18nProvider>
  );
}
```

---

### 5. 组件中使用 (HeroSection.tsx 示例)

```typescript
import { useI18n } from '@/lib/i18n-context';

export default function HeroSection() {
  const { t } = useI18n();

  return (
    <section>
      <h1>{t('home.hero.title')}</h1>
      <p>{t('home.hero.subtitle')}</p>
      <button>{t('home.hero.cta')}</button>
    </section>
  );
}
```

---

## 📊 翻译覆盖率

### 已完成翻译的模块
| 模块 | 翻译键数量 | 状态 |
|------|-----------|------|
| 导航栏 | 5 | ✅ |
| 首页 Hero | 8 | ✅ |
| 首页特性 | 6 | ✅ |
| 通用 | 8 | ✅ |
| **总计** | **27** | **✅** |

### 待翻译的模块
- [ ] 产品列表页
- [ ] 产品详情页
- [ ] 购物车页
- [ ] 结账页
- [ ] 成功页
- [ ] 帮助页
- [ ] 邮件模板

---

## 🔧 使用方法

### 添加新翻译
1. 在 `lib/i18n.ts` 中添加键值对（zh 和 en 都要加）
2. 在组件中使用 `t('键名')` 调用

```typescript
// 1. 添加翻译
zh: { 'new.key': '中文内容' }
en: { 'new.key': 'English Content' }

// 2. 使用
const { t } = useI18n();
<h2>{t('new.key')}</h2>
```

### 扩展新语言
1. 修改 `Locale` 类型：`'zh' | 'en' | 'ja'`
2. 在 `translations` 中添加 `ja` 对象
3. 更新 `LanguageSwitcher` 组件支持多语言切换

---

## 🎨 UI 设计

### 桌面端
```
[SimRyoko Logo] [全部产品] [国家] [帮助] [🌐 EN] [🛒 0]
```

### 移动端
```
[SimRyoko Logo]             [🛒 0] [☰]
                                ↓
[全部产品]
[国家]
[帮助]
[🌐 切换语言]
```

---

## 🧪 测试清单

### 功能测试
- [x] 点击切换按钮，语言立即切换
- [x] 刷新页面，语言保持
- [x] 清除 localStorage 后，默认中文
- [x] 所有已翻译内容正确显示

### 兼容性测试
- [x] Chrome 桌面
- [x] Chrome 移动
- [x] Safari 桌面
- [x] Safari 移动（iOS）

---

## 📈 性能影响

| 指标 | 影响 |
|------|------|
| 初始加载 | +0.5KB（翻译文件） |
| 运行时 | 可忽略（内存对象查找） |
| localStorage | 1 次读/次写（切换时） |

**结论**: 性能影响微乎其微

---

## 🚀 部署

```bash
git add .
git commit -m "feat: 中英文切换功能 (i18n)"
git push
npx vercel --prod
```

**生产地址**: https://simryoko.com

---

## 📝 待办事项

### 短期（本周）
- [ ] 产品列表页翻译
- [ ] 购物车页翻译
- [ ] 结账页翻译
- [ ] 成功页翻译

### 中期（下周）
- [ ] 帮助页翻译
- [ ] 邮件模板翻译
- [ ] 产品详情页翻译

### 长期（Q2）
- [ ] 日文支持
- [ ] 韩文支持
- [ ] 自动检测浏览器语言

---

## 🎓 经验总结

### 成功经验
1. **Context + Hook 模式** - 全局访问，类型安全
2. **localStorage 持久化** - 用户体验好
3. **键值对翻译** - 易于维护和扩展

### 踩坑记录
1. **Client-side only** - `localStorage` 在 SSR 不可用，需用 `useEffect`
2. **类型安全** - TypeScript 严格检查翻译键
3. **缺失翻译降级** - `t()` 函数返回原 key 作为 fallback

---

**文档版本**: 1.0  
**创建时间**: 2026-03-19  
**维护者**: 龙虾 🦞
