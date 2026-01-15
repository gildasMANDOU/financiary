import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import pb from '@/lib/pocketbase';

// Type pour l'utilisateur PocketBase
interface User {
  id: string;
  email: string;
  username?: string;
  verified: boolean;
  created: string;
  updated: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  register: (email: string, password: string, passwordConfirm: string, username?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Vérifier l'authentification au chargement
  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Vérifier si le token est valide
      if (pb.authStore.isValid) {
        // Recharger les données utilisateur depuis PocketBase
        await pb.collection('users').authRefresh();
        
        // Mapper l'utilisateur PocketBase vers notre format User
        const authModel = pb.authStore.model;
        if (authModel) {
          setUser({
            id: authModel.id,
            email: authModel.email,
            username: authModel.username,
            verified: authModel.verified || false,
            created: authModel.created,
            updated: authModel.updated,
          });
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      // Token invalide ou expiré
      pb.authStore.clear();
      setUser(null);
      setError(null); // Ne pas afficher d'erreur pour un token expiré
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Vérifier l'authentification au montage
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Écouter les changements d'authentification PocketBase
  useEffect(() => {
    const unsubscribe = pb.authStore.onChange((_token, model) => {
      if (model) {
        setUser({
          id: model.id,
          email: model.email,
          username: model.username,
          verified: model.verified || false,
          created: model.created,
          updated: model.updated,
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Connexion
  const login = useCallback(async (email: string, password: string, _remember: boolean = false) => {
    try {
      setIsLoading(true);
      setError(null);

      // Authentification avec PocketBase
      const authData = await pb.collection('users').authWithPassword(email, password);

      // Mapper l'utilisateur
      if (authData.record) {
        setUser({
          id: authData.record.id,
          email: authData.record.email,
          username: authData.record.username,
          verified: authData.record.verified || false,
          created: authData.record.created,
          updated: authData.record.updated,
        });
      }

      // Gestion de la persistance (PocketBase gère automatiquement via cookies/localStorage)
      // Le paramètre "remember" est disponible pour une implémentation future si nécessaire
    } catch (err: any) {
      const errorMessage = err?.response?.message || err?.message || 'Erreur lors de la connexion';
      setError(errorMessage);
      console.error('Erreur lors de la connexion:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Inscription
  const register = useCallback(async (
    email: string,
    password: string,
    passwordConfirm: string,
    username?: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      // Validation côté client
      if (password !== passwordConfirm) {
        throw new Error('Les mots de passe ne correspondent pas');
      }

      if (password.length < 8) {
        throw new Error('Le mot de passe doit contenir au moins 8 caractères');
      }

      // Créer l'utilisateur dans PocketBase
      const userData: any = {
        email,
        password,
        passwordConfirm,
      };

      if (username && username.trim()) {
        userData.username = username.trim();
      }

      await pb.collection('users').create(userData);

      // Après inscription, connecter automatiquement l'utilisateur
      await pb.collection('users').authWithPassword(email, password);

      // Mapper l'utilisateur
      const authModel = pb.authStore.model;
      if (authModel) {
        setUser({
          id: authModel.id,
          email: authModel.email,
          username: authModel.username,
          verified: authModel.verified || false,
          created: authModel.created,
          updated: authModel.updated,
        });
      }
    } catch (err: any) {
      const errorMessage = err?.response?.message || err?.message || 'Erreur lors de l\'inscription';
      setError(errorMessage);
      console.error('Erreur lors de l\'inscription:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Déconnexion
  const logout = useCallback(async () => {
    try {
      setError(null);
      pb.authStore.clear();
      setUser(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la déconnexion';
      setError(errorMessage);
      console.error('Erreur lors de la déconnexion:', err);
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook pour utiliser le contexte
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
