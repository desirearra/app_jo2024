import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
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
    id: 'pass-standard',
    type: 'Pass Standard',
    description: 'Place assise en tribune latérale',
    price: 95,
    features: ['Place numérotée', 'Vue dégagée', 'Accès aux services de base'],
  },
  {
    id: 'pass-premium',
    type: 'Pass Premium',
    description: 'Place assise en tribune principale',
    price: 195,
    features: [
      'Place numérotée premium',
      'Vue imprenable',
      'Accès salon VIP',
      'Restauration incluse',
    ],
  },
  {
    id: 'pass-vip',
    type: 'Pass VIP',
    description: 'Expérience exclusive en loge',
    price: 495,
    features: [
      'Loge privative',
      'Service personnalisé',
      'Restauration gastronomique',
      'Accès coulisses',
      'Parking VIP',
    ],
  },
];

export function EventDetailsPage() {
  const { id } = useParams();
  const { addTicketToCart } = useApp();
  const { toast } = useToast();

  // TODO: Utiliser l'id pour charger les détails de l'événement depuis l'API
  console.log("Chargement des détails de l'événement:", id);

  const handleAddToCart = (pass: (typeof availablePasses)[number]) => {
    const ticketData = {
      eventId: eventDetails.id,
      passType:
        pass.type === 'Pass Standard'
          ? 'Solo'
          : pass.type === 'Pass Premium'
            ? 'Duo'
            : ('Familial' as 'Solo' | 'Duo' | 'Familial'),
      sport: eventDetails.category,
      venue: eventDetails.location,
      quantity: 1,
      price: pass.price,
      available: eventDetails.availableSeats,
    };
    const ok = addTicketToCart(ticketData);
    if (ok) {
      toast({
        title: 'Ajouté au panier',
        description: `${pass.type} ajouté à votre panier.`,
      });
    } else {
      toast({
        title: 'Erreur',
        description: `Impossible d'ajouter ce pass (limite atteinte ou plus de stock).`,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Hero Section */}
      <div className="relative h-[50vh] overflow-hidden">
        <img
          src={eventDetails.image}
          alt={eventDetails.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <div className="max-w-4xl animate-fade-in-up">
              <div className="mb-4">
                <span className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full">
                  {eventDetails.category}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {eventDetails.title}
              </h1>
              <p className="text-xl text-white/90 max-w-2xl">{eventDetails.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Informations détaillées */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne de gauche - Description */}
          <div className="lg:col-span-2 animate-fade-in-up [animation-delay:200ms]">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">À propos de l&apos;événement</h2>
            <p className="text-lg text-slate-600 mb-8">{eventDetails.longDescription}</p>

            <h3 className="text-2xl font-bold text-slate-900 mb-4">Caractéristiques</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {eventDetails.features.map((feature, index) => (
                <li
                  key={feature}
                  className="flex items-center gap-3 animate-fade-in-up"
                  style={{ animationDelay: `${400 + index * 100}ms` }}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <svg
                      className="w-5 h-5 text-blue-600"
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
                  </div>
                  <span className="text-slate-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne de droite - Informations pratiques */}
          <div className="lg:col-span-1 animate-fade-in-up [animation-delay:400ms]">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Informations pratiques</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <svg
                      className="w-6 h-6 text-blue-600"
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
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Date et heure</p>
                    <p className="text-slate-900">
                      {new Date(eventDetails.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}{' '}
                      à {eventDetails.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <svg
                      className="w-6 h-6 text-blue-600"
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
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Lieu</p>
                    <p className="text-slate-900">{eventDetails.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Places disponibles</p>
                    <p className="text-slate-900">
                      {eventDetails.availableSeats} sur {eventDetails.capacity}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Pass */}
      <div className="container mx-auto px-4 py-12">
        <div className="animate-fade-in-up [animation-delay:600ms]">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-8">
            Pass disponibles pour cet événement
          </h2>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            {availablePasses.map((pass, index) => (
              <div
                key={pass.id}
                className="flex-1 max-w-md bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow animate-fade-in-up"
                style={{ animationDelay: `${800 + index * 100}ms` }}
              >
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">{pass.type}</h3>
                      <p className="text-slate-600 mt-1">{pass.description}</p>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{pass.price} €</div>
                  </div>
                  <ul className="flex-1 space-y-3 mb-6">
                    {pass.features.map(feature => (
                      <li key={feature} className="flex items-center gap-2 text-slate-700">
                        <svg
                          className="w-5 h-5 text-green-500 flex-shrink-0"
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
                  <Button onClick={() => handleAddToCart(pass)} className="w-full">
                    Ajouter au panier
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
