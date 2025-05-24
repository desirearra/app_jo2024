import { ConfirmDeleteModal } from '@/components/admin';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Eye, Trash } from 'lucide-react';
import * as React from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  key1: string;
};

type UsersTabProps = {
  data: User[];
  onAdd: (user: Omit<User, 'id'>) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
};

export function UsersTab({ data, onAdd, onEdit, onDelete }: UsersTabProps) {
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [sheetMode, setSheetMode] = React.useState<'add' | 'edit'>('add');
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<User | null>(null);

  const columns = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Nom' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'role', header: 'Rôle' },
    { accessorKey: 'status', header: 'Statut' },
    {
      id: 'createdAt',
      header: 'Créé le',
      cell: ({ row }: any) => (
        <span className="text-xs">
          {row.original.createdAt
            ? new Date(row.original.createdAt).toLocaleDateString('fr-FR')
            : '—'}
        </span>
      ),
    },
    {
      id: 'key1',
      header: 'Clé 1 (partielle)',
      cell: ({ row }: any) => (
        <span className="font-mono text-xs">{row.original.key1?.slice(0, 8) || '—'}</span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            aria-label="Afficher détails"
            onClick={() => {
              setSheetMode('edit');
              setSelectedUser(row.original);
              setSheetOpen(true);
            }}
          >
            <Eye className="h-4 w-4 mr-1" />
            Afficher détails
          </Button>
          <Button
            size="sm"
            variant="destructive"
            aria-label="Supprimer"
            onClick={() => {
              setUserToDelete(row.original);
              setDeleteModalOpen(true);
            }}
            disabled={row.original.role === 'admin'}
            title={row.original.role === 'admin' ? 'Impossible de supprimer un admin' : ''}
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
        <h2 className="text-lg font-semibold">Gestion des utilisateurs</h2>
      </div>
      <DataTable columns={columns} data={data} searchPlaceholder="Rechercher un utilisateur..." />
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <DialogTitle asChild>
            <h2 className="text-xl font-bold mb-2">Détails de l'utilisateur</h2>
          </DialogTitle>
          <DialogDescription>
            Informations détaillées sur l'utilisateur sélectionné.
          </DialogDescription>
          <div className="h-px bg-slate-200 my-4" />
          {selectedUser && (
            <form className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">ID</label>
                <Input value={selectedUser.id} readOnly className="bg-slate-100" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Nom</label>
                <Input value={selectedUser.name} readOnly className="bg-slate-100" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Email</label>
                <Input value={selectedUser.email} readOnly className="bg-slate-100" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Rôle</label>
                <Input value={selectedUser.role} readOnly className="bg-slate-100" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Statut</label>
                <Input value={selectedUser.status} readOnly className="bg-slate-100" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Créé le</label>
                <Input
                  value={
                    selectedUser.createdAt
                      ? new Date(selectedUser.createdAt).toLocaleString('fr-FR')
                      : ''
                  }
                  readOnly
                  className="bg-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Clé 1 (partielle)</label>
                <Input
                  value={selectedUser.key1?.slice(0, 8) || ''}
                  readOnly
                  className="bg-slate-100 font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Clé 1 (complète)</label>
                <Input
                  value={selectedUser.key1 || ''}
                  readOnly
                  className="bg-slate-100 font-mono text-xs"
                />
              </div>
            </form>
          )}
        </SheetContent>
      </Sheet>
      <ConfirmDeleteModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={() => {
          if (userToDelete) onDelete(userToDelete);
          setDeleteModalOpen(false);
        }}
        entityLabel="utilisateur"
      />
    </div>
  );
}
