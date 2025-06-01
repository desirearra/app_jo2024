import { ConfirmDeleteModal } from '@/components/admin';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { StatusBadge } from '@/components/ui/StatusBadge';
import type { OrderWithItems, User } from '@/types';
import { Eye } from 'lucide-react';
import * as React from 'react';

// Props du composant
export type OrdersTabProps = {
  data: OrderWithItems[];
  onDelete: (order: OrderWithItems) => void;
  onDisable: (order: OrderWithItems) => void;
  users?: User[];
  onRefresh?: () => void;
};

export function OrdersTab({ data, onDelete, onDisable, users = [] }: OrdersTabProps) {
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState<OrderWithItems | null>(null);
  const [actionModalOpen, setActionModalOpen] = React.useState(false);
  const [orderToAction, setOrderToAction] = React.useState<OrderWithItems | null>(null);
  const [pendingAction, setPendingAction] = React.useState<'disable' | 'delete' | null>(null);
  const [choiceOpen, setChoiceOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  // Colonnes du tableau (DataTable)
  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }: { row: { original: OrderWithItems } }) => (
        <span className="font-mono text-xs">{row.original.id}</span>
      ),
    },
    {
      id: 'user',
      header: 'Utilisateur',
      cell: ({ row }: { row: { original: OrderWithItems } }) => {
        const user = users.find(u => u.id === row.original.userId);
        return user ? `${user.firstName} ${user.lastName}` : row.original.userId;
      },
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }: { row: { original: OrderWithItems } }) => (
        <StatusBadge status={row.original.status} type="order" />
      ),
    },
    {
      accessorKey: 'totalAmount',
      header: 'Total',
      cell: ({ row }: { row: { original: OrderWithItems } }) => `${row.original.totalAmount} €`,
    },
    {
      id: 'createdAt',
      header: 'Date',
      cell: ({ row }: { row: { original: OrderWithItems } }) =>
        new Date(row.original.createdAt).toLocaleDateString('fr-FR'),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: { original: OrderWithItems } }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            aria-label="Détail"
            onClick={() => {
              setSelectedOrder(row.original);
              setSheetOpen(true);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            aria-label="Actions"
            onClick={() => {
              setOrderToAction(row.original);
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

  // Filtrage avancé (KISS)
  const filteredOrders = data.filter(order => {
    const user = users.find(u => u.id === order.userId);
    const userName = user ? `${user.firstName} ${user.lastName}` : '';
    const cleanSearch = search.trim().toLowerCase();
    return (
      order.id.toLowerCase().includes(cleanSearch) ||
      order.status.toLowerCase().includes(cleanSearch) ||
      order.totalAmount.toLowerCase().includes(cleanSearch) ||
      new Date(order.createdAt).toLocaleDateString('fr-FR').includes(cleanSearch) ||
      userName.toLowerCase().includes(cleanSearch) ||
      order.userId.toLowerCase().includes(cleanSearch)
    );
  });

  // Popin de choix d'action (désactiver/supprimer)
  const renderChoiceMenu = () => (
    <>
      {choiceOpen && orderToAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-xs flex flex-col gap-4">
            <h3 className="text-lg font-semibold mb-2">Action sur la commande</h3>
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
                setOrderToAction(null);
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
        <h2 className="text-lg font-semibold">Gestion des commandes</h2>
      </div>
      <DataTable
        columns={columns}
        data={filteredOrders}
        searchPlaceholder="Rechercher une commande, utilisateur, statut..."
        searchValue={search}
        onSearchChange={setSearch}
      />
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full max-w-lg">
          <DialogTitle asChild>
            <h2 className="text-xl font-bold mb-2">Détail de la commande</h2>
          </DialogTitle>
          <DialogDescription>
            Informations détaillées sur la commande sélectionnée et ses billets associés.
          </DialogDescription>
          <div className="h-px bg-slate-200 my-4" />
          {selectedOrder && (
            <form className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">ID</label>
                <Input
                  value={selectedOrder.id}
                  readOnly
                  className="bg-slate-100 font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Utilisateur</label>
                <Input
                  value={(() => {
                    const user = users.find(u => u.id === selectedOrder.userId);
                    return user ? `${user.firstName} ${user.lastName}` : selectedOrder.userId;
                  })()}
                  readOnly
                  className="bg-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Statut</label>
                <Input value={selectedOrder.status} readOnly className="bg-slate-100" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Total</label>
                <Input value={`${selectedOrder.totalAmount} €`} readOnly className="bg-slate-100" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Date</label>
                <Input
                  value={new Date(selectedOrder.createdAt).toLocaleString('fr-FR')}
                  readOnly
                  className="bg-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mt-8">Billets associés</label>
                <ul className="list-disc ml-6 mt-2">
                  {selectedOrder.orderItems.flatMap(item =>
                    item.tickets.map(ticket => (
                      <li key={ticket.id} className="mb-1 flex items-center gap-2">
                        <span className="font-mono text-xs">{ticket.id}</span> —
                        <span className="ml-2">
                          Statut : <StatusBadge status={ticket.status} type="ticket" />
                        </span>
                      </li>
                    ))
                  )}
                </ul>
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
            setOrderToAction(null);
          }
        }}
        onConfirm={() => {
          if (orderToAction && pendingAction) {
            if (pendingAction === 'disable') {
              onDisable(orderToAction);
            }
            if (pendingAction === 'delete') {
              onDelete(orderToAction);
            }
          }
          setActionModalOpen(false);
          setPendingAction(null);
          setOrderToAction(null);
        }}
        entityLabel={orderToAction ? `la commande n°${orderToAction.id}` : 'cette commande'}
        actionLabel={
          pendingAction === 'disable'
            ? orderToAction?.isDeleted
              ? 'Restaurer'
              : 'Désactiver'
            : 'Supprimer définitivement'
        }
        actionVariant={
          pendingAction === 'disable'
            ? orderToAction?.isDeleted
              ? 'default'
              : 'destructive'
            : 'destructive'
        }
        confirmMessage={
          pendingAction === 'disable'
            ? orderToAction?.isDeleted
              ? `Voulez-vous vraiment restaurer la commande n°${orderToAction?.id ?? ''} ?`
              : `Voulez-vous vraiment désactiver la commande n°${orderToAction?.id ?? ''} ?`
            : `Voulez-vous vraiment supprimer définitivement la commande n°${orderToAction?.id ?? ''} ?`
        }
      />
    </div>
  );
}
