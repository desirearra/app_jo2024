import { DashboardTab, EventsTab, OffersTab, OrdersTab, UsersTab } from '@/components/admin';
import type { OfferForm } from '@/components/admin/OffersSheet';
import { RevenueChartData } from '@/components/admin/RevenueChart';
import { TicketsTab } from '@/components/admin/tabs/TicketsTab';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { del, get, post, put } from '@/lib/api';
import type { Event, Offer, OrderWithItems, User } from '@/types';
import * as React from 'react';
import { Link } from 'react-router-dom';

export default function AdminPage() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'ADMIN')) {
    return (
      <div className="flex flex-col justify-center items-center container mx-auto px-4 min-h-screen text-center py-12">
        <h1 className="text-3xl font-bold mb-8">Accès refusé</h1>
        <Button asChild>
          <Link to="/">Retour à l&apos;accueil</Link>
        </Button>
      </div>
    );
  }

  // États pour les données dynamiques
  const [offers, setOffers] = React.useState<Offer[]>([]);
  const [events, setEvents] = React.useState<Event[]>([]);
  const [orders, setOrders] = React.useState<OrderWithItems[]>([]);
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Chargement des données du backend au montage
  React.useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      get<Offer[]>('/api/offers'),
      get<Event[]>('/api/events'),
      get<OrderWithItems[]>('/api/orders'),
      get<User[]>('/api/users'),
    ])
      .then(([offersRes, eventsRes, ordersRes, usersRes]) => {
        setOffers(offersRes.data);
        setEvents(eventsRes.data);
        setOrders(ordersRes.data);
        setUsers(usersRes.data);
      })
      .catch(() => {
        setError('Erreur lors du chargement des données du dashboard.');
      })
      .finally(() => setLoading(false));
  }, []);

  // Calculs dynamiques pour le dashboard (KISS)
  const paidOrders = orders.filter(o => o.status === 'PAID');
  const totalRevenue = paidOrders.reduce((sum, o) => {
    const num = parseFloat(o.totalAmount.replace(/[^\d,.]/g, '').replace(',', '.'));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);
  const recentSales = paidOrders
    .slice(-5)
    .reverse()
    .map(o => {
      const user = users.find(u => u.id === o.userId);
      return {
        name: user?.firstName + ' ' + user?.lastName || '',
        email: user?.email || '',
        amount: o.totalAmount,
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
      value: offers.filter(o => o.isActive).length.toString(),
      sub: '',
    },
    {
      label: 'Événements',
      value: events.length.toString(),
      sub: '',
    },
  ];

  // === Calcul des revenus mensuels pour le graphique (3 prochains mois à partir du mois courant) ===
  const monthNames = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ];
  const now = new Date();
  const currentMonthIndex = now.getMonth();
  const next3Months = [0, 1, 2].map(i => monthNames[(currentMonthIndex + i) % 12]);
  const revenueByMonth: Record<string, number> = {};
  paidOrders.forEach(order => {
    const date = new Date(order.createdAt);
    const month = monthNames[date.getMonth()];
    const amount = parseFloat(order.totalAmount.replace(/[^\d,.]/g, '').replace(',', '.'));
    revenueByMonth[month] = (revenueByMonth[month] || 0) + (isNaN(amount) ? 0 : amount);
  });

  // Fonction de rafraîchissement globale
  const handleRefresh = async () => {
    setLoading(true);
    try {
      const [usersRes, offersRes, eventsRes, ordersRes] = await Promise.all([
        get<User[]>('/api/users'),
        get<Offer[]>('/api/offers'),
        get<Event[]>('/api/events'),
        get<OrderWithItems[]>('/api/orders'),
      ]);
      setUsers(usersRes.data);
      setOffers(offersRes.data);
      setEvents(eventsRes.data);
      setOrders(ordersRes.data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Chargement du dashboard…</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  // On passe directement le tableau d'offres tel quel (type Offer[])
  const offersForTab = offers;

  // Mapping pour UsersTab (ajoute name, status à partir de firstName, lastName, etc.)
  const usersForTab = users.map(u => ({
    ...u,
    name: u.firstName + ' ' + u.lastName,
    status: u.isDeleted ? 'Inactif' : 'Actif',
  }));

  // Calcul des revenus mensuels pour le graphique
  const revenueChartData: RevenueChartData = next3Months.map(month => ({
    month,
    revenus: revenueByMonth[month] || 0,
  }));

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Espace administration</h1>
        <Button size="sm" variant="outline" onClick={handleRefresh}>
          Rafraichir les données
        </Button>
      </div>
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
          <TabsTrigger value="events">Événements</TabsTrigger>
          <TabsTrigger value="offers">Offres</TabsTrigger>
          <TabsTrigger value="orders">Commandes</TabsTrigger>
          <TabsTrigger value="tickets">Billets</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <DashboardTab stats={stats} sales={recentSales} revenueChartData={revenueChartData} />
        </TabsContent>
        <TabsContent value="events">
          <EventsTab
            data={events}
            onAdd={async event => {
              try {
                const res = await post<Event>('/api/events', event);
                setEvents(prev => [...prev, res.data]);
                toast({ title: 'Événement créé', description: "L'événement a bien été ajouté." });
              } catch (e) {
                toast({
                  title: 'Erreur',
                  description: "Impossible de créer l'événement.",
                  variant: 'destructive',
                });
              }
            }}
            onEdit={async event => {
              try {
                // On retire l'id du body pour la requête PUT (l'id est déjà dans l'URL)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { id, ...eventData } = event;
                const res = await put<Event>(`/api/events/${id}`, eventData);
                setEvents(prev => prev.map(ev => (ev.id === id ? res.data : ev)));
                toast({
                  title: 'Événement modifié',
                  description: "L'événement a bien été modifié.",
                });
              } catch (e) {
                toast({
                  title: 'Erreur',
                  description: "Impossible de modifier l'événement.",
                  variant: 'destructive',
                });
              }
            }}
            onDelete={async event => {
              try {
                await del(`/api/events/${event.id}`);
                setEvents(prev => prev.filter(ev => ev.id !== event.id));
                toast({
                  title: 'Événement supprimé',
                  description: "L'événement a bien été supprimé.",
                });
              } catch (e) {
                toast({
                  title: 'Erreur',
                  description: "Impossible de supprimer l'événement.",
                  variant: 'destructive',
                });
              }
            }}
            onDisable={async event => {
              try {
                const res = await put<Event>(`/api/events/${event.id}`, {
                  ...event,
                  isDeleted: !event.isDeleted,
                });
                setEvents(prev => prev.map(ev => (ev.id === event.id ? res.data : ev)));
                toast({
                  title: res.data.isDeleted ? 'Événement désactivé' : 'Événement restauré',
                  description: res.data.isDeleted
                    ? "L'événement a bien été désactivé (soft delete)."
                    : "L'événement a bien été restauré.",
                });
              } catch (e) {
                toast({
                  title: 'Erreur',
                  description: "Impossible de changer le statut de l'événement.",
                  variant: 'destructive',
                });
              }
            }}
          />
        </TabsContent>
        <TabsContent value="offers">
          <OffersTab
            data={offersForTab}
            onAdd={async offer => {
              const o = offer as OfferForm;
              try {
                const res = await post<Offer>('/api/offers', {
                  name: o.name,
                  description: o.description,
                  type: o.type,
                  price: o.price,
                  seats: o.seats,
                  eventId: o.eventId || null,
                });
                setOffers(prev => [...prev, res.data]);
                toast({ title: 'Offre créée', description: "L'offre a bien été ajoutée." });
              } catch (e) {
                toast({
                  title: 'Erreur',
                  description: "Impossible de créer l'offre.",
                  variant: 'destructive',
                });
              }
            }}
            onEdit={async offer => {
              const o = offer as Offer;
              try {
                const res = await put<Offer>(`/api/offers/${o.id}`, {
                  name: o.name,
                  description: o.description,
                  type: o.type,
                  price: o.price,
                  seats: o.seats,
                  eventId: o.eventId || null,
                  isActive: o.isActive,
                });
                setOffers(prev => prev.map(of => (of.id === o.id ? res.data : of)));
                toast({ title: 'Offre modifiée', description: "L'offre a bien été modifiée." });
              } catch (e) {
                toast({
                  title: 'Erreur',
                  description: "Impossible de modifier l'offre.",
                  variant: 'destructive',
                });
              }
            }}
            onDelete={async offer => {
              try {
                await del(`/api/offers/${offer.id}`);
                setOffers(prev => prev.filter(o => o.id !== offer.id));
                toast({ title: 'Offre supprimée', description: "L'offre a bien été supprimée." });
              } catch (e) {
                toast({
                  title: 'Erreur',
                  description: "Impossible de supprimer l'offre.",
                  variant: 'destructive',
                });
              }
            }}
            onDisable={async offer => {
              try {
                const res = await put<Offer>(`/api/offers/${offer.id}`, {
                  ...offer,
                  isDeleted: !offer.isDeleted,
                });
                setOffers(prev => prev.map(o => (o.id === offer.id ? res.data : o)));
                toast({
                  title: res.data.isDeleted ? 'Offre désactivée' : 'Offre restaurée',
                  description: res.data.isDeleted
                    ? "L'offre a bien été désactivée (soft delete)."
                    : "L'offre a bien été restaurée.",
                });
              } catch (e) {
                toast({
                  title: 'Erreur',
                  description: "Impossible de changer le statut de l'offre.",
                  variant: 'destructive',
                });
              }
            }}
            events={events}
          />
        </TabsContent>
        <TabsContent value="orders">
          <OrdersTab
            data={orders as OrderWithItems[]}
            onDelete={async order => {
              try {
                await del(`/api/orders/${order.id}`);
                setOrders(prev => prev.filter(o => o.id !== order.id));
                toast({
                  title: 'Commande supprimée',
                  description: 'La commande a bien été supprimée.',
                });
              } catch (e) {
                toast({
                  title: 'Erreur',
                  description: 'Impossible de supprimer la commande.',
                  variant: 'destructive',
                });
              }
            }}
            onDisable={async order => {
              try {
                const res = await put<OrderWithItems>(`/api/orders/${order.id}`, {
                  ...order,
                  isDeleted: !order.isDeleted,
                });
                setOrders(prev => prev.map(o => (o.id === order.id ? res.data : o)));
                toast({
                  title: res.data.isDeleted ? 'Commande désactivée' : 'Commande restaurée',
                  description: res.data.isDeleted
                    ? 'La commande a bien été désactivée (soft delete).'
                    : 'La commande a bien été restaurée.',
                });
              } catch (e) {
                toast({
                  title: 'Erreur',
                  description: 'Impossible de changer le statut de la commande.',
                  variant: 'destructive',
                });
              }
            }}
            users={users}
            onRefresh={handleRefresh}
          />
        </TabsContent>
        <TabsContent value="tickets">
          <TicketsTab
            tickets={orders.flatMap(order => order.orderItems.flatMap(item => item.tickets))}
            users={users}
            orders={orders}
            onRefresh={handleRefresh}
          />
        </TabsContent>
        <TabsContent value="users">
          <UsersTab
            data={usersForTab}
            onDelete={async user => {
              try {
                await del(`/api/users/${user.id}`);
                setUsers(prev => prev.filter(u => u.id !== user.id));
                toast({
                  title: 'Utilisateur supprimé',
                  description: "L'utilisateur a bien été supprimé.",
                });
              } catch (e) {
                toast({
                  title: 'Erreur',
                  description: "Impossible de supprimer l'utilisateur.",
                  variant: 'destructive',
                });
              }
            }}
            onDisable={async user => {
              try {
                const res = await put<User>(`/api/users/${user.id}`, {
                  ...user,
                  isDeleted: !user.isDeleted,
                });
                setUsers(prev =>
                  prev.map(u =>
                    u.id === user.id
                      ? { ...res.data, status: res.data.isDeleted ? 'Inactif' : 'Actif' }
                      : u
                  )
                );
                toast({
                  title: res.data.isDeleted ? 'Utilisateur désactivé' : 'Utilisateur restauré',
                  description: res.data.isDeleted
                    ? "L'utilisateur a bien été désactivé (soft delete)."
                    : "L'utilisateur a bien été restauré.",
                });
              } catch (e) {
                toast({
                  title: 'Erreur',
                  description: "Impossible de changer le statut de l'utilisateur.",
                  variant: 'destructive',
                });
              }
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
