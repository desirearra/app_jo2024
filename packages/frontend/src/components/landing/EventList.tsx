import { getEvents } from '@/lib/api';
import type { Event } from '@/types';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getEvents<Event[]>()
      .then(data => {
        // On trie par date de création décroissante (createdAt) et on prend les 3 plus récents
        const sorted = [...(Array.isArray(data) ? data : [])].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setEvents(sorted.slice(0, 3));
      })
      .catch(() => setError('Erreur lors du chargement des événements'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="flex flex-col bg-gradient-to-b from-white to-slate-50">
      <div className="flex-1 container mx-auto px-4 py-10">
        {/* En-tête de section */}
        <div className="flex flex-col items-center mb-16 animate-fade-in-up">
          <img
            src="https://img.olympics.com/images/image/private/w_300/f_auto/primary/gpo3co3bpkqsikyznrns"
            alt="Logo JO Paris 2024"
            className="w-40 h-auto mx-auto mb-2"
          />
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Participez aux événements</h2>
          <p className="text-xl text-slate-600 text-center max-w-3xl">
            Ne manquez pas l&apos;occasion unique d&apos; de participer aux événements sportifs les
            plus excitants du monde.
          </p>
        </div>

        {/* Section événements dynamiques */}
        {loading ? (
          <div className="text-center py-12 animate-fade-in">Chargement des événements...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500 animate-fade-in">{error}</div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6 mb-16">
            {events.map((event, index) => (
              <div
                key={event.id}
                className="flex-1 relative overflow-hidden rounded-2xl shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 animate-fade-in-up"
                style={{ animationDelay: `${200 + index * 200}ms` }}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={event.image ?? '/default-event.jpg'}
                    alt={event.name}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500 brightness-95 hover:brightness-100"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{event.name}</h3>
                  <p className="text-slate-600 mb-4">{event.description}</p>
                  <Link
                    to={`/evenements/${event.id}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    En savoir plus
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
