import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import type { ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash } from 'lucide-react';

type Offer = {
  id: string;
  title: string;
  type: string;
  price: string;
  status: string;
};

type OffersTableProps = {
  data: Offer[];
  onEdit: (offer: Offer) => void;
  onDelete: (offer: Offer) => void;
};

export function OffersTable({ data, onEdit, onDelete }: OffersTableProps) {
  const columns: ColumnDef<Offer>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'title', header: 'Titre' },
    { accessorKey: 'type', header: 'Type' },
    { accessorKey: 'price', header: 'Prix' },
    { accessorKey: 'status', header: 'Statut' },
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
            aria-label="Supprimer"
            onClick={() => onDelete(row.original)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
  return <DataTable columns={columns} data={data} searchPlaceholder="Rechercher une offre..." />;
}
