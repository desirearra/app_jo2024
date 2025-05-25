import { AppProvider, useApp } from '@/contexts/AppContext';
import '@testing-library/jest-dom';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const TestComponent = () => {
  const { cart, addTicketToCart, removeTicketFromCart, updateTicketQuantity, clearCart } = useApp();

  return (
    <div>
      <div data-testid="cart-count">{cart.tickets.length}</div>
      <div data-testid="cart-total">{cart.totalAmount}</div>

      <button
        data-testid="add-ticket"
        onClick={() => {
          addTicketToCart({
            eventId: 'event1',
            passType: 'Duo',
            sport: 'Athlétisme',
            venue: 'Stade de France',
            quantity: 1,
            price: 100,
            available: 10,
          });
        }}
      >
        Ajouter un billet
      </button>

      <button data-testid="clear-cart" onClick={clearCart}>
        Vider le panier
      </button>

      {cart.tickets.map(ticket => (
        <div key={ticket.id} data-testid={`ticket-container`}>
          <span data-testid="ticket-id">{ticket.id}</span>
          <button data-testid="remove-ticket" onClick={() => removeTicketFromCart(ticket.id)}>
            Supprimer
          </button>
          <button
            data-testid="update-ticket"
            onClick={() => updateTicketQuantity(ticket.id, ticket.quantity + 1)}
          >
            +1
          </button>
        </div>
      ))}
    </div>
  );
};

describe('AppContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should add a ticket to cart', async () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    const user = userEvent.setup();

    await act(async () => {
      await user.click(screen.getByTestId('add-ticket'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('100');
    });
  });

  it('should clear the cart', async () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    const user = userEvent.setup();

    await act(async () => {
      await user.click(screen.getByTestId('add-ticket'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
    });

    await act(async () => {
      await user.click(screen.getByTestId('clear-cart'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('0');
    });
  });

  it('should remove a ticket from cart', async () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    const user = userEvent.setup();

    await act(async () => {
      await user.click(screen.getByTestId('add-ticket'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
    });

    await act(async () => {
      await user.click(screen.getByTestId('remove-ticket'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('0');
    });
  });

  it('should update ticket quantity', async () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    const user = userEvent.setup();

    await act(async () => {
      await user.click(screen.getByTestId('add-ticket'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
    });

    await act(async () => {
      await user.click(screen.getByTestId('update-ticket'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('200');
    });
  });

  it('should persist cart in localStorage', async () => {
    // Premier rendu : ajout d'un ticket
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );
    const user = userEvent.setup();
    await act(async () => {
      await user.click(screen.getByTestId('add-ticket'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
    });

    // Simuler un reload : démonter/remonter le provider
    // On s'attend à ce que le panier soit restauré depuis le localStorage
    // On démonte tout
    document.body.innerHTML = '';

    // Deuxième rendu : le provider doit relire le panier du localStorage
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
    });
  });
});
