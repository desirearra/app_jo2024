import { render } from '@testing-library/react';
import App from '../App';

jest.mock('@/lib/api', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
  post: jest.fn(),
  put: jest.fn(),
  del: jest.fn(),
}));

// Mock tous les composants qui posent problème
jest.mock('react-router-dom', () => ({
  createBrowserRouter: jest.fn(() => ({})),
  RouterProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="router">{children}</div>
  ),
}));

jest.mock('@/components/ui/toaster', () => ({
  Toaster: () => <div data-testid="toaster" />,
}));

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Simple test pour vérifier que l'app se rend sans erreur
  });
});
