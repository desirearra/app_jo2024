import { ConfirmDeleteModal } from '@/components/admin';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { generateFinalKey, generateOrderKey2, generateUserKey1 } from '@/lib/utils';
import { KeyRound, Trash } from 'lucide-react';
import * as React from 'react';

type Order = {
  id: string;
  user: string;
  date: string;
  total: string;
  status: string;
};

type OrdersTabProps = {
  data: Order[];
  onDelete: (order: Order) => void;
};

export function OrdersTab({ data, onDelete }: OrdersTabProps) {
  const { toast } = useToast();
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [orderToDelete, setOrderToDelete] = React.useState<Order | null>(null);
  const [verifyModalOpen, setVerifyModalOpen] = React.useState(false);
  const [orderToVerify, setOrderToVerify] = React.useState<Order | null>(null);
  const [keyInfo, setKeyInfo] = React.useState<{
    key1: string;
    key2: string;
    finalKey: string;
  } | null>(null);
  const [isDecrypted, setIsDecrypted] = React.useState(false);
  const [finalKeys, setFinalKeys] = React.useState<Record<string, string>>({});
  // Simule l'authenticité du billet (à remplacer par une vraie vérification plus tard)
  const isAuthentic = true; // Mettre à false pour tester le bouton "Bloquer le billet"
  const [isBlocked, setIsBlocked] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);

  // Mock user info (à remplacer par recherche réelle plus tard)
  const mockUser = {
    id: 'USR-001',
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    date: '2024-01-01T10:00:00.000Z',
  };

  const handleVerify = async (order: Order) => {
    // Génération des clés mockées
    const key1 = await generateUserKey1(mockUser.email, mockUser.id, mockUser.date);
    const key2 = await generateOrderKey2(order.id, order.date, order.total);
    const finalKey = await generateFinalKey(key1, key2);
    setKeyInfo({ key1, key2, finalKey });
    setOrderToVerify(order);
    setIsDecrypted(false);
    setVerifyModalOpen(true);
  };

  React.useEffect(() => {
    // Calculer les clés finales pour chaque commande au montage ou changement de data
    const computeKeys = async () => {
      const keys: Record<string, string> = {};
      for (const order of data) {
        // Utilise le même mockUser que la modale (à remplacer par vrai user plus tard)
        const key1 = await generateUserKey1(mockUser.email, mockUser.id, mockUser.date);
        const key2 = await generateOrderKey2(order.id, order.date, order.total);
        const finalKey = await generateFinalKey(key1, key2);
        keys[order.id] = finalKey;
      }
      setFinalKeys(keys);
    };
    computeKeys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const columns = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'user', header: 'Utilisateur' },
    { accessorKey: 'date', header: 'Date' },
    { accessorKey: 'total', header: 'Total' },
    { accessorKey: 'status', header: 'Statut' },
    {
      id: 'finalKey',
      header: 'Clé finale (partielle)',
      cell: ({ row }: any) => (
        <span className="font-mono text-xs">{finalKeys[row.original.id]?.slice(0, 16) || '—'}</span>
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
            aria-label="Vérifier la clé"
            onClick={async () => {
              await handleVerify(row.original);
            }}
          >
            <KeyRound className="h-4 w-4 mr-1" />
            Vérifier la clé
          </Button>
          <Button
            size="sm"
            variant="destructive"
            aria-label="Supprimer"
            onClick={() => {
              setOrderToDelete(row.original);
              setDeleteModalOpen(true);
            }}
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
        <h2 className="text-lg font-semibold">Gestion des commandes</h2>
      </div>
      <DataTable columns={columns} data={data} searchPlaceholder="Rechercher une commande..." />
      <ConfirmDeleteModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={() => {
          if (orderToDelete) onDelete(orderToDelete);
          setDeleteModalOpen(false);
        }}
        entityLabel="commande"
      />
      <Dialog open={verifyModalOpen} onOpenChange={setVerifyModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vérification de la clé</DialogTitle>
            <DialogDescription>
              Vérifiez les informations de la commande, de l'utilisateur et la clé générée.
            </DialogDescription>
          </DialogHeader>
          {orderToVerify && keyInfo && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {isAuthentic && !isBlocked ? (
                  <span className="inline-block px-2 py-1 rounded bg-green-200 text-green-800 text-xs font-bold">
                    Billet officiel
                  </span>
                ) : isBlocked ? (
                  <span className="inline-block px-2 py-1 rounded bg-red-200 text-red-800 text-xs font-bold">
                    Billet bloqué
                  </span>
                ) : (
                  <span className="inline-block px-2 py-1 rounded bg-yellow-200 text-yellow-800 text-xs font-bold">
                    Billet non authentique
                  </span>
                )}
              </div>
              <div>
                <span className="font-semibold">Clé finale :</span>
                <div className="break-all text-xs bg-green-100 rounded p-1 mt-1 font-mono">
                  {keyInfo.finalKey}
                </div>
              </div>
              {!isAuthentic && !isBlocked && (
                <Button
                  variant="destructive"
                  className="mt-2"
                  onClick={() => {
                    setIsBlocked(true);
                    toast({
                      title: 'Billet bloqué',
                      description: 'Le billet a été bloqué avec succès.',
                    });
                  }}
                >
                  Bloquer le billet
                </Button>
              )}
              <Button
                variant="default"
                className="mt-2"
                onClick={() => setIsDecrypted(true)}
                disabled={isDecrypted}
              >
                Déchiffrer la clé
              </Button>
              {isDecrypted && (
                <div className="space-y-2 mt-4">
                  <div>
                    <span className="font-semibold">Commande :</span> {orderToVerify.id} —{' '}
                    {orderToVerify.date} — {orderToVerify.total}
                  </div>
                  <div>
                    <span className="font-semibold">Utilisateur :</span> {mockUser.name} (
                    {mockUser.email})
                  </div>
                  <div>
                    <span className="font-semibold">Clé 1 (user) :</span>
                    <div className="break-all text-xs bg-slate-100 rounded p-1 mt-1">
                      {keyInfo.key1}
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold">Clé 2 (commande) :</span>
                    <div className="break-all text-xs bg-slate-100 rounded p-1 mt-1">
                      {keyInfo.key2}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Fermer</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <DialogTitle asChild>
            <h2 className="text-xl font-bold mb-2">Détails de la commande</h2>
          </DialogTitle>
          <DialogDescription>
            Informations détaillées sur la commande sélectionnée.
          </DialogDescription>
          <div className="h-px bg-slate-200 my-4" />
          {selectedOrder && <form className="space-y-3">{/* ... champs ... */}</form>}
        </SheetContent>
      </Sheet>
    </div>
  );
}
