import { AuthPage } from '@/pages/Auth';
import { render } from '@testing-library/react';

// Mock React Router
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/auth' }),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

describe('AuthPage Component', () => {
  it('renders without crashing', () => {
    render(<AuthPage />);
    // Test simple pour vérifier que le composant se rend sans erreur
  });
});
