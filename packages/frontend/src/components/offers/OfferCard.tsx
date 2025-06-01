import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';

export type PassType = 'day' | 'weekend' | 'week' | 'special';

export interface Offer {
  id: string;
  type: PassType;
  title: string;
  description: string;
  price: number;
  date: string;
  location?: string;
  sport?: string;
  availableSeats: number;
}

interface OfferCardProps {
  offer: Offer;
  onAddToCart: (offer: Offer) => void;
}

// Liste statique des avantages par type de pass
const featuresByType: Record<PassType, string[]> = {
  day: [
    'Accès à toutes les épreuves de la journée',
    'Place assise en tribune latérale',
    'Accès aux services de base',
  ],
  weekend: [
    'Accès à toutes les épreuves du week-end',
    'Place assise en tribune principale',
    'Accès salon VIP',
    'Restauration incluse',
  ],
  week: [
    'Accès à toutes les épreuves de la semaine',
    'Loge privative',
    'Service personnalisé',
    'Restauration gastronomique',
    'Accès coulisses',
    'Parking VIP',
  ],
  special: ['Accès à la finale', 'Place premium', 'Cadeau souvenir'],
};

const MAX_FEATURES = 6;
const GENERIC_FEATURES = [
  'Avantage exclusif',
  'Accès prioritaire',
  'service premium',
  'Assistance dédiée',
  'Expérience personnalisée',
];

export function OfferCard({ offer, onAddToCart }: OfferCardProps) {
  return (
    <Card className="w-full max-w-md bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <CardTitle className="text-xl font-semibold text-slate-900">{offer.title}</CardTitle>
          <p className="text-slate-600 mt-1">{offer.description}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-2xl font-bold text-slate-900">{formatPrice(offer.price)}</span>
        </div>
      </div>
      {/* Avantages (features) */}
      <ul className="space-y-2 mb-4">
        {Array.from({ length: MAX_FEATURES }).map((_, i) => {
          const feature =
            featuresByType[offer.type]?.[i] ?? GENERIC_FEATURES[i % GENERIC_FEATURES.length];
          return (
            <li key={feature + i} className="flex items-center gap-2 text-slate-700">
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
          );
        })}
      </ul>
      {/* Nombre de places restantes (texte simple) */}
      <div className="text-base text-slate-700 font-semibold mb-2">
        {offer.availableSeats} place{offer.availableSeats > 1 ? 's' : ''} restante
        {offer.availableSeats > 1 ? 's' : ''}
      </div>
      <div className="flex-grow" />
      <CardFooter className="mt-6 p-0">
        <Button
          className="w-full"
          onClick={() => onAddToCart(offer)}
          disabled={offer.availableSeats === 0}
        >
          {offer.availableSeats > 0 ? 'Ajouter au panier' : 'Complet'}
        </Button>
      </CardFooter>
    </Card>
  );
}
