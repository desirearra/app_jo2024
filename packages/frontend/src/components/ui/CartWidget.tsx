import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';

// TODO: À remplacer par le vrai context du panier
const useCart = () => {
  const [items, setItems] = React.useState([
    {
      id: 'pass-solo-1',
      type: 'Pass Solo',
      eventTitle: 'Athlétisme - Finale 100m',
      price: 95,
      quantity: 1,
    },
    {
      id: 'pass-familial-1',
      type: 'Pass Familial',
      eventTitle: 'Natation - Finales',
      price: 320,
      quantity: 1,
    },
  ]);

  const removeItem = (id: string) => {
    setItems(items => items.filter(item => item.id !== id));
  };

  return {
    items,
    totalItems: items.length,
    totalPrice: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    removeItem,
  };
};

export function CartWidget() {
  const { items, totalItems, totalPrice, removeItem } = useCart();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Ouvrir le panier">
          <ShoppingCart className="h-6 w-6" />
          {totalItems > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
            >
              {totalItems}
            </motion.span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {items.length > 0 ? (
          <>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-4">Mon Panier</h3>
              <div className="space-y-3">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-start group">
                    <div>
                      <p className="font-medium">{item.type}</p>
                      <p className="text-sm text-slate-600">{item.eventTitle}</p>
                      <p className="text-sm">Quantité: {item.quantity}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <p className="font-semibold">{item.price} €</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Supprimer du panier"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{totalPrice} €</span>
                </div>
              </div>
            </div>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link
                to="/panier"
                className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors py-2 px-4 rounded-md text-center font-medium"
              >
                Voir mon panier
              </Link>
            </DropdownMenuItem>
          </>
        ) : (
          <div className="p-4 text-center text-slate-600">Votre panier est vide</div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
