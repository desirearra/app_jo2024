import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Types
type PassType = 'Solo' | 'Duo' | 'Familial';

type Ticket = {
  id: string;
  eventId: string;
  offerId: string;
  passType: PassType;
  sport: string;
  venue: string;
  quantity: number;
  price: number;
  available: number; // Nombre de billets disponibles
};

type Cart = {
  tickets: Ticket[];
  totalAmount: number;
};

// Limites par type de pass selon la todolist
const PASS_LIMITS: Record<PassType, number> = {
  Solo: 3,
  Duo: 3,
  Familial: 2,
};

type AppContextType = {
  cart: Cart;
  addTicketToCart: (ticket: Omit<Ticket, 'id'>) => boolean;
  removeTicketFromCart: (id: string) => void;
  updateTicketQuantity: (id: string, quantity: number) => boolean;
  clearCart: () => void;
  canAddTicket: (passType: PassType, quantity: number) => boolean;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Charger le panier depuis le localStorage si présent
  const getInitialCart = (): Cart => {
    try {
      const stored = localStorage.getItem('cart');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // Erreur lors de la lecture du localStorage (ignorée intentionnellement)
    }
    return { tickets: [], totalAmount: 0 };
  };

  const [cart, setCart] = useState<Cart>(getInitialCart);

  // Sauvegarder le panier dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const calculateTotal = (tickets: Ticket[]): number => {
    return tickets.reduce((total, ticket) => total + ticket.price * ticket.quantity, 0);
  };

  const canAddTicket = (passType: PassType, quantity: number): boolean => {
    const currentPassTypeCount = cart.tickets
      .filter(t => t.passType === passType)
      .reduce((sum, t) => sum + t.quantity, 0);

    return currentPassTypeCount + quantity <= PASS_LIMITS[passType];
  };

  const addTicketToCart = (ticketData: Omit<Ticket, 'id'>): boolean => {
    if (!canAddTicket(ticketData.passType, ticketData.quantity)) {
      return false;
    }

    if (ticketData.quantity > ticketData.available) {
      return false;
    }

    const newTicket = { ...ticketData, id: crypto.randomUUID() };

    setCart(prevCart => ({
      tickets: [...prevCart.tickets, newTicket],
      totalAmount: calculateTotal([...prevCart.tickets, newTicket]),
    }));

    return true;
  };

  const removeTicketFromCart = (id: string) => {
    setCart(prevCart => {
      const updatedTickets = prevCart.tickets.filter(ticket => ticket.id !== id);
      return {
        tickets: updatedTickets,
        totalAmount: calculateTotal(updatedTickets),
      };
    });
  };

  const updateTicketQuantity = (id: string, quantity: number): boolean => {
    const ticket = cart.tickets.find(t => t.id === id);
    if (!ticket) return false;

    const otherTicketsCount = cart.tickets
      .filter(t => t.passType === ticket.passType && t.id !== id)
      .reduce((sum, t) => sum + t.quantity, 0);

    if (otherTicketsCount + quantity > PASS_LIMITS[ticket.passType]) {
      return false;
    }

    if (quantity > ticket.available) {
      return false;
    }

    setCart(prevCart => {
      const updatedTickets = prevCart.tickets.map(t => (t.id === id ? { ...t, quantity } : t));
      return {
        tickets: updatedTickets,
        totalAmount: calculateTotal(updatedTickets),
      };
    });

    return true;
  };

  const clearCart = () => {
    setCart({ tickets: [], totalAmount: 0 });
  };

  const value: AppContextType = {
    cart,
    addTicketToCart,
    removeTicketFromCart,
    updateTicketQuantity,
    clearCart,
    canAddTicket,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
