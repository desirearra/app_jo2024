import { ContentSection } from '@/components/landing/ContentSection';
import { HeroSection } from '@/components/landing/HeroSection';

export function Home() {
  return (
    <main>
      <HeroSection />
      <ContentSection />
      {/* Les autres sections seront ajoutées ici */}
    </main>
  );
}
