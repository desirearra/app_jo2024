import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { get } from '@/lib/api';
import type { Order, User } from '@/types';
import { Lock } from 'lucide-react';
import QRCode from 'qrcode.react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Type pour le user retourné par l'API /users/me
// (pas de password, pas de key1, avec orders et tickets enrichis)
type UserMe = Omit<User, 'password' | 'key1' | 'createdAt' | 'updatedAt' | 'isDeleted'> & {
  orders: Array<Pick<Order, 'id' | 'offerId' | 'status' | 'totalAmount' | 'createdAt'>>;
  tickets: Array<{
    id: string;
    offerId: string;
    status: string;
    createdAt: string;
    passType: string | null;
    places: number | null;
    event: { id: string; name: string; date: string } | null;
    // finalKey n'est plus exposée ici
  }>;
};

export default function AccountPage() {
  const { user: authUser, isAuthenticated } = useAuth();
  const [tab, setTab] = useState<'infos' | 'orders' | 'tickets'>('infos');
  const [showQr, setShowQr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserMe | null>(null);
  const [orders, setOrders] = useState<UserMe['orders']>([]);
  const [tickets, setTickets] = useState<UserMe['tickets']>([]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    get<UserMe>('/api/users/me')
      .then(res => {
        if (!isMounted) return;
        setUser(res.data);
        setOrders(res.data.orders || []);
        setTickets(res.data.tickets || []);
      })
      .catch(() => {
        if (!isMounted) return;
        setUser(null);
        setOrders([]);
        setTickets([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Optionnel : restriction par rôle
  if (!isAuthenticated || authUser?.role?.toLowerCase() !== 'user') {
    return (
      <div className="flex flex-col justify-center items-center container mx-auto px-4 min-h-screen text-center py-12">
        <Lock className="w-10 h-10 mb-4" />
        <h1 className="text-3xl font-bold mb-8">Accès refusé</h1>
        <Button asChild>
          <Link to="/">Retour à l&apos;accueil</Link>
        </Button>
      </div>
    );
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Chargement...</div>;
  }

  return (
    <div className="container mx-auto py-12 px-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Mon compte</h1>
      <div className="flex gap-2 sm:gap-4 mb-8 overflow-x-auto">
        <Button variant={tab === 'infos' ? 'default' : 'outline'} onClick={() => setTab('infos')}>
          Mes informations
        </Button>
        <Button variant={tab === 'orders' ? 'default' : 'outline'} onClick={() => setTab('orders')}>
          Mes commandes
        </Button>
        <Button
          variant={tab === 'tickets' ? 'default' : 'outline'}
          onClick={() => setTab('tickets')}
        >
          Mes billets
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        {tab === 'infos' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Mes informations</h2>
            <p>
              <span className="font-medium">Nom :</span> {user?.lastName || '—'}
            </p>
            <p>
              <span className="font-medium">Prénom :</span> {user?.firstName || '—'}
            </p>
            <p>
              <span className="font-medium">Email :</span> {user?.email || '—'}
            </p>
            <p>
              <span className="font-medium">Rôle :</span> {user?.role}
            </p>
          </div>
        )}
        {tab === 'orders' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Mes commandes</h2>
            <ul className="divide-y">
              {orders.map(order => (
                <li key={order.id} className="py-3 flex justify-between items-center">
                  <div>
                    <div className="font-medium">Commande #{order.id}</div>
                    <div className="text-sm text-slate-500">
                      Date : {new Date(order.createdAt).toLocaleDateString()} | Statut :{' '}
                      {order.status}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">{order.totalAmount}€</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {tab === 'tickets' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Mes billets</h2>
            <ul className="divide-y">
              {tickets.map(ticket => (
                <li key={ticket.id} className="py-3 flex justify-between items-center">
                  <div>
                    <div className="font-medium">ID : {ticket.id}</div>
                    <div className="text-sm text-slate-500">
                      Pass : <span className="font-semibold">{ticket.passType ?? 'N/A'}</span>{' '}
                      &nbsp;| &nbsp;
                      {ticket.event && (
                        <span className="text-sm text-slate-500">
                          Événement : <span className="font-semibold">{ticket.event.name}</span>{' '}
                          &nbsp;| &nbsp;Date :{' '}
                          <span className="font-semibold">
                            {new Date(ticket.event.date).toLocaleDateString('fr-FR')}
                          </span>
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Acheté le : {new Date(ticket.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setShowQr(ticket.id)}>
                    Voir QRCode
                  </Button>
                </li>
              ))}
            </ul>
            {showQr && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
                <div className="bg-white rounded-lg p-6 shadow-lg flex flex-col items-center">
                  <QRCode value={showQr} size={150} />
                  <Button onClick={() => setShowQr(null)} className="mt-4">
                    Fermer
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
