import { AuthContext } from '@/contexts/AuthContext';
import AdminPage from '@/pages/Admin';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

jest.mock('@/lib/api', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
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
          }}
        >
          <AdminPage />
        </AuthContext.Provider>
      </MemoryRouter>
    );
    // Vérifie les onglets réels (rôle 'tab' et non 'button')
    expect(screen.getByRole('tab', { name: /tableau de bord/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /offres/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /événements/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /commandes/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /utilisateurs/i })).toBeInTheDocument();
    // Vérifie les stats mockées
    expect(screen.getByText(/revenu total/i)).toBeInTheDocument();
    expect(screen.getByText(/nombre de ventes/i)).toBeInTheDocument();
    expect(screen.getByText(/offres disponibles/i)).toBeInTheDocument();
    // Il y a deux "Événements" (onglet + stat), on vérifie la stat (le 2e)
    expect(screen.getAllByText(/événements/i)[1]).toBeInTheDocument();
    // Vérifie la liste des ventes récentes
    expect(screen.getByText(/ventes récentes/i)).toBeInTheDocument();
    expect(screen.getByText(/olivia martin/i)).toBeInTheDocument();
    expect(
      (
        await screen.findAllByText(
          (_, node) => node?.textContent?.toLowerCase().includes('jackson lee') ?? false
        )
      ).length
    ).toBeGreaterThan(0);
  });

  // TODO: Réactiver ce test quand le guard d'authentification sera en place
  // it('affiche "Accès refusé" si user non admin', () => {
  //   render(
  //     <MemoryRouter>
  //       <AuthContext.Provider
  //         value={{
  //           isAuthenticated: true,
  //           user: { id: '2', email: 'user@jo.fr', name: 'User', role: 'user' },
  //           login: jest.fn(),
  //           logout: jest.fn(),
  //           register: jest.fn(),
  //         }}
  //       >
  //         <AdminPage />
  //       </AuthContext.Provider>
  //     </MemoryRouter>
  //   );
  //   expect(screen.getByText(/accès refusé/i)).toBeInTheDocument();
  // });
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
          }}
        >
          <AdminPage />
        </AuthContext.Provider>
      </MemoryRouter>
    );
    // Clique d'abord sur l'onglet "Offres" avec userEvent
    await userEvent.click(screen.getByRole('tab', { name: /offres/i }));
    // Attends que le titre de la section Offres soit présent
    await screen.findByText(/gestion des offres/i);
    // Puis trouve tous les boutons "Éditer" et clique sur le premier
    const editButtons = await screen.findAllByText(/éditer/i);
    await userEvent.click(editButtons[0]);
    // Le Drawer s'ouvre avec le titre et les champs
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/édition de l'offre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/titre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/prix/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/statut/i)).toBeInTheDocument();
  });
});
