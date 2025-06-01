import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { UserPlus } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { LoginForm } from './LoginForm';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onForgotPassword: () => void;
}

export function LoginModal({
  isOpen,
  onClose,
  onSwitchToRegister,
  onForgotPassword,
}: LoginModalProps) {
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) firstButtonRef.current?.focus();
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>Connexion requise</DialogTitle>
          </div>
          <DialogDescription>
            Connectez-vous pour poursuivre votre commande ou accéder à votre compte.
          </DialogDescription>
        </DialogHeader>
        <LoginForm onSuccess={onClose} onForgotPassword={onForgotPassword} />
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
