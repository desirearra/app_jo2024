import { EventDetailsPage } from '@/pages/EventDetails';
import { render } from '@testing-library/react';

// Mock React Router
jest.mock('react-router-dom', () => ({
  useParams: () => ({ id: 'test-id' }),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

// Mock Radix UI Toast
jest.mock('@radix-ui/react-toast', () => ({
  ToastProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  ToastViewport: () => null,
  Toast: () => null,
  ToastTitle: () => null,
  ToastDescription: () => null,
  ToastAction: () => null,
  ToastClose: () => null,
}));

describe('EventDetailsPage Component', () => {
  it('renders without crashing', () => {
    render(<EventDetailsPage />);
    // Test simple pour vérifier que la page se rend sans erreur
  });
});
