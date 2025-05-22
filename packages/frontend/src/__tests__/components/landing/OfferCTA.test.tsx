import { OfferCTA } from '@/components/landing/OfferCTA';
import { render } from '@testing-library/react';

// Mock React Router
jest.mock('react-router-dom', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

describe('OfferCTA Component', () => {
  it('renders without crashing', () => {
    render(<OfferCTA />);
    // Test simple pour vérifier que le composant se rend sans erreur
  });
});
