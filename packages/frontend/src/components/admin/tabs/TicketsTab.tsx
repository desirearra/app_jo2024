import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { post, put } from '@/lib/api';
import type { OrderWithItems, Ticket, User } from '@/types';
import * as React from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

// Props du composant
export type TicketsTabProps = {
  tickets: Ticket[];
  users: User[];
  orders: OrderWithItems[];
  onRefresh: () => void;
};

// Type pour la réponse de vérification
type TicketVerifyResult = {
  id: string;
  userId: string;
  offerId: string;
  orderItemId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  places: number;
  isDeleted: boolean;
  valid: boolean;
  idx: number;
  userFirstName: string;
  userLastName: string;
  orderId: string;
  orderDate: string;
  eventName: string | null;
  ticketType: string;
  ticketPlaces: number;
};

export function TicketsTab({ tickets, users, orders }: TicketsTabProps) {
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<
    null | { success: true; data: TicketVerifyResult } | { success: false; error: string }
  >(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [blockLoading, setBlockLoading] = useState(false);
  const [blockMessage, setBlockMessage] = useState<string | null>(null);

  // Synchronise la recherche avec le paramètre 'search' de l'URL
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search') || '';
    setSearch(searchParam);
  }, [location.search]);

  // Récupère infos utilisateur et commande pour chaque ticket
  const getUser = (userId: string) => users.find(u => u.id === userId);
  const getOrder = (ticket: Ticket) =>
    orders.find(order => order.orderItems.some(item => item.tickets.some(t => t.id === ticket.id)));

  // Action de vérification
  const handleVerify = async (ticket: Ticket): Promise<void> => {
    setVerifying(true);
    setVerifyResult(null);
    try {
      const res = await post('/api/tickets/verify', { finalKey: ticket.finalKey });
      // On cast explicitement la réponse pour garantir le typage
      setVerifyResult({ success: true, data: res.data as TicketVerifyResult });
    } catch (e: unknown) {
      // On caste pour accéder à response.data.error sans utiliser any globalement
      let errorMsg = 'Erreur inconnue';
      if (
        typeof e === 'object' &&
        e !== null &&
        'response' in e &&
        typeof (e as { response?: { data?: { error?: string } } }).response?.data?.error ===
          'string'
      ) {
        errorMsg = (e as { response: { data: { error: string } } }).response.data.error;
      }
      setVerifyResult({ success: false, error: errorMsg });
    } finally {
      setVerifying(false);
    }
  };

  // Action de blocage
  const handleBlock = async () => {
    if (!selectedTicket) return;
    setBlockLoading(true);
    setBlockMessage(null);
    try {
      await put(`/api/tickets/${selectedTicket.id}`, { status: 'CANCELLED' });
      setBlockMessage('Billet bloqué avec succès.');
    } catch (e: unknown) {
      let errorMsg = 'Erreur lors du blocage.';
      if (
        typeof e === 'object' &&
        e !== null &&
        'response' in e &&
        typeof (e as { response?: { data?: { error?: string } } }).response?.data?.error ===
          'string'
      ) {
        errorMsg = (e as { response: { data: { error: string } } }).response.data.error;
      }
      setBlockMessage(errorMsg);
    } finally {
      setBlockLoading(false);
    }
  };

  // Badge de statut
  const getStatusBadge = (status: string) => {
    let color = 'bg-gray-300 text-gray-800';
    if (status === 'ACTIVE') color = 'bg-green-200 text-green-800';
    else if (status === 'CANCELLED') color = 'bg-red-200 text-red-800';
    else if (status === 'USED') color = 'bg-slate-200 text-slate-800';
    return <span className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>{status}</span>;
  };

  // Colonnes DataTable
  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }: { row: { original: Ticket } }) => (
        <span className="font-mono text-xs">{row.original.id}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }: { row: { original: Ticket } }) => getStatusBadge(row.original.status),
    },
    {
      id: 'user',
      header: 'Utilisateur',
      cell: ({ row }: { row: { original: Ticket } }) => {
        const user = getUser(row.original.userId);
        return user ? `${user.firstName} ${user.lastName}` : row.original.userId;
      },
    },
    {
      id: 'order',
      header: 'Commande',
      cell: ({ row }: { row: { original: Ticket } }) => {
        const order = getOrder(row.original);
        return order ? <span className="font-mono text-xs">{order.id}</span> : '—';
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: { original: Ticket } }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedTicket(row.original);
              setVerifyModalOpen(true);
              setVerifyResult(null);
            }}
          >
            Vérifier
          </Button>
        </div>
      ),
    },
  ];

  // Filtrage simple sur l'ID, le statut, l'utilisateur ou la commande
  const filteredTickets = tickets.filter(ticket => {
    const user = getUser(ticket.userId);
    const order = getOrder(ticket);
    const userName = user ? `${user.firstName} ${user.lastName}` : '';
    const orderId = String(order?.id ?? '')
      .trim()
      .toLowerCase();
    const cleanSearch = search.trim().toLowerCase();
    return (
      ticket.id.toLowerCase().includes(cleanSearch) ||
      ticket.status.toLowerCase().includes(cleanSearch) ||
      userName.toLowerCase().includes(cleanSearch) ||
      orderId.includes(cleanSearch)
    );
  });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Gestion des billets</h2>
      </div>
      <DataTable
        columns={columns}
        data={filteredTickets}
        searchPlaceholder="Rechercher un billet, utilisateur, commande..."
        searchValue={search}
        onSearchChange={setSearch}
      />
      {/* Modal de vérification */}
      <Dialog open={verifyModalOpen} onOpenChange={setVerifyModalOpen}>
        <DialogContent>
          <DialogTitle>Vérification du billet</DialogTitle>
          <DialogDescription>
            {selectedTicket && (
              <div className="mb-2">
                <div className="text-xs text-muted-foreground mb-1">ID billet</div>
                <div className="font-mono text-sm mb-2">{selectedTicket.id}</div>
                <Button
                  size="sm"
                  variant="default"
                  disabled={verifying || selectedTicket.status !== 'ACTIVE'}
                  onClick={() => handleVerify(selectedTicket)}
                >
                  {selectedTicket.status !== 'ACTIVE'
                    ? 'Vérification impossible'
                    : verifying
                      ? 'Vérification...'
                      : 'Lancer la vérification'}
                </Button>
              </div>
            )}
            {verifyResult && verifyResult.success && (
              <div className="mt-4 text-green-700 space-y-2">
                <div className="font-semibold flex items-center gap-2">
                  <span>✅ Billet authentique !</span>
                </div>
                <div className="bg-slate-100 rounded p-4 text-sm text-slate-900">
                  <div>
                    <span className="font-semibold">Nom&nbsp;:</span>{' '}
                    {verifyResult.data.userFirstName} {verifyResult.data.userLastName}
                  </div>
                  <div>
                    <span className="font-semibold">Commande&nbsp;:</span>{' '}
                    <span className="font-mono">{verifyResult.data.orderId}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Date d&apos;achat&nbsp;:</span>{' '}
                    {new Date(verifyResult.data.orderDate).toLocaleString('fr-FR')}
                  </div>
                  <div>
                    <span className="font-semibold">Événement&nbsp;:</span>{' '}
                    {verifyResult.data.eventName || '—'}
                  </div>
                  <div>
                    <span className="font-semibold">Statut billet&nbsp;:</span>{' '}
                    {verifyResult.data.status}
                  </div>
                  <div>
                    <span className="font-semibold">ID billet&nbsp;:</span>{' '}
                    <span className="font-mono">{verifyResult.data.id}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Type de billet&nbsp;:</span>{' '}
                    {verifyResult.data.ticketType}
                  </div>
                  <div>
                    <span className="font-semibold">Nombre de personnes&nbsp;:</span>{' '}
                    {verifyResult.data.ticketPlaces}
                  </div>
                </div>
              </div>
            )}
            {verifyResult && !verifyResult.success && (
              <div className="mt-4 text-red-700 space-y-2">
                <div>❌ Vérification échouée : {verifyResult.error}</div>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={blockLoading}
                  onClick={handleBlock}
                >
                  {blockLoading ? 'Blocage...' : 'Bloquer ce ticket'}
                </Button>
                {blockMessage && <div className="text-xs mt-2 text-slate-800">{blockMessage}</div>}
              </div>
            )}
          </DialogDescription>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setVerifyModalOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
