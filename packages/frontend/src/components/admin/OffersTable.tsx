import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import type { Offer } from '@/types';
import type { ColumnDef } from '@tanstack/react-table';
import { Pencil } from 'lucide-react';

type OffersTableProps = {
  data: Offer[];
  onEdit: (offer: Offer) => void;
  onAction: (offer: Offer) => void;
};

export function OffersTable({ data, onEdit, onAction }: OffersTableProps) {
  const columns: ColumnDef<Offer>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Titre' },
    { accessorKey: 'seats', header: 'Nombre de places' },
    { accessorKey: 'type', header: 'Type' },
    { accessorKey: 'price', header: 'Prix (€)' },
    {
      id: 'status',
      header: 'Statut',
      cell: ({ row }) => (row.original.isDeleted ? 'Brouillon' : 'Publié'),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            aria-label="Éditer"
            onClick={() => onEdit(row.original)}
          >
            <Pencil className="h-4 w-4 mr-1" />
            Éditer
          </Button>
          <Button
            size="sm"
            variant="destructive"
            aria-label="Actions"
            onClick={() => onAction(row.original)}
          >
            Actions
          </Button>
        </div>
      ),
    },
  ];
  return <DataTable columns={columns} data={data} searchPlaceholder="Rechercher une offre..." />;
}
