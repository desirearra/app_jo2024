import { OfferCTA } from '@/components/landing/OfferCTA';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useState } from 'react';

// Type pour un article du panier
interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  date: string;
  location: string;
}

// Mock data - à remplacer par l'état global du panier
const initialCartItems: CartItem[] = [
  {
    id: 'athletics-1',
    title: 'Athlétisme au Stade de France',
    price: 150,
    quantity: 2,
    image:
      'https://plus.unsplash.com/premium_photo-1661868906940-5d8443acf49e?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    date: '2024-08-01',
    location: 'Stade de France',
  },
];

export function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <h1 className="text-4xl font-bold text-slate-900">Votre Panier</h1>

          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Liste des articles */}
              <div className="lg:col-span-2 space-y-6">
                {cartItems.map(item => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="w-full sm:w-48 h-48">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                            <div className="mt-2 space-y-1 text-sm text-slate-600">
                              <p>Date : {item.date}</p>
                              <p>Lieu : {item.location}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors"
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
                        <div className="mt-4 flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 rounded-full hover:bg-slate-100"
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
                                  d="M20 12H4"
                                />
                              </svg>
                            </button>
                            <span className="text-slate-900 font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 rounded-full hover:bg-slate-100"
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
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                            </button>
                          </div>
                          <div className="text-lg font-semibold text-slate-900">
                            {item.price * item.quantity} €
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Résumé de la commande */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">
                    Résumé de la commande
                  </h2>
                  <div className="space-y-4">
                    <div className="flex justify-between text-slate-600">
                      <span>Sous-total</span>
                      <span>{total} €</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Frais de service</span>
                      <span>0 €</span>
                    </div>
                    <div className="border-t border-slate-200 pt-4">
                      <div className="flex justify-between text-lg font-semibold text-slate-900">
                        <span>Total</span>
                        <span>{total} €</span>
                      </div>
                    </div>
                    <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                      Procéder au paiement
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-slate-400 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                  Votre panier est vide
                </h2>
                <p className="text-slate-600">
                  Découvrez nos offres et ajoutez-les à votre panier pour continuer.
                </p>
              </motion.div>

              <OfferCTA />
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
