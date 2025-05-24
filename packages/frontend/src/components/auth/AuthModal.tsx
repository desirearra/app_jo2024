import { useState } from 'react';
import { LoginModal } from './LoginModal';
import { RegisterModal } from './RegisterModal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  if (mode === 'login') {
    return (
      <LoginModal
        isOpen={isOpen}
        onClose={onClose}
        onSwitchToRegister={() => setMode('register')}
      />
    );
  }
  return (
    <RegisterModal isOpen={isOpen} onClose={onClose} onSwitchToLogin={() => setMode('login')} />
  );
}
