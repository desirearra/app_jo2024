import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { post } from '@/lib/api';
import type { AxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Props for TwoFactorForm
 * @param email string - Email de l'utilisateur à vérifier
 * @param onSuccess? - Callback to be called on successful 2FA
 */
type TwoFactorFormProps = {
  email: string;
  onSuccess?: () => void;
};

/**
 * TwoFactorForm - Formulaire de saisie du code 2FA
 * @param email - email utilisateur
 * @param onSuccess - Callback to be called on successful 2FA
 * @returns JSX.Element
 */
export function TwoFactorForm({ email, onSuccess }: TwoFactorFormProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await post<{ token: string }>('/api/auth/2fa/verify', { email, code });
      if (res.status === 200 && res.data?.token) {
        loginWithToken?.(res.data.token);
        const payload = JSON.parse(atob(res.data.token.split('.')[1]));
        if (payload.role === 'admin' || payload.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/account');
        }
        onSuccess?.();
        return;
      }
      setError('Erreur inattendue lors de la vérification 2FA');
    } catch (err) {
      if (isAxiosErrorWithErrorString(err)) {
        setError(err.response?.data?.error || 'Code invalide ou erreur serveur');
      } else {
        setError('Code invalide ou erreur serveur');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Type guard pour AxiosError<{ error: string }>
   */
  function isAxiosErrorWithErrorString(error: unknown): error is AxiosError<{ error: string }> {
    return (
      typeof error === 'object' &&
      error !== null &&
      'isAxiosError' in error &&
      (error as AxiosError).isAxiosError === true
    );
  }

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
      <Input
        placeholder="Code 2FA reçu par email"
        value={code}
        onChange={e => setCode(e.target.value)}
        aria-label="Code 2FA"
        autoFocus
        required
      />
      {error && <span className="text-red-500 text-xs">{error}</span>}
      <Button type="submit" disabled={isSubmitting || !code} className="w-full mt-2">
        {isSubmitting ? 'Vérification...' : 'Valider le code'}
      </Button>
    </form>
  );
}
