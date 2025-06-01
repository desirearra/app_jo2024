import { getEvents } from '@/lib/api';
import type { Event as ApiEvent } from '@/types';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function EventsPage() {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getEvents<ApiEvent[]>()
      .then(data => setEvents(Array.isArray(data) ? data : []))
      .catch(() => setError('Erreur lors du chargement des événements'))
      .finally(() => setLoading(false));
  }, []);

  const filteredEvents = events.filter(event => {
    const titre = event.name || '';
    const matchesSearch =
      titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <section className="flex flex-col min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="flex-1 container mx-auto px-4 py-10">
        {/* En-tête de section */}
        <div className="flex flex-col items-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl text-center font-bold text-slate-900 mb-6">
            Événements JO Paris 2024
          </h2>
          <p className="text-xl text-slate-600 text-center max-w-3xl">
            Découvrez tous les événements des Jeux Olympiques et réservez vos places dès maintenant.
          </p>
        </div>

        {/* Barre de recherche uniquement */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in-up [animation-delay:200ms]">
          <input
            type="text"
            placeholder="Rechercher un événement..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Gestion du loading et de l'erreur */}
        {loading ? (
          <div className="text-center py-12 animate-fade-in">Chargement des événements...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500 animate-fade-in">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => {
              const titre = event.name || '';
              return (
                <div
                  key={event.id}
                  className="flex-1 cursor-pointer relative overflow-hidden rounded-2xl shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${400 + index * 100}ms` }}
                  onClick={() => {
                    navigate(`/evenements/${event.id}`);
                  }}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={event.image ?? '/default-event.jpg'}
                      alt={titre}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500 brightness-95 hover:brightness-100"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-slate-900">{titre}</h3>
                      {/* <span className="text-sm font-medium text-green-600">{places} places</span> */}
                    </div>
                    <p className="text-slate-600 mb-4">{event.description}</p>
                    <div className="flex flex-col gap-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {new Date(event.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {event.location}
                      </div>
                    </div>
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
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
