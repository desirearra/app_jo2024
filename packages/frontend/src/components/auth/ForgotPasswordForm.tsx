import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const forgotSchema = z.object({
  email: z.string().email('Email invalide'),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

type ForgotPasswordFormProps = {
  onSuccess?: () => void;
};

/**
 * ForgotPasswordForm component
 * @param onSuccess - callback called on successful submit
 * @returns JSX.Element
 */
export function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  });
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data: ForgotFormValues) => {
    setApiError(null);
    setSuccess(false);
    try {
      // TODO: remplacer par appel API réel quand dispo
      console.log('data', data);

      await new Promise(res => setTimeout(res, 1000));
      setSuccess(true);
      reset();
      onSuccess?.();
    } catch (err) {
      setApiError('Erreur inconnue');
    }
  };

  return (
    <form className="flex flex-col gap-1" onSubmit={handleSubmit(onSubmit)}>
      {apiError && <span className="text-red-500 text-xs">{apiError}</span>}
      {success && (
        <span className="text-green-600 text-xs">
          Si cet email existe, un lien de réinitialisation a été envoyé.
        </span>
      )}
      <Input
        placeholder="Email"
        type="email"
        {...register('email')}
        aria-invalid={!!errors.email}
        aria-label="Email"
        autoComplete="email"
      />
      {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
      <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
        <Mail className="mr-2 h-4 w-4" />
        {isSubmitting ? 'Envoi...' : 'Envoyer le lien de réinitialisation'}
      </Button>
    </form>
  );
}
