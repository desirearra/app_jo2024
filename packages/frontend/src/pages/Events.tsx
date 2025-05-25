import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Event {
  id: string;
  titre: string;
  description: string;
  date: string;
  lieu: string;
  image: string;
  categorie: string;
  placesDisponibles: number;
}

const events: Event[] = [
  {
    id: 'athletisme-100m',
    titre: 'Athlétisme au Stade de France',
    description:
      'Vivez les performances exceptionnelles des meilleurs athlètes mondiaux dans ce temple mythique du sport français. Places limitées !',
    date: '2024-08-04',
    lieu: 'Stade de France',
    image:
      'https://plus.unsplash.com/premium_photo-1661868906940-5d8443acf49e?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categorie: 'Athlétisme',
    placesDisponibles: 150,
  },
  {
    id: 'natation-papillon',
    titre: 'Natation à La Défense Arena',
    description:
      "Soyez aux premières loges pour voir naître de nouveaux records olympiques dans la plus grande salle d'Europe !",
    date: '2024-08-02',
    lieu: 'Centre Aquatique',
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=1000',
    categorie: 'Natation',
    placesDisponibles: 100,
  },
  {
    id: 'gymnastique-sol',
    titre: 'Gymnastique à Bercy',
    description:
      "Réservez vos places pour assister aux performances spectaculaires des meilleurs gymnastes du monde à l'Accor Arena !",
    date: '2024-08-06',
    lieu: 'Arena Bercy',
    image:
      'https://plus.unsplash.com/premium_photo-1721755913670-5d20e710df72?q=80&w=1024&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categorie: 'Gymnastique',
    placesDisponibles: 80,
  },
];

export function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredEvents = events.filter(event => {
    const matchesCategory = !selectedCategory || event.categorie === selectedCategory;
    const matchesSearch =
      event.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="flex flex-col h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="flex-1 container mx-auto px-4 py-10">
        {/* En-tête de section */}
        <div className="flex flex-col items-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Événements JO Paris 2024</h2>
          <p className="text-xl text-slate-600 text-center max-w-3xl">
            Découvrez tous les événements des Jeux Olympiques et réservez vos places dès maintenant.
          </p>
        </div>

        {/* Filtres et recherche */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in-up [animation-delay:200ms]">
          <input
            type="text"
            placeholder="Rechercher un événement..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Toutes les catégories</option>
            <option value="Athlétisme">Athlétisme</option>
            <option value="Natation">Natation</option>
            <option value="Gymnastique">Gymnastique</option>
          </select>
        </div>

        {/* Liste des événements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, index) => (
            <div
              key={event.id}
              className="flex-1 relative overflow-hidden rounded-2xl shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 animate-fade-in-up"
              style={{ animationDelay: `${400 + index * 100}ms` }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={event.image}
                  alt={event.titre}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500 brightness-95 hover:brightness-100"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-slate-900">{event.titre}</h3>
                  <span className="text-sm font-medium text-green-600">
                    {event.placesDisponibles} places
                  </span>
                </div>
                <p className="text-slate-600 mb-4">{event.description}</p>
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    {event.lieu}
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
          ))}
        </div>
      </div>
    </section>
  );
}
