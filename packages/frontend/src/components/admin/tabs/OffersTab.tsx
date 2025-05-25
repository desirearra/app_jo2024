import { ConfirmDeleteModal, OffersSheet, OffersTable } from '@/components/admin';
import { Button } from '@/components/ui/button';
import * as React from 'react';

type Offer = {
  id: string;
  title: string;
  type: string;
  price: string;
  status: string;
  description: string;
  image: string;
};

type OffersTabProps = {
  data: Offer[];
  onAdd: (offer: Partial<Offer>) => void;
  onEdit: (offer: Offer) => void;
  onDelete: (offer: Offer) => void;
};

export function OffersTab({ data, onAdd, onEdit, onDelete }: OffersTabProps) {
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [sheetMode, setSheetMode] = React.useState<'add' | 'edit'>('add');
  const [selectedOffer, setSelectedOffer] = React.useState<Partial<Offer> | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [offerToDelete, setOfferToDelete] = React.useState<Partial<Offer> | null>(null);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Gestion des offres</h2>
        <Button
          variant="default"
          size="sm"
          onClick={() => {
            setSheetMode('add');
            setSelectedOffer(null);
            setSheetOpen(true);
          }}
        >
          Nouvelle offre
        </Button>
      </div>
      <OffersTable
        data={data}
        onEdit={offer => {
          setSheetMode('edit');
          setSelectedOffer(offer);
          setSheetOpen(true);
        }}
        onDelete={offer => {
          setOfferToDelete(offer);
          setDeleteModalOpen(true);
        }}
      />
      <OffersSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        offer={selectedOffer && selectedOffer.id ? (selectedOffer as Offer) : undefined}
        mode={sheetMode}
        onSubmit={sheetMode === 'edit' ? (onEdit as (offer: Partial<Offer>) => void) : onAdd}
      />
      <ConfirmDeleteModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={() => {
          if (offerToDelete && offerToDelete.id) onDelete(offerToDelete as Offer);
          setDeleteModalOpen(false);
        }}
        entityLabel="offre"
      />
    </div>
  );
}
