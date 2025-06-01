import { ConfirmDeleteModal } from '@/components/admin';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Eye } from 'lucide-react';
import * as React from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  isDeleted: boolean;
  createdAt: string;
};

type UsersTabProps = {
  data: User[];
  onDelete: (user: User) => void;
  onDisable: (user: User) => void;
};

export function UsersTab({ data, onDelete, onDisable }: UsersTabProps) {
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [actionModalOpen, setActionModalOpen] = React.useState(false);
  const [userToAction, setUserToAction] = React.useState<User | null>(null);
  const [pendingAction, setPendingAction] = React.useState<'disable' | 'delete' | null>(null);
  const [choiceOpen, setChoiceOpen] = React.useState(false);

  const columns = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Nom' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'role', header: 'Rôle' },
    {
      accessorKey: 'isDeleted',
      header: 'Statut',
      cell: ({ row }: { row: { original: User } }) => (
        <StatusBadge status={row.original.isDeleted ? 'Inactif' : 'Actif'} type="user" />
      ),
    },
    {
      id: 'createdAt',
      header: 'Créé le',
      cell: ({ row }: { row: { original: User } }) => (
        <span className="text-xs">
          {row.original.createdAt
            ? new Date(row.original.createdAt).toLocaleDateString('fr-FR')
            : '—'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: { original: User } }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            aria-label="Afficher détails"
            onClick={() => {
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
            aria-label="Actions utilisateur"
            disabled={row.original.role === 'admin'}
            onClick={e => {
              e.preventDefault();
              setUserToAction(row.original);
              setChoiceOpen(true);
            }}
            title={row.original.role === 'admin' ? 'Impossible de modifier un admin' : ''}
          >
            Actions
          </Button>
        </div>
      ),
    },
  ];

  // Menu de choix d'action (désactiver/supprimer)
  const renderChoiceMenu = () => (
    <>
      {choiceOpen && userToAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-xs flex flex-col gap-4">
            <h3 className="text-lg font-semibold mb-2">Action sur l&apos;utilisateur</h3>
            <Button
              variant={'default'}
              onClick={() => {
                setPendingAction('disable');
                setChoiceOpen(false);
                setActionModalOpen(true);
              }}
              className="w-full"
            >
              {userToAction?.isDeleted ? 'Restaurer' : 'Désactiver'}
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
                setUserToAction(null);
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
        <h2 className="text-lg font-semibold">Gestion des utilisateurs</h2>
      </div>
      <DataTable columns={columns} data={data} searchPlaceholder="Rechercher un utilisateur..." />
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <DialogTitle asChild>
            <h2 className="text-xl font-bold mb-2">Détails de l&apos;utilisateur</h2>
          </DialogTitle>
          <DialogDescription>
            Informations détaillées sur l&apos;utilisateur sélectionné.
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
                <StatusBadge
                  status={selectedUser.isDeleted ? 'Inactif' : 'Actif'}
                  type="user"
                  className="w-full"
                />
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
            </form>
          )}
        </SheetContent>
      </Sheet>
      {renderChoiceMenu()}
      <ConfirmDeleteModal
        open={actionModalOpen}
        onOpenChange={open => {
          setActionModalOpen(open);
          if (!open) {
            setPendingAction(null);
            setUserToAction(null);
          }
        }}
        onConfirm={() => {
          if (userToAction && pendingAction) {
            if (pendingAction === 'disable') onDisable(userToAction);
            if (pendingAction === 'delete') onDelete(userToAction);
          }
          setActionModalOpen(false);
          setPendingAction(null);
          setUserToAction(null);
        }}
        entityLabel={userToAction ? `l'utilisateur « ${userToAction.name} »` : 'cet utilisateur'}
        actionLabel={
          pendingAction === 'disable'
            ? userToAction?.isDeleted
              ? 'Restaurer'
              : 'Désactiver'
            : 'Supprimer définitivement'
        }
        actionVariant={
          pendingAction === 'disable'
            ? userToAction?.isDeleted
              ? 'default'
              : 'destructive'
            : 'destructive'
        }
        confirmMessage={
          pendingAction === 'disable'
            ? userToAction?.isDeleted
              ? `Voulez-vous vraiment restaurer l'utilisateur « ${userToAction?.name ?? ''} » ?`
              : `Voulez-vous vraiment désactiver l'utilisateur « ${userToAction?.name ?? ''} » ?`
            : `Voulez-vous vraiment supprimer définitivement l'utilisateur « ${userToAction?.name ?? ''} » ?`
        }
      />
    </div>
  );
}
