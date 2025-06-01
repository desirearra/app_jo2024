import { ConfirmDeleteModal, OffersSheet, OffersTable } from '@/components/admin';
import { Button } from '@/components/ui/button';
import type { Event, Offer } from '@/types';
import * as React from 'react';

type OffersTabProps = {
  data: Offer[];
  onAdd: (offer: unknown) => void | Promise<void>;
  onEdit: (offer: Offer) => void;
  onDelete: (offer: Offer) => void;
  onDisable: (offer: Offer) => void;
  events: Event[];
};

export function OffersTab({ data, onAdd, onEdit, onDelete, onDisable, events }: OffersTabProps) {
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [sheetMode, setSheetMode] = React.useState<'add' | 'edit'>('add');
  const [selectedOffer, setSelectedOffer] = React.useState<Offer | null>(null);
  const [actionModalOpen, setActionModalOpen] = React.useState(false);
  const [offerToAction, setOfferToAction] = React.useState<Offer | null>(null);
  const [pendingAction, setPendingAction] = React.useState<'disable' | 'delete' | null>(null);
  const [choiceOpen, setChoiceOpen] = React.useState(false);

  // Popin de choix d'action (désactiver/supprimer)
  const renderChoiceMenu = () => (
    <>
      {choiceOpen && offerToAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-xs flex flex-col gap-4">
            <h3 className="text-lg font-semibold mb-2">Action sur l&apos;offre</h3>
            <Button
              variant={'default'}
              onClick={() => {
                setPendingAction('disable');
                setChoiceOpen(false);
                setActionModalOpen(true);
              }}
              className="w-full"
            >
              {offerToAction?.isDeleted ? 'Restaurer' : 'Désactiver'}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setPendingAction('delete');
                setChoiceOpen(false);
                setActionModalOpen(true);
              }}
              className="w-full"
            >
              Supprimer définitivement
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setChoiceOpen(false);
                setOfferToAction(null);
              }}
              className="w-full"
            >
              Annuler
            </Button>
          </div>
        </div>
      )}
    </>
  );

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
        onAction={offer => {
          setOfferToAction(offer);
          setPendingAction(null);
          setChoiceOpen(true);
        }}
      />
      <OffersSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        offer={selectedOffer && selectedOffer.id ? selectedOffer : undefined}
        mode={sheetMode}
        onSubmit={
          sheetMode === 'edit'
            ? data => {
                if (selectedOffer && selectedOffer.id) {
                  onEdit({ ...data, id: selectedOffer.id } as Offer);
                }
              }
            : onAdd
        }
        events={events}
      />
      {renderChoiceMenu()}
      <ConfirmDeleteModal
        open={actionModalOpen}
        onOpenChange={open => {
          setActionModalOpen(open);
          if (!open) {
            setPendingAction(null);
            setOfferToAction(null);
          }
        }}
        onConfirm={() => {
          if (offerToAction && pendingAction) {
            if (pendingAction === 'disable') {
              onDisable(offerToAction);
            }
            if (pendingAction === 'delete') {
              onDelete(offerToAction);
            }
          }
          setActionModalOpen(false);
          setPendingAction(null);
          setOfferToAction(null);
        }}
        entityLabel={offerToAction ? `l'offre « ${offerToAction.name} »` : 'cette offre'}
        actionLabel={
          pendingAction === 'disable'
            ? offerToAction?.isDeleted
              ? 'Restaurer'
              : 'Désactiver'
            : 'Supprimer définitivement'
        }
        actionVariant={
          pendingAction === 'disable'
            ? offerToAction?.isDeleted
              ? 'default'
              : 'destructive'
            : 'destructive'
        }
        confirmMessage={
          pendingAction === 'disable'
            ? offerToAction?.isDeleted
              ? `Voulez-vous vraiment restaurer l'offre « ${offerToAction?.name ?? ''} » ?`
              : `Voulez-vous vraiment désactiver l'offre « ${offerToAction?.name ?? ''} » ?`
            : `Voulez-vous vraiment supprimer définitivement l'offre « ${offerToAction?.name ?? ''} » ?`
        }
      />
    </div>
  );
}
