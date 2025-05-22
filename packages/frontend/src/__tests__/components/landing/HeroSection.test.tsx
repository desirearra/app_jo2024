import { HeroSection } from '@/components/landing/HeroSection';
import { render, screen } from '@testing-library/react';

describe('HeroSection', () => {
  it('should render the main heading', () => {
    render(<HeroSection />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      /Billetterie Officielle JO 2024/i
    );
  });

  it('should render the main CTA button', () => {
    render(<HeroSection />);
    expect(screen.getByRole('link', { name: /découvrir les offres/i })).toBeInTheDocument();
  });

  it('should render the hero image', () => {
    render(<HeroSection />);
    const heroImage = screen.getByRole('img', { name: /jeux olympiques 2024/i });
    expect(heroImage).toBeInTheDocument();
    expect(heroImage).toHaveAttribute('src');
    expect(heroImage).toHaveAttribute('alt', 'Jeux Olympiques 2024');
  });

  it('should render the animation element', () => {
    render(<HeroSection />);
    expect(screen.getByTestId('hero-animation')).toBeInTheDocument();
  });

  it('should render key features list', () => {
    render(<HeroSection />);
    const features = ['Billets officiels', 'Paiement sécurisé', 'QR Code unique'];

    features.forEach(feature => {
      expect(screen.getByText(feature)).toBeInTheDocument();
    });
  });
});
