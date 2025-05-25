import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RegisterForm } from '@/pages/auth/register';
import { LogIn, UserPlus } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) firstButtonRef.current?.focus();
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <UserPlus className="text-primary" />
            <DialogTitle>Créer un compte</DialogTitle>
          </div>
          <DialogDescription>
            Inscrivez-vous pour commander vos billets et profiter de tous les avantages.
          </DialogDescription>
        </DialogHeader>
        <RegisterForm onSuccess={onClose} />
        <DialogFooter className="flex flex-col gap-2">
          <Button
            ref={firstButtonRef}
            variant="outline"
            onClick={onSwitchToLogin}
            className="w-full"
            type="button"
          >
            <LogIn className="mr-2 h-4 w-4" /> Se connecter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
