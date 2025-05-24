import { useState } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export function useLocalCart() {
  const [items] = useState<CartItem[]>([]);

  return {
    items,
    total: 0,
    removeItem: (id: string) => {},
    updateQuantity: (id: string, delta: number) => {},
    clearCart: () => {},
  };
}
