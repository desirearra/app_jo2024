import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LogIn } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { ForgotPasswordForm } from './ForgotPasswordForm';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToLogin: () => void;
}

export function ForgotPasswordModal({ isOpen, onClose, onBackToLogin }: ForgotPasswordModalProps) {
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) firstButtonRef.current?.focus();
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>Mot de passe oublié</DialogTitle>
          </div>
          <DialogDescription>
            Saisissez votre email pour recevoir un lien de réinitialisation.
          </DialogDescription>
        </DialogHeader>
        <ForgotPasswordForm onSuccess={onClose} />
        <DialogFooter className="flex flex-col gap-2">
          <Button
            ref={firstButtonRef}
            variant="outline"
            onClick={onBackToLogin}
            className="w-full"
            type="button"
          >
            <LogIn className="mr-2 h-4 w-4" /> Retour à la connexion
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
