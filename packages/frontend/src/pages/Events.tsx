import { motion } from 'framer-motion';
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
    id: 'evt-athletisme-1',
    titre: 'Athlétisme au Stade de France',
    description:
      "Les finales des épreuves d'athlétisme avec les meilleurs athlètes mondiaux dans ce temple mythique du sport français. Places limitées !",
    date: '2024-08-01',
    lieu: 'Stade de France',
    image:
      'https://plus.unsplash.com/premium_photo-1661868906940-5d8443acf49e?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categorie: 'Athlétisme',
    placesDisponibles: 200,
  },
  {
    id: 'evt-natation-1',
    titre: 'Natation à La Défense Arena',
    description:
      "Soyez aux premières loges pour voir naître de nouveaux records olympiques dans la plus grande salle d'Europe !",
    date: '2024-08-02',
    lieu: 'Centre Aquatique',
    image: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?q=80&w=1920',
    categorie: 'Natation',
    placesDisponibles: 150,
  },
  {
    id: 'evt-gymnastique-1',
    titre: 'Gymnastique à Bercy',
    description:
      "Réservez vos places pour assister aux performances spectaculaires des meilleurs gymnastes du monde à l'Accor Arena !",
    date: '2024-08-03',
    lieu: 'Arena Bercy',
    image:
      'https://plus.unsplash.com/premium_photo-1721755913670-5d20e710df72?q=80&w=1024&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categorie: 'Gymnastique',
    placesDisponibles: 100,
  },
];

const categories = [...new Set(events.map(event => event.categorie))];

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-16"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Événements JO Paris 2024</h2>
          <p className="text-xl text-slate-600 text-center max-w-3xl">
            Découvrez tous les événements des Jeux Olympiques et réservez vos places dès maintenant.
          </p>
        </motion.div>

        {/* Filtres et recherche */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Rechercher un événement..."
            className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <select
            className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            <option value="">Toutes les catégories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Section Sports */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex-1 relative overflow-hidden rounded-2xl shadow-lg bg-white hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <motion.img
                  src={event.image}
                  alt={event.titre}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 brightness-95 group-hover:brightness-100"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-6 text-white">
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full">
                  <span className="text-sm font-semibold text-slate-900">{event.categorie}</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">{event.titre}</h3>
                <p className="text-sm text-white/90 line-clamp-2 mb-4">{event.description}</p>
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center text-white/90">
                    <svg
                      className="w-5 h-5 mr-2"
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
                  <div className="flex items-center text-white/90">
                    <svg
                      className="w-5 h-5 mr-2"
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
                    {event.lieu}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="self-start px-6 py-2.5 bg-white text-slate-900 rounded-full text-sm font-semibold inline-flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors"
                  >
                    <Link to={`/evenements/${event.id}`} className="flex items-center gap-2">
                      <>
                        Découvrir l&apos;événement
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
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </>
                    </Link>
                  </motion.button>
                  <span className="text-sm text-white/90">
                    {event.placesDisponibles} places disponibles
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
