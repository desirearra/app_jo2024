import { OfferCard } from '@/components/offers/OfferCard';
import { OfferFilters } from '@/components/offers/OfferFilters';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { getOffers } from '@/lib/api';
import type { Offer } from '@/types';
import { useEffect, useState } from 'react';

// Fonction utilitaire pour convertir le type backend en PassType local (OfferCard)
function toPassTypeLabel(type: Offer['type']): 'day' | 'weekend' | 'week' | 'special' {
  switch (type) {
    case 'SOLO':
      return 'day';
    case 'DUO':
      return 'weekend';
    case 'FAMILY':
      return 'week';
    default:
      return 'special';
  }
}

export function OffersPage() {
  const [filters, setFilters] = useState<OfferFilters>({});
  const { toast } = useToast();
  const { addTicketToCart } = useApp();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getOffers<Offer[]>()
      .then(data => setOffers(Array.isArray(data) ? data : []))
      .catch(() => setError('Erreur lors du chargement des offres'))
      .finally(() => setLoading(false));
  }, []);

  const filteredOffers = offers.filter(offer => {
    if (filters.type && toPassTypeLabel(offer.type) !== filters.type) return false;
    if (filters.sport && !offer.name.toLowerCase().includes(filters.sport.toLowerCase()))
      return false;
    if (filters.minPrice && Number(offer.price) < filters.minPrice) return false;
    if (filters.maxPrice && Number(offer.price) > filters.maxPrice) return false;
    if (filters.date && offer.createdAt.slice(0, 10) !== filters.date) return false;
    if (
      filters.location &&
      offer.eventId &&
      !offer.eventId.toLowerCase().includes(filters.location.toLowerCase())
    )
      return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        offer.name.toLowerCase().includes(searchLower) ||
        offer.description.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const handleAddToCart = (offer: Offer) => {
    let passType: 'Solo' | 'Duo' | 'Familial' = 'Solo';
    if (offer.type === 'DUO') passType = 'Duo';
    else if (offer.type === 'FAMILY') passType = 'Familial';
    const ticketData = {
      eventId: offer.eventId || '',
      offerId: offer.id,
      passType,
      sport: offer.name,
      venue: '',
      quantity: 1,
      price: Number(offer.price),
      available: offer.seats,
    };
    const ok = addTicketToCart(ticketData);
    if (ok) {
      toast({
        title: 'Ajouté au panier',
        description: `${offer.name} a été ajouté à votre panier.`,
      });
    } else {
      toast({
        title: 'Erreur',
        description: `Impossible d'ajouter cette offre (limite par personnes atteinte).`,
        variant: 'destructive',
      });
    }
  };

  return (
    <section className="flex flex-col min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="flex-1 container mx-auto px-8 py-10">
        {/* En-tête de section */}
        <div className="flex flex-col items-center my-16 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Billets officiels des JO Paris 2024
          </h2>
          <p className="text-xl text-slate-600 text-center max-w-3xl">
            Découvrez tous les billets officiels des Jeux Olympiques de Paris 2024.
          </p>
        </div>

        <div className="h-px bg-slate-200 my-8" />

        {/* Filtres en haut, sur toute la largeur */}
        <div className="mb-8 w-full">
          <OfferFilters filters={filters} onFilterChange={setFilters} />
        </div>

        {/* Liste des offres */}
        <main className="flex-grow">
          {loading ? (
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              Chargement des offres...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-40 text-red-500">{error}</div>
          ) : filteredOffers.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {filteredOffers.map(offer => (
                <div key={offer.id} className="w-full max-w-[32%]">
                  <OfferCard
                    offer={{
                      id: offer.id,
                      type: toPassTypeLabel(offer.type),
                      title: offer.name,
                      description: offer.description,
                      price: Number(offer.price),
                      date: offer.createdAt.slice(0, 10),
                      location: '',
                      sport: '',
                      availableSeats: offer.seats,
                    }}
                    onAddToCart={() => handleAddToCart(offer)}
                  />
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
    </section>
  );
}
