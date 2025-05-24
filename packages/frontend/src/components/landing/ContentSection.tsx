import { EventList } from './EventList';
import { OfferBanner } from './OfferBanner';

export function ContentSection() {
  return (
    <>
      <EventList />
      {/* En-tête de section */}
      <div className="flex flex-col items-center mb-16 animate-fade-in-up">
        <h2 className="text-4xl font-bold text-slate-900 mb-6">Réservez vos places</h2>
        <p className="text-xl text-slate-600 text-center max-w-3xl">
          Ne manquez pas l&apos;occasion unique d&apos;assister aux Jeux Olympiques de Paris 2024.
          Sécurisez vos billets maintenant !
        </p>
      </div>
      <OfferBanner />
    </>
  );
}
