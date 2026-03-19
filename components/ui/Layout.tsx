'use client';

import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import PWAInstallPrompt from './PWAInstallPrompt';
import { storage, CART_KEY } from '@/lib/utils';
import type { CartItem } from '@/types';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const cart = (storage.get(CART_KEY) as CartItem[]) || [];
    const count = cart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
    setCartCount(count);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header cartCount={cartCount} />
      <main className="flex-1">{children}</main>
      <Footer />
      <PWAInstallPrompt />
    </div>
  );
}
