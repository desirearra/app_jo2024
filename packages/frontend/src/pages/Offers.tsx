import { OfferCard, type Offer } from '@/components/offers/OfferCard';
import { OfferFilters } from '@/components/offers/OfferFilters';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

// Mock data - à remplacer par l'appel API
const mockOffers: Offer[] = [
  {
    id: '1',
    type: 'day',
    title: 'Pass Solo (1 personne)',
    description: 'Accès à toutes les épreuves de la journée',
    price: 150,
    date: '2024-08-01',
    sport: 'Athlétisme',
    location: 'Stade de France',
    availableSeats: 100,
  },
  {
    id: '2',
    type: 'weekend',
    title: 'Pass Duo (2 personnes)',
    description: 'Accès à toutes les épreuves de la semaine',
    price: 250,
    date: '2024-08-03',
    sport: 'Natation',
    location: 'Centre Aquatique',
    availableSeats: 50,
  },
  {
    id: '3',
    type: 'week',
    title: 'Pass Familial (4 personnes)',
    description: 'Accès à toutes les épreuves et tous les événements de la semaine',
    price: 500,
    date: '2024-08-05',
    sport: 'Multi-sports',
    availableSeats: 20,
  },
  {
    id: '4',
    type: 'special',
    title: 'Pass Spécial - en solo',
    description: 'Accès à la finale du 100m hommes',
    price: 200,
    date: '2024-08-10',
    sport: 'Athlétisme',
    location: 'Stade de France',
    availableSeats: 0,
  },
];

export function OffersPage() {
  const [filters, setFilters] = useState<OfferFilters>({});
  const { toast } = useToast();
  const { addTicketToCart } = useApp();

  const filteredOffers = mockOffers.filter(offer => {
    if (filters.type && offer.type !== filters.type) return false;
    if (filters.sport && !offer.sport?.toLowerCase().includes(filters.sport.toLowerCase()))
      return false;
    if (filters.minPrice && offer.price < filters.minPrice) return false;
    if (filters.maxPrice && offer.price > filters.maxPrice) return false;
    if (filters.date && offer.date !== filters.date) return false;
    if (filters.location && !offer.location?.toLowerCase().includes(filters.location.toLowerCase()))
      return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        offer.title.toLowerCase().includes(searchLower) ||
        offer.description.toLowerCase().includes(searchLower) ||
        offer.sport?.toLowerCase().includes(searchLower) ||
        offer.location?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const handleAddToCart = (offer: Offer) => {
    // Adapter l'offre au format Ticket attendu par le panier
    const ticketData = {
      eventId: offer.id,
      passType: (offer.type === 'day' ? 'Solo' : offer.type === 'weekend' ? 'Duo' : 'Familial') as
        | 'Solo'
        | 'Duo'
        | 'Familial',
      sport: offer.sport || '',
      venue: offer.location || '',
      quantity: 1,
      price: offer.price,
      available: offer.availableSeats || 0,
    };
    const ok = addTicketToCart(ticketData);
    if (ok) {
      toast({
        title: 'Ajouté au panier',
        description: `${offer.title} a été ajouté à votre panier.`,
      });
    } else {
      toast({
        title: 'Erreur',
        description: `Impossible d'ajouter cette offre (limite atteinte ou plus de stock).`,
        variant: 'destructive',
      });
    }
  };

  return (
    <section className="flex flex-col h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="flex-1 container mx-auto px-8 py-10">
        {/* En-tête de section */}
        <div className="flex flex-col items-center my-16 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Billets officielles des JO Paris 2024
          </h2>
          <p className="text-xl text-slate-600 text-center max-w-3xl">
            Découvrez tous les billets officiels des Jeux Olympiques de Paris 2024.
          </p>
        </div>

        <div className="h-px bg-slate-200 my-8" />

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-1/4 flex-shrink-0">
            <OfferFilters filters={filters} onFilterChange={setFilters} />
          </aside>

          <main className="flex-grow">
            {filteredOffers.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {filteredOffers.map(offer => (
                  <div key={offer.id} className="w-full md:w-[48%]">
                    <OfferCard offer={offer} onAddToCart={handleAddToCart} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                Aucune offre ne correspond à vos critères
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}
