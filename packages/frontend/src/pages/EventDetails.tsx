import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';

// Mock data - à remplacer par l'appel API
const eventDetails = {
  id: 'athletics',
  title: 'Athlétisme au Stade de France',
  description:
    'Vivez les performances exceptionnelles des meilleurs athlètes mondiaux dans ce temple mythique du sport français. Places limitées !',
  longDescription:
    "Les épreuves d'athlétisme des Jeux Olympiques 2024 se dérouleront dans l'emblématique Stade de France. Vous pourrez assister aux performances des plus grands athlètes mondiaux dans des disciplines telles que le 100m, le saut en hauteur, le lancer du javelot et bien d'autres. Une expérience unique dans une ambiance électrique !",
  image:
    'https://plus.unsplash.com/premium_photo-1661868906940-5d8443acf49e?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  date: '2024-08-01',
  time: '14:00',
  location: 'Stade de France, Saint-Denis',
  capacity: 80000,
  availableSeats: 5000,
  category: 'Athlétisme',
  features: [
    'Places assises numérotées',
    'Vue imprenable sur la piste',
    'Écrans géants',
    'Accès PMR',
    'Restauration sur place',
  ],
};

// Mock data pour les pass disponibles
const availablePasses = [
  {
    id: 'pass-solo',
    type: 'Pass Solo',
    description: 'Accès pour 1 personne à cet événement',
    price: 95,
    features: [
      'Place assise numérotée',
      'Accès à la session complète',
      'Programme officiel offert',
      'Accès aux zones de restauration',
    ],
    capacity: 1,
  },
  {
    id: 'pass-duo',
    type: 'Pass Duo',
    description: 'Accès pour 2 personnes à cet événement',
    price: 180,
    features: [
      '2 places assises côte à côte',
      'Accès à la session complète',
      '2 programmes officiels offerts',
      'Accès aux zones de restauration',
      'Réduction duo appliquée',
    ],
    capacity: 2,
  },
  {
    id: 'pass-familial',
    type: 'Pass Familial',
    description: 'Accès pour 4 personnes à cet événement',
    price: 320,
    features: [
      '4 places assises groupées',
      'Accès à la session complète',
      '4 programmes officiels offerts',
      'Accès aux zones de restauration',
      'Réduction famille appliquée',
      "Accès prioritaire aux files d'attente",
    ],
    capacity: 4,
  },
];

// TODO: À remplacer par le vrai context du panier
const useCart = () => {
  return {
    addToCart: (passId: string) => {
      console.log('Ajout au panier:', passId);
    },
  };
};

export function EventDetailsPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  // TODO: Utiliser l'id pour charger les détails de l'événement depuis l'API
  console.log("Chargement des détails de l'événement:", id);

  return (
    <div className="flex flex-col gap-12 min-h-screen bg-gradient-to-b from-white to-slate-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Image Section */}
          <div className="relative overflow-hidden rounded-2xl shadow-xl">
            <img src={eventDetails.image} alt={eventDetails.title} className="w-full h-full" />
          </div>

          {/* Content Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">{eventDetails.title}</h1>
              <p className="text-lg text-slate-600">{eventDetails.longDescription}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>
                  {eventDetails.date} à {eventDetails.time}
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <span>{eventDetails.location}</span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h2 className="text-xl font-semibold mb-4">Caractéristiques</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {eventDetails.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-slate-700">
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* <div className="border-t border-slate-200 pt-6">
              <h2 className="text-xl font-semibold mb-4">Description détaillée</h2>
              <p className="text-slate-600">{eventDetails.longDescription}</p>
            </div> */}
          </div>
        </motion.div>
      </div>

      {/* Section des pass disponibles */}
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-8">
            Pass disponibles pour cet événement
          </h2>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            {availablePasses.map(pass => (
              <motion.div
                key={pass.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 max-w-md bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">{pass.type}</h3>
                      <p className="text-slate-600 mt-1">{pass.description}</p>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{pass.price} €</div>
                  </div>
                  <ul className="space-y-3 mb-6 flex-grow">
                    {pass.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-slate-700">
                        <svg
                          className="w-5 h-5 text-blue-500 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => addToCart(pass.id)}
                    className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    Ajouter au panier
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
