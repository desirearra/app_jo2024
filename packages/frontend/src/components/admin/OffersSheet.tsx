import { Button } from '@/components/ui/button';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import * as React from 'react';

type Offer = {
  id: string;
  title: string;
  type: string;
  price: string;
  status: string;
};

type OffersSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer?: Offer | null;
  mode: 'edit' | 'add';
  onSubmit: (offer: Omit<Offer, 'id'>) => void;
};

export function OffersSheet({ open, onOpenChange, offer, mode, onSubmit }: OffersSheetProps) {
  const [form, setForm] = React.useState<Omit<Offer, 'id'>>({
    title: offer?.title || '',
    type: offer?.type || '',
    price: offer?.price || '',
    status: offer?.status || 'Publié',
  });

  React.useEffect(() => {
    if (offer && mode === 'edit') {
      setForm({
        title: offer.title,
        type: offer.type,
        price: offer.price,
        status: offer.status,
      });
    } else if (mode === 'add') {
      setForm({ title: '', type: '', price: '', status: 'Publié' });
    }
  }, [offer, mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
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
        <form
          className="flex flex-col gap-4"
          onSubmit={e => {
            e.preventDefault();
            onSubmit(form);
          }}
        >
          <label className="flex flex-col gap-1">
            <span className="font-medium">Titre</span>
            <Input
              aria-label="Titre"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-medium">Type</span>
            <Input
              aria-label="Type"
              name="type"
              value={form.type}
              onChange={handleChange}
              required
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-medium">Prix</span>
            <Input
              aria-label="Prix"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-medium">Statut</span>
            <Select value={form.status} onValueChange={status => setForm(f => ({ ...f, status }))}>
              <SelectTrigger aria-label="Statut">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Publié">Publié</SelectItem>
                <SelectItem value="Brouillon">Brouillon</SelectItem>
              </SelectContent>
            </Select>
          </label>
          <Button type="submit" variant="default" className="mt-4">
            {mode === 'edit' ? 'Enregistrer' : 'Créer'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
