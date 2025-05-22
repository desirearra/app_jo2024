import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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

const passTypeLabels: Record<PassType, string> = {
  day: 'Pass Journée',
  weekend: 'Pass Week-end',
  week: 'Pass Semaine',
  special: 'Pass Spécial',
};

export function OfferCard({ offer, onAddToCart }: OfferCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col gap-2 justify-between items-start">
          <CardTitle className="text-xl font-bold">{offer.title}</CardTitle>
          <Badge variant="secondary">{passTypeLabels[offer.type]}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{offer.description}</p>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{offer.date}</Badge>
            {offer.location && <Badge variant="outline">{offer.location}</Badge>}
            {offer.sport && <Badge variant="outline">{offer.sport}</Badge>}
          </div>
          <p className="text-lg font-bold">{formatPrice(offer.price)}</p>
          <p className="text-sm text-muted-foreground">{offer.availableSeats} places disponibles</p>
        </div>
      </CardContent>
      <CardFooter>
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
