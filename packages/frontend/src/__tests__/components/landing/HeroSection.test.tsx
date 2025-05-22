import { HeroSection } from '@/components/landing/HeroSection';
import { render } from '@testing-library/react';

// Mock React Router
jest.mock('react-router-dom', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

// Mock pour QRCodeSVG
jest.mock('qrcode.react', () => ({
  QRCodeSVG: () => <div data-testid="qrcode" />,
}));

// Mock @radix-ui/react-slot
jest.mock('@radix-ui/react-slot', () => ({
  Slot: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('HeroSection Component', () => {
  it('renders without crashing', () => {
    render(<HeroSection />);
    // Test simple pour vérifier que le composant se rend sans erreur
  });
});
