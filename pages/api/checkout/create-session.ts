import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) return res.status(500).json({ error: 'Stripe not configured' })

  const { items, email } = req.body
  if (!items?.length || !email) return res.status(400).json({ error: 'Invalid request' })

  try {
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(stripeKey)

    const lineItems = items.map((item: any) => {
      // 兼容两种格式: { product: {...}, qty } 或 { id, name, price, qty, ... }
      const p = item.product || item
      const price = parseFloat(p.price || p.amount || 0)
      const dataSize = p.dataSize || 0
      const dataStr = dataSize === 0 ? 'Unlimited' : dataSize >= 1024 ? `${dataSize/1024}GB` : `${dataSize}MB`
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: p.name || 'eSIM',
            description: `${p.validDays || 0} days · ${dataStr}`,
          },
          unit_amount: Math.round(price * 100),
        },
        quantity: item.qty || item.quantity || 1,
      }
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'alipay'],
      payment_method_options: {
        card: {
          request_three_d_secure: 'automatic',
        },
      },
      line_items: lineItems,
      mode: 'payment',
      customer_email: email,
      // Apple Pay & Google Pay 自动通过 card 方式支持（Stripe 自动检测）
      success_url: `${process.env.NEXT_PUBLIC_URL || 'https://simryoko.com'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'https://simryoko.com'}/cart`,
      metadata: { email },
    })

    res.status(200).json({ url: session.url })
  } catch (err: any) {
    console.error('Stripe error:', err)
    res.status(500).json({ error: err.message })
  }
}
