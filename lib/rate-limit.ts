import { RateLimiterMemory } from 'rate-limiter-flexible';

// API 速率限制配置
// 每个 IP 地址：
// - 每分钟最多 60 次请求（一般 API）
// - 每分钟最多 10 次请求（敏感 API：支付/认证）

// 通用 API 限流器（60 次/分钟）
export const apiLimiter = new RateLimiterMemory({
  points: 60,
  duration: 60, // 秒
  blockDuration: 60 * 5, // 触发限制后封禁 5 分钟
});

// 敏感 API 限流器（10 次/分钟）
export const sensitiveApiLimiter = new RateLimiterMemory({
  points: 10,
  duration: 60, // 秒
  blockDuration: 60 * 10, // 触发限制后封禁 10 分钟
});

// 认证 API 限流器（5 次/分钟）
export const authLimiter = new RateLimiterMemory({
  points: 5,
  duration: 60, // 秒
  blockDuration: 60 * 15, // 触发限制后封禁 15 分钟
});

// 支付 Webhook 限流器（30 次/分钟）
export const webhookLimiter = new RateLimiterMemory({
  points: 30,
  duration: 60, // 秒
  blockDuration: 60 * 5, // 触发限制后封禁 5 分钟
});

// 获取客户端 IP（支持 Cloudflare/代理）
export function getClientIP(req: any): string {
  return (
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

// 限流中间件（Next.js API Routes）
export async function rateLimitMiddleware(
  req: any,
  res: any,
  limiter: RateLimiterMemory = apiLimiter
) {
  const ip = getClientIP(req);
  
  try {
    await limiter.consume(ip);
    return true;
  } catch (rejRes: any) {
    const retryAfter = Math.ceil(rejRes.msBeforeNext / 1000);
    
    res.setHeader('Retry-After', retryAfter);
    res.setHeader('X-RateLimit-Limit', limiter.points);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, limiter.points - rejRes.remainingPoints));
    res.setHeader('X-RateLimit-Reset', new Date(Date.now() + rejRes.msBeforeNext).toISOString());
    
    res.status(429).json({
      error: {
        code: 'TOO_MANY_REQUESTS',
        message: '请求过于频繁，请稍后重试',
        retryAfter: retryAfter,
      },
    });
    
    return false;
  }
}

// 简化的限流装饰器（用于 API 路由）
export function withRateLimit(handler: Function, limiter: RateLimiterMemory = apiLimiter) {
  return async (req: any, res: any) => {
    const allowed = await rateLimitMiddleware(req, res, limiter);
    if (!allowed) return;
    return handler(req, res);
  };
}
