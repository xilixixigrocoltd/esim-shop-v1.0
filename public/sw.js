// SimRyoko PWA Service Worker
// 版本：v1.0
// 创建时间：2026-03-19

const CACHE_NAME = 'simryoko-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// 静态资源（立即缓存）
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// 安装事件 - 缓存静态资源
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Installation complete, skip waiting');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] Cache failed:', error);
      })
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys()
      .then((keys) => {
        return Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
            .map((key) => {
              console.log('[Service Worker] Deleting old cache:', key);
              return caches.delete(key);
            })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activation complete, claim clients');
        return self.clients.claim();
      })
  );
});

// 请求事件 - 缓存策略
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 仅处理 HTTP/HTTPS 请求
  if (!request.url.startsWith('http')) {
    return;
  }

  // 跨域请求（如图片、CDN）- 直接网络请求
  if (url.origin !== location.origin) {
    return;
  }

  // HTML 页面 - Network First
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // API 请求 - Network First，失败时返回缓存
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, 5000));
    return;
  }

  // 静态资源（CSS、JS、图片）- Cache First
  event.respondWith(cacheFirst(request));
});

// Cache First 策略
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    console.log('[Service Worker] Cache hit:', request.url);
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[Service Worker] Fetch failed:', request.url, error);
    // 如果是导航请求，返回离线页面
    if (request.mode === 'navigate') {
      return caches.match('/offline');
    }
    throw error;
  }
}

// Network First 策略
async function networkFirst(request, timeout = 3000) {
  try {
    const response = await Promise.race([
      fetch(request),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Network timeout')), timeout)
      ),
    ]);

    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('[Service Worker] Network failed, trying cache:', request.url);
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    // 如果是导航请求，返回离线页面
    if (request.mode === 'navigate') {
      return caches.match('/offline');
    }
    throw error;
  }
}

// 后台同步（可选功能）
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Sync event:', event.tag);
  if (event.tag === 'sync-orders') {
    event.waitUntil(syncOrders());
  }
});

async function syncOrders() {
  // 同步离线订单的逻辑（后续实现）
  console.log('[Service Worker] Syncing orders...');
}

// 推送通知（可选功能）
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received');
  const data = event.data?.json() || {};
  const title = data.title || 'SimRyoko';
  const options = {
    body: data.body || '您有新的消息',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    data: data.data,
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// 通知点击事件
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});

console.log('[Service Worker] Script loaded');
