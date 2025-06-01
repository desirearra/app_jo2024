import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { post } from '@/lib/api';
import { loginSchema } from '@/types/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { LogIn } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { TwoFactorForm } from './TwoFactorForm';

type LoginFormValues = z.infer<typeof loginSchema>;

type LoginFormProps = {
  onSuccess?: () => void;
  onForgotPassword?: () => void;
};

/**
 * LoginForm component
 * @param onSuccess - callback called on successful login
 * @returns JSX.Element
 */
export function LoginForm({ onSuccess, onForgotPassword }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [twoFA, setTwoFA] = useState<{ required: boolean; email: string }>({
    required: false,
    email: '',
  });
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormValues) => {
    setApiError(null);
    setSuccess(false);
    setTwoFA({ required: false, email: '' });
    try {
      const res = await post<{ status: string; email: string; token: string }>(
        '/api/auth/login',
        data
      );
      if (res.status === 202 && res.data?.status === '2FA_REQUIRED' && res.data?.email) {
        setTwoFA({ required: true, email: res.data.email });
        return;
      }
      if (res.data?.token) {
        loginWithToken(res.data.token);
        // Décoder le rôle du token pour la redirection
        const payload = JSON.parse(atob(res.data.token.split('.')[1]));
        if (payload.role === 'admin' || payload.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/compte');
        }
      }
      setSuccess(true);
      reset();
      onSuccess?.();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setApiError(err.response?.data?.error || 'Erreur inconnue');
      } else {
        setApiError('Erreur inconnue');
      }
    }
  };

  if (twoFA.required) {
    return <TwoFactorForm email={twoFA.email} onSuccess={onSuccess} />;
  }

  return (
    <form className="flex flex-col gap-1" onSubmit={handleSubmit(onSubmit)}>
      <Input
        placeholder="Email"
        type="email"
        {...register('email')}
        aria-invalid={!!errors.email}
        aria-label="Email"
        autoComplete="email"
      />
      {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
      <Input
        placeholder="Mot de passe"
        type="password"
        {...register('password')}
        aria-invalid={!!errors.password}
        aria-label="Mot de passe"
        autoComplete="current-password"
        className="mt-4"
      />
      {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
      {apiError && <span className="text-red-500 text-xs">{apiError}</span>}
      {success && <span className="text-green-600 text-xs">Connexion réussie !</span>}
      <div className="flex justify-end mt-1">
        <button
          type="button"
          className="text-xs text-primary underline hover:text-primary/80 focus:outline-none"
          onClick={onForgotPassword}
        >
          Mot de passe oublié&nbsp;?
        </button>
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
        <LogIn className="mr-2 h-4 w-4" />
        {isSubmitting ? 'Connexion...' : 'Se connecter'}
      </Button>
    </form>
  );
}
