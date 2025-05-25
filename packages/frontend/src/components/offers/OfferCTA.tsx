interface OfferCTAProps {
  offerId: string;
}

export function OfferCTA({ offerId }: OfferCTAProps) {
  return (
    <div>
      <button>Ajouter au panier (ID: {offerId})</button>
    </div>
  );
}
