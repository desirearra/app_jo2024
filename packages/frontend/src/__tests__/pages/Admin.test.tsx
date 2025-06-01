import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import AdminPage from '../../pages/Admin';

jest.mock('@/lib/api', () => ({
  get: jest.fn(url => {
    if (url === '/api/offers') {
      return Promise.resolve({
        data: [
          {
            id: 'offer-1',
            name: 'Offre Solo',
            description: 'Desc',
            price: '99',
            type: 'SOLO',
            seats: 1,
            isActive: true,
            isDeleted: false,
            eventId: 'event-1',
            createdAt: '2025-05-30T19:34:20.162Z',
            updatedAt: '2025-05-31T18:17:43.580Z',
          },
        ],
      });
    }
    if (url === '/api/events') {
      return Promise.resolve({
        data: [
          {
            id: 'event-1',
            name: 'Natation',
            description: 'Desc',
            date: '2025-08-01',
            location: 'Paris',
            isActive: true,
            isDeleted: false,
            createdAt: '2025-05-30T19:34:20.162Z',
            updatedAt: '2025-05-31T18:17:43.580Z',
          },
        ],
      });
    }
    if (url === '/api/orders') {
      return Promise.resolve({
        data: [
          {
            id: 'order-1',
            userId: 'user-1',
            totalAmount: '120',
            status: 'PAID',
            createdAt: '2025-05-30T19:34:20.162Z',
            updatedAt: '2025-05-31T18:17:43.580Z',
            orderItems: [
              {
                id: 'orderItem-1',
                tickets: [
                  {
                    id: 'ticket-1',
                    userId: 'user-1',
                    eventId: 'event-1',
                    status: 'ACTIVE',
                    createdAt: '2025-05-30T19:34:20.162Z',
                    updatedAt: '2025-05-31T18:17:43.580Z',
                    finalKey: 'QR-123',
                    type: 'SOLO',
                    seat: 'A1',
                  },
                ],
              },
            ],
          },
          {
            id: 'order-2',
            userId: 'user-2',
            totalAmount: '150',
            status: 'PAID',
            createdAt: '2025-05-30T19:34:20.162Z',
            updatedAt: '2025-05-31T18:17:43.580Z',
            orderItems: [
              {
                id: 'orderItem-2',
                tickets: [],
              },
            ],
          },
        ],
      });
    }
    if (url === '/api/users') {
      return Promise.resolve({
        data: [
          {
            id: 'user-1',
            email: 'olivia.martin@example.com',
            firstName: 'Olivia',
            lastName: 'Martin',
            role: 'USER',
            isDeleted: false,
            createdAt: '2025-05-30T19:34:20.162Z',
            updatedAt: '2025-05-31T18:17:43.580Z',
            key1: '',
            key2: '',
          },
          {
            id: 'user-2',
            email: 'jackson.lee@example.com',
            firstName: 'Jackson',
            lastName: 'Lee',
            role: 'USER',
            isDeleted: false,
            createdAt: '2025-05-30T19:34:20.162Z',
            updatedAt: '2025-05-31T18:17:43.580Z',
            key1: '',
            key2: '',
          },
        ],
      });
    }
    if (url === '/api/tickets') {
      return Promise.resolve({
        data: [
          {
            id: 'ticket-1',
            userId: 'user-1',
            eventId: 'event-1',
            status: 'ACTIVE',
            createdAt: '2025-05-30T19:34:20.162Z',
            updatedAt: '2025-05-31T18:17:43.580Z',
            finalKey: 'QR-123',
            type: 'SOLO',
            seat: 'A1',
          },
        ],
      });
    }
    return Promise.resolve({ data: [] });
  }),
  post: jest.fn(),
  put: jest.fn(),
  del: jest.fn(),
}));

describe('AdminPage', () => {
  it('affiche le menu admin et le dashboard si user admin', async () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            isAuthenticated: true,
            user: { id: '1', email: 'admin@jo.fr', name: 'Admin', role: 'admin' },
            login: jest.fn(),
            logout: jest.fn(),
            register: jest.fn(),
            token: 'fake-token',
            loginWithToken: jest.fn(),
          }}
        >
          <AdminPage />
        </AuthContext.Provider>
      </MemoryRouter>
    );
    // Vérifie les onglets réels (rôle 'tab' et non 'button')
    expect(await screen.findByRole('tab', { name: /tableau de bord/i })).toBeInTheDocument();
    expect(await screen.findByRole('tab', { name: /offres/i })).toBeInTheDocument();
    expect(await screen.findByRole('tab', { name: /événements/i })).toBeInTheDocument();
    expect(await screen.findByRole('tab', { name: /commandes/i })).toBeInTheDocument();
    expect(await screen.findByRole('tab', { name: /utilisateurs/i })).toBeInTheDocument();
    // Vérifie les stats mockées
    expect(await screen.findByText(/revenu total/i)).toBeInTheDocument();
    expect(await screen.findByText(/nombre de ventes/i)).toBeInTheDocument();
    expect(await screen.findByText(/offres disponibles/i)).toBeInTheDocument();
    // Il y a deux "Événements" (onglet + stat), on vérifie la stat (le 2e)
    expect((await screen.findAllByText(/événements/i))[1]).toBeInTheDocument();
    // Vérifie la liste des ventes récentes
    expect(await screen.findByText(/ventes récentes/i)).toBeInTheDocument();
    expect(await screen.findByText(/olivia martin/i)).toBeInTheDocument();
    expect(
      (
        await screen.findAllByText(
          (_, node) => node?.textContent?.toLowerCase().includes('jackson lee') ?? false
        )
      ).length
    ).toBeGreaterThan(0);
  });

  // TODO: Réactiver ce test quand le guard d'authentification sera en place
  it('affiche "Accès refusé" si user non admin', () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            isAuthenticated: true,
            user: { id: '2', email: 'user@jo.fr', name: 'User', role: 'user' },
            login: jest.fn(),
            logout: jest.fn(),
            register: jest.fn(),
            token: 'fake-token',
            loginWithToken: jest.fn(),
          }}
        >
          <AdminPage />
        </AuthContext.Provider>
      </MemoryRouter>
    );
    expect(screen.getByText(/accès refusé/i)).toBeInTheDocument();
  });
});

describe('AdminPage - Drawer édition offre', () => {
  it('ouvre un Drawer avec les champs pré-remplis quand on clique sur Éditer', async () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            isAuthenticated: true,
            user: { id: '1', email: 'admin@jo.fr', name: 'Admin', role: 'admin' },
            login: jest.fn(),
            logout: jest.fn(),
            register: jest.fn(),
            token: 'fake-token',
            loginWithToken: jest.fn(),
          }}
        >
          <AdminPage />
        </AuthContext.Provider>
      </MemoryRouter>
    );
    // Clique d'abord sur l'onglet "Offres" avec userEvent
    const tabOffres = await screen.findByRole('tab', { name: /offres/i });
    await userEvent.click(tabOffres);
    // Attends que le titre de la section Offres soit présent
    await screen.findByText(/gestion des offres/i);
    // Puis trouve tous les boutons "Éditer" et clique sur le premier
    const editButtons = await screen.findAllByText(/éditer/i);
    await userEvent.click(editButtons[0]);
    // Le Drawer s'ouvre avec le titre et les champs
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/édition de l'offre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^nom$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/prix/i)).toBeInTheDocument();
  });
});
