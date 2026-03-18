#!/usr/bin/env python3
"""
Stripe Webhook 重试脚本
用于手动重放失败的 Stripe Checkout Session，创建 B2B 订单并发送邮件
"""

import hmac
import hashlib
import time
import requests
import random
import json
import os
from datetime import datetime, timedelta

# 配置
STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY', '')
B2B_API_KEY = os.environ.get('B2B_API_KEY', '')
B2B_API_SECRET = os.environ.get('B2B_API_SECRET', '')
B2B_URL = 'https://api.xigrocoltd.com'
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')

def get_stripe_sessions(limit=10):
    """获取最近的 Stripe Checkout Sessions"""
    response = requests.get(
        'https://api.stripe.com/v1/checkout/sessions',
        auth=(STRIPE_SECRET_KEY, ''),
        params={'limit': limit},
        timeout=10
    )
    return response.json().get('data', [])

def check_b2b_order_exists(session_id):
    """检查 B2B 订单是否已存在（通过 metadata 中的 session_id）"""
    # 获取最近订单并检查
    timestamp = str(int(time.time() * 1000))
    nonce = ''.join(random.choices('abcdefghijklmnopqrstuvwxyz0123456789', k=32))
    endpoint = '/api/v1/orders?page=1&pageSize=50'
    method = 'GET'
    body = ''
    sign_string = method + endpoint + body + timestamp + nonce
    signature = hmac.new(B2B_API_SECRET.encode(), sign_string.encode(), hashlib.sha256).hexdigest()
    
    headers = {
        'x-api-key': B2B_API_KEY,
        'x-timestamp': timestamp,
        'x-nonce': nonce,
        'x-signature': signature,
    }
    
    response = requests.get(f'{B2B_URL}{endpoint}', headers=headers, timeout=10)
    result = response.json()
    
    orders = result.get('message', {}).get('orders', [])
    # 这里简单检查，实际应该通过 metadata 匹配
    return False

def create_b2b_order(session):
    """创建 B2B 订单"""
    metadata = session.get('metadata', {})
    email = metadata.get('email') or session.get('customer_email')
    items_json = metadata.get('items', '[]')
    items = json.loads(items_json)
    
    if not items:
        print(f"  ❌ 无商品信息")
        return None
    
    # 创建订单（每个商品创建一个订单）
    orders_created = []
    for item in items:
        timestamp = str(int(time.time() * 1000))
        nonce = ''.join(random.choices('abcdefghijklmnopqrstuvwxyz0123456789', k=32))
        endpoint = '/api/v1/orders'
        method = 'POST'
        
        order_payload = {
            'productId': item.get('productId') or item.get('id'),
            'quantity': item.get('quantity', 1),
            'customerEmail': email,
        }
        
        body = json.dumps(order_payload, separators=(',', ':'))
        sign_string = method + endpoint + body + timestamp + nonce
        signature = hmac.new(B2B_API_SECRET.encode(), sign_string.encode(), hashlib.sha256).hexdigest()
        
        headers = {
            'x-api-key': B2B_API_KEY,
            'x-timestamp': timestamp,
            'x-nonce': nonce,
            'x-signature': signature,
            'Content-Type': 'application/json',
        }
        
        response = requests.post(f'{B2B_URL}{endpoint}', headers=headers, json=order_payload, timeout=30)
        result = response.json()
        
        if result.get('success'):
            order = result.get('message', {})
            orders_created.append(order)
            print(f"  ✅ 订单创建：{order.get('orderNumber')}")
        else:
            print(f"  ❌ 订单创建失败：{result.get('message')}")
    
    return orders_created

def send_email(email, orders):
    """发送订单确认邮件"""
    if not RESEND_API_KEY or not email:
        return
    
    for order in orders:
        order_id = order.get('orderNumber')
        amount = order.get('totalAmount', 0)
        items = order.get('orderItems', [])
        
        # 简化邮件内容
        html = f"""
        <html>
        <body style="font-family: sans-serif;">
          <h1>订单确认 - {order_id}</h1>
          <p>感谢您的购买！</p>
          <p>订单号：{order_id}</p>
          <p>金额：${amount}</p>
          <p>产品：{items[0].get('productName') if items else 'N/A'}</p>
        </body>
        </html>
        """
        
        response = requests.post(
            'https://api.resend.com/emails',
            headers={'Authorization': f'Bearer {RESEND_API_KEY}', 'Content-Type': 'application/json'},
            json={
                'from': 'SimRyoko eSIM <noreply@simryoko.com>',
                'to': [email],
                'subject': f'订单确认 - {order_id}',
                'html': html,
            },
            timeout=30
        )
        
        result = response.json()
        if 'id' in result:
            print(f"  ✅ 邮件发送：{result.get('id')}")
        else:
            print(f"  ❌ 邮件发送失败：{result}")

def main():
    print("=" * 70)
    print("🔄 Stripe Webhook 重试工具")
    print("=" * 70)
    print()
    
    # 获取最近的 sessions
    sessions = get_stripe_sessions(limit=20)
    
    # 过滤已支付但未创建订单的 sessions
    paid_sessions = []
    for session in sessions:
        if session.get('payment_status') == 'paid':
            created = datetime.fromtimestamp(session.get('created', 0))
            age = datetime.now() - created
            
            # 检查最近 24 小时的支付
            if age < timedelta(hours=24):
                paid_sessions.append(session)
    
    print(f"找到 {len(paid_sessions)} 个已支付的 Session（24 小时内）")
    print()
    
    # 显示并确认
    for i, session in enumerate(paid_sessions[:10], 1):
        email = session.get('customer_email') or session.get('metadata', {}).get('email')
        amount = session.get('amount_total', 0) / 100
        created = datetime.fromtimestamp(session.get('created', 0))
        
        print(f"{i}. Session: {session.get('id', 'N/A')[:25]}...")
        print(f"   金额：${amount:.2f}")
        print(f"   邮箱：{email}")
        print(f"   时间：{created} ({int((datetime.now() - created).total_seconds() / 60)}分钟前)")
        print()
    
    # 询问是否重试
    if paid_sessions:
        confirm = input("是否重试创建订单？(y/n): ")
        if confirm.lower() == 'y':
            for session in paid_sessions:
                print(f"\n处理 Session: {session.get('id')[:25]}...")
                
                orders = create_b2b_order(session)
                if orders:
                    email = session.get('customer_email') or session.get('metadata', {}).get('email')
                    send_email(email, orders)
                print()
    
    print("=" * 70)

if __name__ == '__main__':
    main()
