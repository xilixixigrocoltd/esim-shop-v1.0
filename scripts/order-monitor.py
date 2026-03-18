#!/usr/bin/env python3
"""
订单监控与告警脚本
- 每 5 分钟检查一次订单状态
- 检测异常：pending 超时、未付款已发货、支付失败
- 发送告警到 Telegram
"""

import hmac
import hashlib
import time
import requests
import json
import random
import os
from datetime import datetime, timedelta
from collections import defaultdict

# 配置
API_KEY = os.environ.get('B2B_API_KEY', 'ak_6aea76ae400a247afa952d80ad4ece10b16f84e3')
API_SECRET = os.environ.get('B2B_API_SECRET', '15d1b5861f82849d16faa7be3f267c569bb888c166be2d3635baf078ed973697')
BASE_URL = "https://api.xigrocoltd.com"
TELEGRAM_BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN', '')
TELEGRAM_ADMIN_ID = os.environ.get('TELEGRAM_ADMIN_ID', '7867683484')

# 告警阈值
PENDING_TIMEOUT_MINUTES = 10  # pending 状态超过 10 分钟告警
FAILED_ORDER_THRESHOLD = 3    # 10 分钟内失败订单超过 3 个告警

def b2b_request(endpoint, method="GET", data=None):
    """B2B API 请求（带签名）"""
    timestamp = str(int(time.time() * 1000))
    nonce = ''.join(random.choices('abcdefghijklmnopqrstuvwxyz0123456789', k=32))
    body = json.dumps(data, separators=(',', ':')) if data else ""
    sign_string = method + endpoint + body + timestamp + nonce
    signature = hmac.new(API_SECRET.encode(), sign_string.encode(), hashlib.sha256).hexdigest()
    
    headers = {
        "x-api-key": API_KEY,
        "x-timestamp": timestamp,
        "x-nonce": nonce,
        "x-signature": signature,
        "Content-Type": "application/json" if data else ""
    }
    
    url = f"{BASE_URL}{endpoint}"
    try:
        response = requests.request(method, url, headers=headers, json=data if method == "POST" else None, timeout=30)
        return response.json()
    except Exception as e:
        return {"error": str(e)}

def send_telegram_alert(message):
    """发送 Telegram 告警"""
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_ADMIN_ID:
        print(f"⚠️ Telegram 未配置，告警内容:\n{message}")
        return
    
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    data = {
        "chat_id": TELEGRAM_ADMIN_ID,
        "text": message,
        "parse_mode": "HTML"
    }
    
    try:
        response = requests.post(url, json=data, timeout=10)
        result = response.json()
        if result.get('ok'):
            print(f"✅ 告警已发送")
        else:
            print(f"❌ 告警发送失败：{result}")
    except Exception as e:
        print(f"❌ 告警发送异常：{e}")

def check_orders():
    """检查订单状态"""
    print(f"\n{'='*60}")
    print(f"🔍 订单检查 - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*60}")
    
    result = b2b_request("/api/v1/orders?page=1&pageSize=50")
    if 'error' in result:
        print(f"❌ API 请求失败：{result['error']}")
        return
    
    orders = result.get('message', {}).get('orders', [])
    anomalies = []
    stats = defaultdict(int)
    
    now = datetime.now()
    
    for order in orders:
        status = order.get('status', 'unknown')
        stats[status] += 1
        
        # 解析创建时间
        try:
            created_at = datetime.fromisoformat(order['createdAt'].replace('Z', '+00:00'))
            age_minutes = (now - created_at.replace(tzinfo=None)).total_seconds() / 60
        except:
            continue
        
        # 异常 1: pending 超时
        if status == 'pending' and age_minutes > PENDING_TIMEOUT_MINUTES:
            anomalies.append({
                'type': '⏰ 待支付超时',
                'order': order['orderNumber'],
                'detail': f"{int(age_minutes)}分钟",
                'amount': f"${order.get('totalAmount', 0)}"
            })
        
        # 异常 2: 未付款已发货
        if order.get('esims') and status not in ['paid', 'delivered']:
            anomalies.append({
                'type': '🚨 未付款已发货',
                'order': order['orderNumber'],
                'detail': f"状态：{status}",
                'amount': f"${order.get('totalAmount', 0)}"
            })
        
        # 异常 3: 支付失败
        if status == 'failed' or 'failed' in str(order.get('paymentStatus', '')).lower():
            anomalies.append({
                'type': '❌ 支付失败',
                'order': order['orderNumber'],
                'detail': order.get('paymentMessage', '未知原因'),
                'amount': f"${order.get('totalAmount', 0)}"
            })
    
    # 打印统计
    print(f"📦 检查订单：{len(orders)} 个")
    print(f"📊 状态分布：{dict(stats)}")
    
    if anomalies:
        print(f"\n⚠️ 发现 {len(anomalies)} 个异常:")
        for a in anomalies:
            print(f"  {a['type']}: {a['order']} ({a['detail']}) - {a['amount']}")
        
        # 发送告警
        alert_msg = f"<b>🚨 eSIM 订单异常告警</b>\n\n"
        alert_msg += f"检查时间：{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
        alert_msg += f"异常数量：{len(anomalies)}\n\n"
        
        for a in anomalies[:5]:  # 最多显示 5 个
            alert_msg += f"<b>{a['type']}</b>\n"
            alert_msg += f"订单：{a['order']}\n"
            alert_msg += f"详情：{a['detail']} | 金额：{a['amount']}\n\n"
        
        if len(anomalies) > 5:
            alert_msg += f"... 还有 {len(anomalies) - 5} 个异常\n"
        
        send_telegram_alert(alert_msg)
    else:
        print("✅ 无异常订单")
    
    return len(anomalies)

if __name__ == "__main__":
    anomaly_count = check_orders()
    
    # 退出码：0=正常，1=有异常
    exit(1 if anomaly_count > 0 else 0)
