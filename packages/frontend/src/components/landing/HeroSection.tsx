import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const features = ['Billets officiels', 'Paiement sécurisé', 'QR Code unique'] as const;

export function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden min-h-[60vh] py-16 sm:py-24">
      {/* Image de fond immersive : Paris pour les JO */}
      <div className="absolute inset-0 h-full w-full">
        <img
          src="https://il.srgssr.ch/images/?imageUrl=https%3A%2F%2Fimg.rts.ch%2Fmedias%2F2024%2Fimage%2Fu5itu0-28596283.image%2F16x9&format=jpg&width=1920"
          alt="Vue de Paris pour les JO 2024"
          className="w-full h-full object-cover object-center brightness-60"
        />
        {/* Overlay sombre pour améliorer le contraste */}
        <div className="absolute inset-0 bg-black/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
      </div>

      {/* Contenu principal */}
      <div className="w-full z-10 max-w-5xl px-4 flex flex-col items-center text-center gap-8 animate-fade-in-up">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          Billetterie Officielle JO 2024
        </h1>
        <p className="text-lg text-white max-w-2xl mx-auto">
          Vivez l&apos;expérience unique des Jeux Olympiques 2024 à Paris. Réservez vos billets
          officiels en toute sécurité.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-white text-slate-900 hover:bg-slate-200 rounded-full hover:scale-105 active:scale-95 transition-transform font-semibold shadow-md"
        >
          <Link to="/offres">Découvrir les offres</Link>
        </Button>
        <ul className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          {features.map(feature => (
            <li key={feature} className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-900 font-bold">
                ✓
              </span>
              <span className="text-base text-white font-medium">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
