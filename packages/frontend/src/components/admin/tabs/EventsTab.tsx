import { ConfirmDeleteModal } from '@/components/admin';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import type { Event } from '@/types';
import { Pencil } from 'lucide-react';
import * as React from 'react';

type EventsTabProps = {
  data: Event[];
  onAdd: (event: Omit<Event, 'id'>) => void | Promise<void>;
  onEdit: (event: Event) => void | Promise<void>;
  onDelete: (event: Event) => void | Promise<void>;
  onDisable: (event: Event) => void | Promise<void>;
};

export function EventsTab({ data, onAdd, onEdit, onDelete, onDisable }: EventsTabProps) {
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [sheetMode, setSheetMode] = React.useState<'add' | 'edit'>('add');
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
  const [actionModalOpen, setActionModalOpen] = React.useState(false);
  const [eventToAction, setEventToAction] = React.useState<Event | null>(null);
  const [pendingAction, setPendingAction] = React.useState<'disable' | 'delete' | null>(null);
  const [choiceOpen, setChoiceOpen] = React.useState(false);

  const columns = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Titre' },
    {
      id: 'date',
      header: 'Date',
      cell: ({ row }: { row: { original: Event } }) =>
        new Date(row.original.date).toLocaleDateString('fr-FR'),
    },
    { accessorKey: 'location', header: 'Lieu' },
    {
      id: 'status',
      header: 'Statut',
      cell: ({ row }: { row: { original: Event } }) =>
        row.original.isDeleted ? 'Fermé' : 'Ouvert',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: { original: Event } }) => (
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
            aria-label="Actions"
            onClick={() => {
              setEventToAction(row.original);
              setPendingAction(null);
              setChoiceOpen(true);
            }}
          >
            Actions
          </Button>
        </div>
      ),
    },
  ];

  // Form state pour add/edit
  const [form, setForm] = React.useState<Omit<Event, 'id'>>({
    name: '',
    description: '',
    sport: '',
    location: '',
    date: '',
    image: '',
    createdAt: '',
    updatedAt: '',
    isDeleted: false,
    offers: [],
  });

  React.useEffect(() => {
    if (sheetMode === 'edit' && selectedEvent) {
      setForm({
        name: selectedEvent.name,
        description: selectedEvent.description,
        sport: selectedEvent.sport,
        location: selectedEvent.location,
        date: selectedEvent.date,
        image: selectedEvent.image,
        createdAt: selectedEvent.createdAt,
        updatedAt: selectedEvent.updatedAt,
        isDeleted: selectedEvent.isDeleted,
      });
    } else if (sheetMode === 'add') {
      setForm({
        name: '',
        description: '',
        sport: '',
        location: '',
        date: '',
        image: '',
        createdAt: '',
        updatedAt: '',
        isDeleted: false,
      });
    }
  }, [sheetMode, selectedEvent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sheetMode === 'edit' && selectedEvent) {
      onEdit({ ...form, id: selectedEvent.id });
    } else if (sheetMode === 'add') {
      onAdd(form);
    }
    setSheetOpen(false);
  };

  // Popin de choix d'action (désactiver/supprimer)
  const renderChoiceMenu = () => (
    <>
      {choiceOpen && eventToAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-xs flex flex-col gap-4">
            <h3 className="text-lg font-semibold mb-2">Action sur l&apos;événement</h3>
            <Button
              variant={'default'}
              onClick={() => {
                setPendingAction('disable');
                setChoiceOpen(false);
                setActionModalOpen(true);
              }}
              className="w-full"
            >
              {eventToAction?.isDeleted ? 'Restaurer' : 'Désactiver'}
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
                setEventToAction(null);
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
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-1">
              <span className="font-medium">Titre</span>
              <Input name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-medium">Date</span>
              <Input
                name="date"
                value={form.date ? form.date.slice(0, 10) : ''}
                onChange={handleChange}
                required
                type="date"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-medium">Lieu</span>
              <Input name="location" value={form.location} onChange={handleChange} required />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-medium">Sport</span>
              <Input name="sport" value={form.sport} onChange={handleChange} required />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-medium">Description</span>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                className="border rounded px-2 py-1 min-h-[60px]"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-medium">Image (URL)</span>
              <Input name="image" value={form.image || ''} onChange={handleChange} type="text" />
            </label>
            <Button type="submit" variant="default" className="mt-4">
              {sheetMode === 'edit' ? 'Enregistrer' : 'Créer'}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
      {renderChoiceMenu()}
      <ConfirmDeleteModal
        open={actionModalOpen}
        onOpenChange={open => {
          setActionModalOpen(open);
          if (!open) {
            setPendingAction(null);
            setEventToAction(null);
          }
        }}
        onConfirm={() => {
          if (eventToAction && pendingAction) {
            if (pendingAction === 'disable') {
              onDisable(eventToAction);
            }
            if (pendingAction === 'delete') {
              onDelete(eventToAction);
            }
          }
          setActionModalOpen(false);
          setPendingAction(null);
          setEventToAction(null);
        }}
        entityLabel={eventToAction ? `l'événement « ${eventToAction.name} »` : 'cet événement'}
        actionLabel={
          pendingAction === 'disable'
            ? eventToAction?.isDeleted
              ? 'Restaurer'
              : 'Désactiver'
            : 'Supprimer définitivement'
        }
        actionVariant={
          pendingAction === 'disable'
            ? eventToAction?.isDeleted
              ? 'default'
              : 'destructive'
            : 'destructive'
        }
        confirmMessage={
          pendingAction === 'disable'
            ? eventToAction?.isDeleted
              ? `Voulez-vous vraiment restaurer l'événement « ${eventToAction?.name ?? ''} » ?`
              : `Voulez-vous vraiment désactiver l'événement « ${eventToAction?.name ?? ''} » ?`
            : `Voulez-vous vraiment supprimer définitivement l'événement « ${eventToAction?.name ?? ''} » ?`
        }
      />
    </div>
  );
}
