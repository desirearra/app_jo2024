import { OfferCard } from '@/components/offers/OfferCard';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { getEvents, getOffersByEventId } from '@/lib/api';
import type { Offer as ApiOffer, Event, PassType } from '@/types';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export function EventDetailsPage() {
  const { id } = useParams();
  const { addTicketToCart } = useApp();
  const { toast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [offers, setOffers] = useState<ApiOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([getEvents<Event[]>(), getOffersByEventId<ApiOffer[]>(id)])
      .then(([eventsData]) => {
        const found = (Array.isArray(eventsData) ? eventsData : []).find(e => e.id === id);
        setEvent(found ?? null);
        setOffers(Array.isArray(found?.offers) ? found?.offers : []);
        if (!found) setError('Événement introuvable');
      })
      .catch(() => setError("Erreur lors du chargement de l'événement ou des offres"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = (offer: ApiOffer) => {
    if (!event) return;
    let passType: PassType = 'Solo';
    if (offer.type === 'DUO') passType = 'Duo';
    else if (offer.type === 'FAMILY') passType = 'Familial';
    const ticketData = {
      eventId: event.id,
      offerId: offer.id,
      passType,
      sport: event.sport,
      venue: event.location,
      quantity: 1,
      price: Number(offer.price),
      available: offer.seats,
    };
    const ok = addTicketToCart(ticketData);
    if (ok) {
      toast({
        title: 'Ajouté au panier',
        description: `${offer.name} ajouté à votre panier.`,
      });
    } else {
      toast({
        title: 'Erreur',
        description: `Impossible d'ajouter cette offre (limite atteinte ou plus de stock).`,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 animate-fade-in">Chargement de l&apos;événement...</div>
    );
  }
  if (error || !event) {
    return (
      <div className="text-center py-12 text-red-500 animate-fade-in">
        {error ?? 'Événement introuvable'}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Lien de retour */}
      <div className="absolute top-8 left-[23rem] z-20">
        <Link
          to="/evenements"
          className="inline-flex items-center text-white hover:text-black-200 font-medium bg-black/40 rounded-full px-4 py-2 shadow-lg backdrop-blur transition-colors"
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Retour à la liste des événements
        </Link>
      </div>

      {/* Hero Section */}
      <div className="relative h-[50vh] overflow-hidden">
        <img
          src={event.image ?? '/default-event.jpg'}
          alt={event.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <div className="max-w-4xl animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{event.name}</h1>
              <p className="text-xl text-white/90 max-w-2xl">{event.description}</p>
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
            {/* On pourrait ajouter une description longue si disponible plus tard */}
            <p className="text-lg text-slate-600 mb-8">{event.description}</p>
          </div>

          {/* Colonne de droite - Informations pratiques */}
          <div className="lg:col-span-1 animate-fade-in-up [animation-delay:400ms]">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Informations pratiques</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                    <svg
                      className="w-6 h-6 text-black-600"
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
                    <p className="text-sm text-slate-500">Date</p>
                    <p className="text-slate-900">
                      {new Date(event.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                    <svg
                      className="w-6 h-6 text-black-600"
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
                    <p className="text-slate-900">{event.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Offres */}
      <div className="container mx-auto px-4 py-12">
        <div className="animate-fade-in-up [animation-delay:600ms]">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">
            Offres disponibles pour cet événement
          </h2>
          {offers.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {offers.map(offer => (
                <div key={offer.id} className="w-full max-w-[32%]">
                  <OfferCard
                    key={offer.id}
                    offer={{
                      id: offer.id,
                      type:
                        offer.type === 'SOLO'
                          ? 'day'
                          : offer.type === 'DUO'
                            ? 'weekend'
                            : offer.type === 'FAMILY'
                              ? 'week'
                              : 'special',
                      title: offer.name,
                      description: offer.description,
                      price: Number(offer.price),
                      date: offer.createdAt.slice(0, 10),
                      location: event.location,
                      sport: event.sport,
                      availableSeats: offer.seats,
                    }}
                    onAddToCart={() => handleAddToCart(offer)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-500 py-8">
              Aucune offre disponible pour cet événement.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
