import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { post } from '@/lib/api';
import { registerSchema } from '@/types/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { CheckCircle2, UserPlus, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Types
/**
 * Props for RegisterForm
 * @param onSuccess - callback called on successful registration
 */
type RegisterFormProps = {
  onSuccess?: () => void;
};

/**
 * Form values for registration
 */
type RegisterFormValues = z.infer<typeof registerSchema>;

/**
 * RegisterForm component
 * @param onSuccess - callback called on successful registration
 * @returns JSX.Element
 */
export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });
  const [apiError, setApiError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const { loginWithToken } = useAuth();
  const { toast } = useToast();

  // Password rules
  const rules = [
    {
      label: '8 caractères minimum',
      valid: password.length >= 8,
    },
    {
      label: '1 majuscule',
      valid: /[A-Z]/.test(password),
    },
    {
      label: '1 chiffre',
      valid: /\d/.test(password),
    },
    {
      label: '1 caractère spécial',
      valid: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    },
  ];

  const onSubmit = async (data: RegisterFormValues) => {
    setApiError(null);
    try {
      const res = await post<{ token: string }>('/api/auth/register', {
        ...data,
        password: data.password.trim(),
      });
      if (res.data?.token) {
        loginWithToken(res.data.token);
        toast({
          title: 'Bienvenue !',
          description: 'Votre compte a été créé et vous êtes connecté.',
        });
        reset();
        onSuccess?.();
      } else {
        setApiError('Erreur inattendue lors de la création du compte');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setApiError(err.response?.data?.error || 'Erreur inconnue');
      } else {
        setApiError('Erreur inconnue');
      }
    }
  };

  return (
    <form className="flex flex-col gap-1" onSubmit={handleSubmit(onSubmit)}>
      {apiError && <span className="text-red-500 text-xs">{apiError}</span>}
      <Input
        placeholder="Prénom"
        {...register('firstName')}
        aria-invalid={!!errors.firstName}
        aria-label="Prénom"
        autoComplete="given-name"
      />
      {errors.firstName && <span className="text-red-500 text-xs">{errors.firstName.message}</span>}
      <Input
        placeholder="Nom"
        {...register('lastName')}
        aria-invalid={!!errors.lastName}
        aria-label="Nom"
        autoComplete="family-name"
        className="mt-4"
      />
      {errors.lastName && <span className="text-red-500 text-xs">{errors.lastName.message}</span>}
      <Input
        placeholder="Email"
        type="email"
        {...register('email')}
        aria-invalid={!!errors.email}
        aria-label="Email"
        autoComplete="email"
        className="mt-4"
      />
      {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
      <Input
        placeholder="Mot de passe"
        type="password"
        {...register('password', {
          onChange: e => setPassword(e.target.value),
        })}
        aria-invalid={!!errors.password}
        aria-label="Mot de passe"
        autoComplete="new-password"
        className="mt-4"
      />
      {/* Feedback dynamique sur la force du mot de passe */}
      <ul className="flex flex-col gap-1 mt-1 mb-2">
        {rules.map(rule => (
          <li key={rule.label} className="flex items-center gap-2 text-xs">
            {rule.valid ? (
              <CheckCircle2 className="text-green-600 w-4 h-4" aria-hidden />
            ) : (
              <XCircle className="text-red-500 w-4 h-4" aria-hidden />
            )}
            <span className={rule.valid ? 'text-green-700' : 'text-red-500'}>{rule.label}</span>
          </li>
        ))}
      </ul>
      {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
      <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
        <UserPlus className="text-white" />
        {isSubmitting ? 'Inscription...' : 'Créer un compte'}
      </Button>
    </form>
  );
}
