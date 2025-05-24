import { CartWidget } from '@/components/ui/CartWidget';
import { AppProvider } from '@/contexts/AppContext';
import { OffersPage } from '@/pages/Offers';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

describe('OffersPage intégration panier', () => {
  it('ajoute un item au panier quand on clique sur "Ajouter au panier"', async () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <OffersPage />
          <CartWidget />
        </AppProvider>
      </MemoryRouter>
    );
    const user = userEvent.setup();
    // On clique sur le premier bouton "Ajouter au panier"
    const addButtons = await screen.findAllByRole('button', { name: /ajouter au panier/i });
    expect(addButtons.length).toBeGreaterThan(0);
    await user.click(addButtons[0]);
    // Le badge du panier doit afficher 1
    const badge = await screen.findByText('1');
    expect(badge).toBeInTheDocument();
  });
});
