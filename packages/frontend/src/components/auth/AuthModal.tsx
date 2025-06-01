import { useState } from 'react';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { LoginModal } from './LoginModal';
import { RegisterModal } from './RegisterModal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');

  if (mode === 'login') {
    return (
      <LoginModal
        isOpen={isOpen}
        onClose={onClose}
        onSwitchToRegister={() => setMode('register')}
        onForgotPassword={() => setMode('forgot')}
      />
    );
  }
  if (mode === 'register') {
    return (
      <RegisterModal isOpen={isOpen} onClose={onClose} onSwitchToLogin={() => setMode('login')} />
    );
  }
  if (mode === 'forgot') {
    return (
      <ForgotPasswordModal
        isOpen={isOpen}
        onClose={onClose}
        onBackToLogin={() => setMode('login')}
      />
    );
  }
  return null;
}
