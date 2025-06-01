import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type ConfirmDeleteModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  entityLabel: string;
  actionLabel: string;
  actionVariant?: 'destructive' | 'default';
  confirmMessage?: string;
};

export function ConfirmDeleteModal({
  open,
  onOpenChange,
  onConfirm,
  entityLabel,
  actionLabel,
  actionVariant = 'destructive',
  confirmMessage,
}: ConfirmDeleteModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmer l&apos;action</DialogTitle>
        </DialogHeader>
        <p>
          {confirmMessage ?? `Voulez-vous vraiment ${actionLabel.toLowerCase()} ${entityLabel} ?`}
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button variant={actionVariant} onClick={onConfirm} autoFocus>
            {actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
