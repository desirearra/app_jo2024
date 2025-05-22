import { OfferCard, type Offer } from '@/components/offers/OfferCard';
import { OfferFilters } from '@/components/offers/OfferFilters';
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
    // TODO: Implémenter l'ajout au panier
    toast({
      title: 'Ajouté au panier',
      description: `${offer.title} a été ajouté à votre panier.`,
    });
  };

  return (
    <section className="flex flex-col h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="flex-1 container mx-auto px-8 py-10">
        <h1 className="text-3xl font-bold mb-8">Offres JO 2024</h1>

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
