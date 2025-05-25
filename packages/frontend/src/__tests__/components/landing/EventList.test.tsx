import { EventList } from '@/components/landing/EventList';
import { render } from '@testing-library/react';

// Mock React Router
jest.mock('react-router-dom', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

describe('EventList Component', () => {
  it('renders without crashing', () => {
    render(<EventList />);
    // Test simple pour vérifier que le composant se rend sans erreur
  });
});
