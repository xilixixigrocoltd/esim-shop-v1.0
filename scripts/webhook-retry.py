#!/usr/bin/env python3
"""
Webhook 失败重试与告警机制
- 监听 webhook 调用失败
- 自动重试（最多 3 次）
- 重试失败后发送告警
"""

import os
import json
import time
import requests
import hmac
import hashlib
from datetime import datetime, timedelta

# 配置
B2B_API_KEY = os.environ.get('B2B_API_KEY', 'ak_6aea76ae400a247afa952d80ad4ece10b16f84e3')
B2B_API_SECRET = os.environ.get('B2B_API_SECRET', '15d1b5861f82849d16faa7be3f267c569bb888c166be2d3635baf078ed973697')
TELEGRAM_BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN', '')
TELEGRAM_ADMIN_ID = os.environ.get('TELEGRAM_ADMIN_ID', '7867683484')

# 重试配置
MAX_RETRIES = 3
RETRY_DELAY_SECONDS = 60  # 重试间隔

def send_telegram_alert(message):
    """发送 Telegram 告警"""
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_ADMIN_ID:
        print(f"⚠️ Telegram 未配置，告警内容:\n{message}")
        return False
    
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    data = {
        "chat_id": TELEGRAM_ADMIN_ID,
        "text": message,
        "parse_mode": "HTML"
    }
    
    try:
        response = requests.post(url, json=data, timeout=10)
        result = response.json()
        return result.get('ok', False)
    except Exception as e:
        print(f"❌ 告警发送异常：{e}")
        return False

def create_b2b_order(session_data, retry_count=0):
    """创建 B2B 订单（带重试）"""
    email = session_data.get('email')
    items = json.loads(session_data.get('items', '[]'))
    amount = float(session_data.get('amount', 0))
    
    if not email or not items:
        return {"error": "Invalid session data", "retry": False}
    
    # 构建订单请求
    first_item = items[0]
    order_payload = {
        "productId": first_item.get('id') or first_item.get('productId'),
        "quantity": first_item.get('quantity', 1),
        "customerEmail": email
    }
    
    # B2B API 签名
    timestamp = str(int(time.time() * 1000))
    nonce = ''.join([chr(random.randint(97, 122)) for _ in range(32)])
    body = json.dumps(order_payload, separators=(',', ':'))
    sign_string = f"POST/api/v1/orders{body}{timestamp}{nonce}"
    signature = hmac.new(B2B_API_SECRET.encode(), sign_string.encode(), hashlib.sha256).hexdigest()
    
    headers = {
        "x-api-key": B2B_API_KEY,
        "x-timestamp": timestamp,
        "x-nonce": nonce,
        "x-signature": signature,
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(
            "https://api.xigrocoltd.com/api/v1/orders",
            headers=headers,
            json=order_payload,
            timeout=30
        )
        result = response.json()
        
        if result.get('success'):
            return {"success": True, "order": result}
        else:
            error_msg = result.get('message', 'Unknown error')
            
            # 可重试的错误
            retryable_errors = ['timeout', 'temporary', '503', '504']
            is_retryable = any(e in error_msg.lower() for e in retryable_errors)
            
            return {
                "error": error_msg,
                "retry": is_retryable and retry_count < MAX_RETRIES
            }
    
    except requests.exceptions.Timeout:
        return {"error": "Request timeout", "retry": retry_count < MAX_RETRIES}
    except Exception as e:
        return {"error": str(e), "retry": retry_count < MAX_RETRIES}

def process_failed_webhook(session_data, retry_count=0):
    """处理失败的 webhook 订单创建"""
    print(f"🔄 重试创建订单 (尝试 {retry_count + 1}/{MAX_RETRIES})")
    
    result = create_b2b_order(session_data, retry_count)
    
    if result.get('success'):
        order_id = result['order'].get('orderNumber', 'unknown')
        print(f"✅ 订单创建成功：{order_id}")
        return True
    
    error = result.get('error', 'Unknown error')
    should_retry = result.get('retry', False)
    
    print(f"❌ 订单创建失败：{error}")
    
    if should_retry:
        print(f"⏳ {RETRY_DELAY_SECONDS}秒后重试...")
        time.sleep(RETRY_DELAY_SECONDS)
        return process_failed_webhook(session_data, retry_count + 1)
    else:
        # 发送告警
        alert_msg = f"<b>❌ 订单创建失败（重试{retry_count}次后放弃）</b>\n\n"
        alert_msg += f"时间：{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
        alert_msg += f"邮箱：{session_data.get('email', 'unknown')}\n"
        alert_msg += f"金额：${session_data.get('amount', 0)}\n"
        alert_msg += f"错误：{error}\n\n"
        alert_msg += "⚠️ 需要人工介入处理"
        
        send_telegram_alert(alert_msg)
        return False

if __name__ == "__main__":
    # 从参数或环境变量读取 session 数据
    if len(sys.argv) > 1:
        session_json = sys.argv[1]
        session_data = json.loads(session_json)
        success = process_failed_webhook(session_data)
        exit(0 if success else 1)
    else:
        print("用法：python webhook-retry.py '<session_json>'")
        exit(1)
