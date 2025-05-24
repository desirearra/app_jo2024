import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Lock } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const mockOrders = [
  { id: 'cmd-001', date: '2024-06-01', total: 150, status: 'Payée', ticketId: 'ticket-001' },
  { id: 'cmd-002', date: '2024-06-10', total: 250, status: 'En attente', ticketId: 'ticket-002' },
];

const mockTickets = [
  {
    id: 'ticket-001',
    event: 'Athlétisme',
    passType: 'Solo',
    qrcode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=001',
  },
  {
    id: 'ticket-002',
    event: 'Natation',
    passType: 'Duo',
    qrcode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=002',
  },
];

export default function AccountPage() {
  const { user, isAuthenticated } = useAuth();
  const [tab, setTab] = useState<'infos' | 'orders' | 'tickets'>('infos');
  const [showQr, setShowQr] = useState<string | null>(null);
  //   const navigate = useNavigate();

  //   useEffect(() => {
  //     // if (!isAuthenticated) {
  //     //   return (
  //     //     <div className="text-center py-12">
  //     //       <h1 className="text-3xl font-bold mb-8">Accès refusé</h1>
  //     //       <Button asChild>
  //     //         <Link to="/">Retour à l'accueil</Link>
  //     //       </Button>
  //     //     </div>
  //     //   );
  //     // }
  //   }, [isAuthenticated, navigate]);

  //   if (!isAuthenticated) {
  //     return null;
  //   }

  // Optionnel : restriction par rôle
  if (!isAuthenticated || (user?.role !== 'user' && user?.role !== 'admin')) {
    return (
      <div className="flex flex-col justify-center items-center container mx-auto px-4 min-h-screen text-center py-12">
        <Lock className="w-10 h-10 mb-4" />
        <h1 className="text-3xl font-bold mb-8">Accès refusé</h1>
        <Button asChild>
          <Link to="/">Retour à l'accueil</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Mon compte</h1>
      <div className="flex gap-4 mb-8">
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
              <span className="font-medium">Nom :</span> {user?.name || '—'}
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
              {mockOrders.map(order => (
                <li key={order.id} className="py-3 flex justify-between items-center">
                  <div>
                    <div className="font-medium">Commande #{order.id}</div>
                    <div className="text-sm text-slate-500">
                      Date : {order.date} | Statut : {order.status}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">{order.total}€</span>
                    <Button variant="link" onClick={() => setTab('tickets')}>
                      Voir billet
                    </Button>
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
              {mockTickets.map(ticket => (
                <li key={ticket.id} className="py-3 flex justify-between items-center">
                  <div>
                    <div className="font-medium">
                      {ticket.event} ({ticket.passType})
                    </div>
                    <div className="text-sm text-slate-500">ID : {ticket.id}</div>
                  </div>
                  <Button variant="outline" onClick={() => setShowQr(ticket.qrcode)}>
                    Voir QRCode
                  </Button>
                </li>
              ))}
            </ul>
            {showQr && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
                <div className="bg-white rounded-lg p-6 shadow-lg flex flex-col items-center">
                  <img src={showQr} alt="QR Code billet" className="mb-4" />
                  <Button onClick={() => setShowQr(null)}>Fermer</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
