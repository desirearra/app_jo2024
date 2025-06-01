import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import AccountPage from '../../pages/Account';

jest.mock('@/lib/api', () => ({
  ...jest.requireActual('@/lib/api'),
  get: jest.fn(
    () =>
      new Promise(resolve =>
        setTimeout(
          () =>
            resolve({
              data: {
                id: 'user-1',
                email: 'test@example.com',
                firstName: 'Test',
                lastName: 'User',
                role: 'user',
                orders: [
                  {
                    id: 'order-1',
                    offerId: 'offer-1',
                    status: 'PAID',
                    totalAmount: '99.00',
                    createdAt: new Date().toISOString(),
                  },
                ],
                tickets: [
                  {
                    id: 'ticket-1',
                    offerId: 'offer-1',
                    finalKey: 'QR-123',
                    status: 'ACTIVE',
                    createdAt: new Date().toISOString(),
                  },
                ],
              },
            }),
          50
        )
      )
  ),
}));

describe('AccountPage', () => {
  it('affiche les infos du user, une commande et un ticket', async () => {
    localStorage.setItem('token', 'fake-token');
    render(
      <AuthProvider>
        <BrowserRouter>
          <AccountPage />
        </BrowserRouter>
      </AuthProvider>
    );
    // Loader
    // await screen.findByText(/chargement/i);
    // Attendre la fin du chargement
    // await waitFor(() => expect(screen.queryByText(/chargement/i)).not.toBeInTheDocument());
    // Attendre que les labels soient affichés (plusieurs peuvent exister)
    const nomLabels = await screen.findAllByText(/Nom\s*:/i);
    const nomOk = nomLabels.some(label => label.parentElement?.textContent?.match(/User/));
    expect(nomOk).toBe(true);

    const prenomLabels = await screen.findAllByText(/Prénom\s*:/i);
    const prenomOk = prenomLabels.some(label => label.parentElement?.textContent?.match(/Test/));
    expect(prenomOk).toBe(true);

    const emailLabels = await screen.findAllByText(/Email\s*:/i);
    const emailOk = emailLabels.some(label =>
      label.parentElement?.textContent?.match(/test@example.com/)
    );
    expect(emailOk).toBe(true);

    // Vérifier que 'Accès refusé' n'est pas affiché
    expect(screen.queryByText(/accès refusé/i)).not.toBeInTheDocument();
    // Commande (onglet)
    await userEvent.click(screen.getByRole('button', { name: /mes commandes/i }));
    expect(screen.getByText(/Commande #order-1/)).toBeInTheDocument();
    // Ticket (onglet)
    await userEvent.click(screen.getByRole('button', { name: /mes billets/i }));
    expect(screen.getByText(/ID\s*:\s*ticket-1/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /voir qrcode/i })).toBeInTheDocument();
  });
});
