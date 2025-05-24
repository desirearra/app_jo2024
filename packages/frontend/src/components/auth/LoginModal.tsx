import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LoginForm } from '@/pages/auth/login';
import { LogIn, UserPlus } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) firstButtonRef.current?.focus();
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <LogIn className="text-primary" />
            <DialogTitle>Connexion requise</DialogTitle>
          </div>
          <DialogDescription>
            Connectez-vous pour poursuivre votre commande ou accéder à votre compte.
          </DialogDescription>
        </DialogHeader>
        <LoginForm onSuccess={onClose} />
        <DialogFooter className="flex flex-col gap-2">
          <Button
            ref={firstButtonRef}
            variant="outline"
            onClick={onSwitchToRegister}
            className="w-full"
            type="button"
          >
            <UserPlus className="mr-2 h-4 w-4" /> Créer un compte
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
