import { Button } from '@/components/ui/button';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import type { Event, Offer } from '@/types';
import * as React from 'react';

type OffersSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer?: Offer | null;
  mode: 'edit' | 'add';
  onSubmit: (offer: Omit<Offer, 'id'>) => void;
  events: Event[];
};

export type OfferForm = {
  name: string;
  description: string;
  type: 'SOLO' | 'DUO' | 'FAMILY';
  price: string;
  seats: number;
  eventId?: string;
};

export function OffersSheet({
  open,
  onOpenChange,
  offer,
  mode,
  onSubmit,
  events,
}: OffersSheetProps) {
  const [form, setForm] = React.useState<OfferForm>({
    name: offer?.name || '',
    description: offer?.description || '',
    type: offer?.type || 'SOLO',
    price: offer?.price || '',
    seats: offer?.seats || 1,
    eventId: offer?.eventId || '',
  });

  React.useEffect(() => {
    if (offer && mode === 'edit') {
      setForm({
        name: offer.name,
        description: offer.description,
        type: offer.type,
        price: offer.price,
        seats: offer.seats,
        eventId: offer.eventId || '',
      });
    } else if (mode === 'add') {
      setForm({
        name: '',
        description: '',
        type: 'SOLO',
        price: '',
        seats: 1,
        eventId: '',
      });
    }
  }, [offer, mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: name === 'seats' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const offerToSend: Omit<Offer, 'id'> = {
      name: form.name,
      description: form.description,
      type: form.type,
      price: form.price,
      seats: form.seats,
      eventId: form.eventId || null,
      isActive: true,
      createdAt: offer?.createdAt || now,
      updatedAt: now,
      isDeleted: offer?.isDeleted ?? false,
    };
    onSubmit(offerToSend);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <DialogTitle asChild>
          <h2 className="text-xl font-bold mb-2">
            {mode === 'edit' ? "Édition de l'offre" : 'Nouvelle offre'}
          </h2>
        </DialogTitle>
        <DialogDescription>
          {mode === 'edit' ? "Modifiez les informations de l'offre." : 'Créez une nouvelle offre.'}
        </DialogDescription>
        <div className="h-px bg-slate-200 my-4" />
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1">
            <span className="font-medium">Nom</span>
            <Input
              aria-label="Nom"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-medium">Description</span>
            <textarea
              aria-label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              className="border rounded px-2 py-1 min-h-[60px]"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-medium">Type</span>
            <select
              aria-label="Type"
              name="type"
              value={form.type}
              onChange={handleSelectChange}
              required
              className="border rounded px-2 py-1"
            >
              <option value="SOLO">SOLO</option>
              <option value="DUO">DUO</option>
              <option value="FAMILY">FAMILY</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-medium">Prix (€)</span>
            <Input
              aria-label="Prix"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              type="number"
              min="0"
              step="0.01"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-medium">Nombre de places</span>
            <Input
              aria-label="Nombre de places"
              name="seats"
              value={form.seats}
              onChange={handleChange}
              required
              type="number"
              min="1"
              step="1"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-medium">Événement associé</span>
            <select
              aria-label="Événement"
              name="eventId"
              value={form.eventId}
              onChange={handleSelectChange}
              required
              className="border rounded px-2 py-1"
            >
              <option value="">Sélectionner un événement</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>
                  {event.name} ({new Date(event.date).toLocaleDateString('fr-FR')})
                </option>
              ))}
            </select>
          </label>
          <Button type="submit" variant="default" className="mt-4">
            {mode === 'edit' ? 'Enregistrer' : 'Créer'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
