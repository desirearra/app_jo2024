import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface AuthFormData {
  email: string;
  password: string;
  nom?: string;
  prenom?: string;
  confirmPassword?: string;
}

export function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname !== '/auth/register');
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    nom: '',
    prenom: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        // Logique de connexion
        console.log('Connexion:', { email: formData.email, password: formData.password });
        // Rediriger vers la page précédente ou la page d'accueil
        navigate(-1);
      } else {
        // Vérifier que les mots de passe correspondent
        if (formData.password !== formData.confirmPassword) {
          alert('Les mots de passe ne correspondent pas');
          return;
        }
        // Logique d'inscription
        console.log('Inscription:', formData);
        // Récupérer l'offre sélectionnée si elle existe
        const selectedOffre = localStorage.getItem('selectedOffre');
        if (selectedOffre) {
          // Rediriger vers le processus d'achat
          const offre = JSON.parse(selectedOffre);
          navigate(`/checkout/${offre.id}`);
          localStorage.removeItem('selectedOffre');
        } else {
          // Rediriger vers la page d'accueil
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg"
      >
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            {isLogin ? 'Connexion' : 'Inscription'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? (
              <>
                Pas encore de compte ?{' '}
                <button
                  onClick={() => setIsLogin(false)}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  S&apos;inscrire
                </button>
              </>
            ) : (
              <>
                Déjà un compte ?{' '}
                <button
                  onClick={() => setIsLogin(true)}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Se connecter
                </button>
              </>
            )}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
                  Prénom
                </label>
                <input
                  id="prenom"
                  name="prenom"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.prenom}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                  Nom
                </label>
                <input
                  id="nom"
                  name="nom"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.nom}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
          )}

          <div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              {isLogin ? 'Se connecter' : "S'inscrire"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
