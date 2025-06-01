import { AuthModal } from '@/components/auth/AuthModal';
import { OfferBanner } from '@/components/landing/OfferBanner';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { createOrder } from '@/lib/api';
import { Minus, Plus, ShoppingCart, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function CartPage() {
  const { isAuthenticated, user } = useAuth();
  const { cart, removeTicketFromCart, updateTicketQuantity, clearCart } = useApp();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const total = cart.totalAmount;

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!user?.id) {
      toast({
        title: 'Erreur',
        description: 'Utilisateur non authentifié',
        variant: 'destructive',
      });
      return;
    }
    if (cart.tickets.length === 0) {
      toast({ title: 'Panier vide', description: 'Ajoutez des billets avant de commander.' });
      return;
    }
    setLoading(true);
    try {
      console.log('cart', cart);
      const items = cart.tickets.map(t => ({ offerId: t.offerId, quantity: t.quantity }));
      await createOrder(user.id, items);
      toast({
        title: 'Commande validée',
        description: 'Votre commande a bien été enregistrée ! 🎉',
      });
      clearCart();
      setTimeout(() => {
        if (user?.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/compte');
        }
      }, 1000);
    } catch (err) {
      toast({
        title: 'Erreur',
        description: 'Impossible de valider la commande',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 py-12">
      <div className="container mx-auto px-4">
        <div className="space-y-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-slate-900">Votre Panier</h1>

          {cart.tickets.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {cart.tickets.map(ticket => (
                  <div
                    key={ticket.id}
                    className="bg-white rounded-lg shadow-lg p-6 animate-fade-in-up"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          {ticket.sport} - {ticket.venue}
                        </h3>
                        <div className="text-sm text-slate-500 mb-1">
                          Pass : <span className="font-medium">{ticket.passType}</span>
                        </div>
                        <div className="text-sm text-slate-500 mb-1">
                          Prix unitaire : {ticket.price}€
                        </div>
                        {/* Si la date est dispo dans le ticket, décommente ci-dessous */}
                        {/* <div className="text-sm text-slate-500 mb-1">Date : {ticket.date}</div> */}
                        <div className="flex items-center space-x-4 mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateTicketQuantity(ticket.id, ticket.quantity - 1)}
                            disabled={ticket.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="text-slate-700 w-8 text-center">{ticket.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateTicketQuantity(ticket.id, ticket.quantity + 1)}
                            disabled={ticket.quantity >= ticket.available}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="text-lg font-semibold">{ticket.price * ticket.quantity}€</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-red-50 hover:text-red-500 transition-colors"
                          onClick={() => removeTicketFromCart(ticket.id)}
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 h-fit animate-fade-in border border-slate-100">
                <h2 className="text-xl font-semibold mb-4">Récapitulatif</h2>
                <div className="space-y-2">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{total}€</span>
                  </div>
                </div>
                <Button className="w-full mt-6" onClick={handleCheckout} disabled={loading}>
                  {isAuthenticated
                    ? loading
                      ? 'Traitement...'
                      : 'Passer la commande'
                    : 'Se connecter pour commander'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 animate-fade-in">
              <div className="flex flex-col items-center py-12">
                <ShoppingCart className="h-20 w-20 mx-auto mb-6" />
                <p className="text-slate-600 mb-6">Votre panier est vide</p>
              </div>
              <OfferBanner />
            </div>
          )}
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
