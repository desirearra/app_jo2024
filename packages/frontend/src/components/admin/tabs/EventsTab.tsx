import { ConfirmDeleteModal } from '@/components/admin';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import type { Event } from '@/types';
import { Pencil, Trash } from 'lucide-react';
import * as React from 'react';

type EventsTabProps = {
  data: Event[];
  onAdd: (event: Partial<Event>) => void;
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
};

export function EventsTab({ data, onAdd, onEdit, onDelete }: EventsTabProps) {
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [sheetMode, setSheetMode] = React.useState<'add' | 'edit'>('add');
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [eventToDelete, setEventToDelete] = React.useState<Event | null>(null);

  const columns = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'title', header: 'Titre' },
    { accessorKey: 'date', header: 'Date' },
    { accessorKey: 'lieu', header: 'Lieu' },
    { accessorKey: 'price', header: 'Prix' },
    { accessorKey: 'status', header: 'Statut' },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            aria-label="Éditer"
            onClick={() => {
              setSheetMode('edit');
              setSelectedEvent(row.original);
              setSheetOpen(true);
            }}
          >
            <Pencil className="h-4 w-4 mr-1" />
            Éditer
          </Button>
          <Button
            size="sm"
            variant="destructive"
            aria-label="Supprimer"
            onClick={() => {
              setEventToDelete(row.original);
              setDeleteModalOpen(true);
            }}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Gestion des événements</h2>
        <Button
          variant="default"
          size="sm"
          onClick={() => {
            setSheetMode('add');
            setSelectedEvent(null);
            setSheetOpen(true);
          }}
        >
          Nouvel événement
        </Button>
      </div>
      <DataTable columns={columns} data={data} searchPlaceholder="Rechercher un événement..." />
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <DialogTitle asChild>
            <h2 className="text-xl font-bold mb-2">
              {sheetMode === 'edit' ? "Édition de l'événement" : 'Nouvel événement'}
            </h2>
          </DialogTitle>
          <DialogDescription>
            {sheetMode === 'edit'
              ? "Modifiez les informations de l'événement."
              : 'Créez un nouvel événement.'}
          </DialogDescription>
          <div className="h-px bg-slate-200 my-4" />
          <form className="flex flex-col gap-4">
            <label className="flex flex-col gap-1">
              <span className="font-medium">Titre</span>
              <Input value={selectedEvent?.title ?? ''} readOnly className="bg-slate-100" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-medium">Date</span>
              <Input value={selectedEvent?.date ?? ''} readOnly className="bg-slate-100" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-medium">Lieu</span>
              <Input value={selectedEvent?.lieu ?? ''} readOnly className="bg-slate-100" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-medium">Prix</span>
              <Input value={selectedEvent?.price ?? ''} readOnly className="bg-slate-100" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-medium">Statut</span>
              <Input value={selectedEvent?.status ?? ''} readOnly className="bg-slate-100" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-medium">Description</span>
              <Input value={selectedEvent?.description ?? ''} readOnly className="bg-slate-100" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-medium">Image</span>
              <Input value={selectedEvent?.image ?? ''} readOnly className="bg-slate-100" />
            </label>
          </form>
        </SheetContent>
      </Sheet>
      <ConfirmDeleteModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={() => {
          if (eventToDelete) onDelete(eventToDelete);
          setDeleteModalOpen(false);
        }}
        entityLabel="événement"
      />
    </div>
  );
}
