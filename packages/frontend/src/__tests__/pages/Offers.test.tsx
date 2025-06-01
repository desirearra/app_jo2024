import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { CartWidget } from '../../components/ui/CartWidget';
import { AppProvider } from '../../contexts/AppContext';
import * as api from '../../lib/api';
import { OffersPage } from '../../pages/Offers';
import type { Offer } from '../../types';

jest.mock('../../lib/api');

const mockOffers: Offer[] = [
  {
    id: '1',
    name: 'Pass Journée',
    description: 'Accès à une journée',
    price: '50',
    type: 'SOLO',
    seats: 100,
    isActive: true,
    eventId: 'event1',
    createdAt: '2024-07-01T00:00:00Z',
    updatedAt: '2024-07-01T00:00:00Z',
    isDeleted: false,
  },
];

beforeEach(() => {
  (api.getOffers as jest.Mock).mockResolvedValue(mockOffers);
});
afterEach(() => {
  jest.clearAllMocks();
});

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
