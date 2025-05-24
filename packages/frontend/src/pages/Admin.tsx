import { DashboardTab, EventsTab, OffersTab, OrdersTab, UsersTab } from '@/components/admin';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Event, Offer, Order, User } from '@/types';
import * as React from 'react';

const mockStats = [
  { label: 'Revenu total', value: '45 231€', sub: '+20% vs mois dernier' },
  { label: 'Abonnements', value: '+2350', sub: '+180% vs mois dernier' },
  { label: 'Ventes', value: '+12 234', sub: '+19% vs mois dernier' },
  { label: 'Actifs', value: '+573', sub: '+201 vs dernière heure' },
];

const mockSales = [
  { name: 'Olivia Martin', email: 'olivia.martin@email.com', amount: '+1 999€' },
  { name: 'Jackson Lee', email: 'jackson.lee@email.com', amount: '+39€' },
  { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', amount: '+299€' },
];

const initialOffers: Offer[] = [
  {
    id: 'OFF-001',
    title: 'Pass Découverte',
    type: 'Solo',
    price: '49€',
    status: 'Publié',
    description: 'Accès à une journée de compétition',
    image: '/assets/passes/decouverte.jpg',
  },
  {
    id: 'OFF-002',
    title: 'Pass Famille',
    type: 'Famille',
    price: '199€',
    status: 'Publié',
    description: '4 entrées pour toute la famille',
    image: '/assets/passes/famille.jpg',
  },
  {
    id: 'OFF-003',
    title: 'Pass Premium',
    type: 'VIP',
    price: '499€',
    status: 'Brouillon',
    description: 'Accès VIP + loge + cocktail',
    image: '/assets/passes/premium.jpg',
  },
];

const initialEvents: Event[] = [
  {
    id: 'EVT-001',
    title: 'Athlétisme - 100m Hommes',
    date: '2024-07-28',
    lieu: 'Stade de France',
    price: '120€',
    status: 'Ouvert',
    description: 'Finale du 100m hommes, ambiance garantie !',
    image: '/assets/events/athletisme-100m.jpg',
  },
  {
    id: 'EVT-002',
    title: 'Natation - Finale 200m Nage Libre',
    date: '2024-08-02',
    lieu: 'Centre Aquatique',
    price: '90€',
    status: 'Fermé',
    description: 'Les meilleurs nageurs du monde en compétition.',
    image: '/assets/events/natation-200m.jpg',
  },
  {
    id: 'EVT-003',
    title: 'Basket - Demi-finale',
    date: '2024-08-05',
    lieu: 'Accor Arena',
    price: '150€',
    status: 'Ouvert',
    description: "Les meilleures équipes s'affrontent pour une place en finale.",
    image: '/assets/events/basket-demi.jpg',
  },
];

const initialOrders: Order[] = [
  { id: 'CMD-001', user: 'Olivia Martin', date: '2024-06-01', total: '150€', status: 'Payée' },
  { id: 'CMD-002', user: 'Jackson Lee', date: '2024-06-10', total: '250€', status: 'Payée' },
];
const initialUsers: User[] = [
  {
    id: 'USR-001',
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    role: 'admin',
    status: 'Actif',
    createdAt: new Date().toISOString(),
    key1: 'clé-mockée-1',
  },
  {
    id: 'USR-002',
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    role: 'user',
    status: 'Inactif',
    createdAt: new Date().toISOString(),
    key1: 'clé-mockée-2',
  },
];

export default function AdminPage() {
  //   const { isAuthenticated, user } = useAuth();
  //   if (!isAuthenticated || user?.role !== 'admin') {
  //     return <div className="text-center py-12">Accès refusé</div>;
  //   }
  const [offers, setOffers] = React.useState<Offer[]>(initialOffers);
  const [events, setEvents] = React.useState<Event[]>(initialEvents);
  const [orders, setOrders] = React.useState<Order[]>(initialOrders);
  const [users, setUsers] = React.useState<User[]>(initialUsers);

  // Calculs dynamiques pour le dashboard (KISS)
  const paidOrders = orders.filter(o => o.status === 'Payée');
  const totalRevenue = paidOrders.reduce((sum, o) => {
    const num = parseFloat(o.total.replace(/[^\d,.]/g, '').replace(',', '.'));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);
  const recentSales = paidOrders
    .slice(-5)
    .reverse()
    .map(o => {
      const user = users.find(u => u.name === o.user);
      return {
        name: o.user,
        email: user?.email || '',
        amount: o.total,
      };
    });
  const stats = [
    {
      label: 'Revenu total',
      value: totalRevenue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }),
      sub: '',
    },
    {
      label: 'Nombre de ventes',
      value: paidOrders.length.toString(),
      sub: '',
    },
    {
      label: 'Offres disponibles',
      value: offers.filter(o => o.status === 'Publié').length.toString(),
      sub: '',
    },
    {
      label: 'Événements',
      value: events.length.toString(),
      sub: '',
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Espace administration</h1>
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
          <TabsTrigger value="offers">Offres</TabsTrigger>
          <TabsTrigger value="events">Événements</TabsTrigger>
          <TabsTrigger value="orders">Commandes</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <DashboardTab stats={stats} sales={recentSales} />
        </TabsContent>
        <TabsContent value="offers">
          <OffersTab
            data={offers}
            onAdd={offer =>
              setOffers(prev => [
                ...prev,
                {
                  id: `OFF-${prev.length + 1}`,
                  title: offer.title ?? '',
                  type: offer.type ?? '',
                  price: offer.price ?? '',
                  status: offer.status ?? '',
                  description: offer.description ?? '',
                  image: offer.image ?? '',
                },
              ])
            }
            onEdit={offer =>
              setOffers(prev => prev.map(o => (o.id === offer.id ? { ...o, ...offer } : o)))
            }
            onDelete={offer => setOffers(prev => prev.filter(o => o.id !== offer.id))}
          />
        </TabsContent>
        <TabsContent value="events">
          <EventsTab
            data={events}
            onAdd={event =>
              setEvents(prev => [
                ...prev,
                {
                  id: `EVT-${prev.length + 1}`,
                  title: event.title ?? '',
                  date: event.date ?? '',
                  lieu: event.lieu ?? '',
                  price: event.price ?? '',
                  status: event.status ?? '',
                  description: event.description ?? '',
                  image: event.image ?? '',
                },
              ])
            }
            onEdit={event =>
              setEvents(prev => prev.map(e => (e.id === event.id ? { ...e, ...event } : e)))
            }
            onDelete={event => setEvents(prev => prev.filter(e => e.id !== event.id))}
          />
        </TabsContent>
        <TabsContent value="orders">
          <OrdersTab
            data={orders}
            onDelete={order => setOrders(prev => prev.filter(o => o.id !== order.id))}
          />
        </TabsContent>
        <TabsContent value="users">
          <UsersTab
            data={users}
            onAdd={user => setUsers(prev => [...prev, { ...user, id: `USR-${prev.length + 1}` }])}
            onEdit={user => setUsers(prev => prev.map(u => (u.id === user.id ? user : u)))}
            onDelete={user => setUsers(prev => prev.filter(u => u.id !== user.id))}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
