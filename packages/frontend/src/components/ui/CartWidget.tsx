import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CartWidget = () => {
  const { cart } = useApp();
  const itemCount = cart.tickets.length;

  return (
    <Link to="/panier">
      <Button
        variant="outline"
        size="icon"
        className="relative transition-transform hover:scale-105 active:scale-95"
      >
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center animate-bounce">
            {itemCount}
          </span>
        )}
      </Button>
    </Link>
  );
};
