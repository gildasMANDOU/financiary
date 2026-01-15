import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home as HomeIcon, History, Info, LogIn, LogOut, User, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

/**
 * Menu mobile hamburger pour la navigation
 * Affiche un menu déroulant sur mobile
 */
export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const publicNavItems = [
    {
      path: '/about',
      label: 'À propos',
      icon: Info,
    },
  ];

  const protectedNavItems = [
    {
      path: '/',
      label: 'Accueil',
      icon: HomeIcon,
    },
    {
      path: '/transactions',
      label: 'Historique',
      icon: History,
    },
    {
      path: '/about',
      label: 'À propos',
      icon: Info,
    },
  ];

  const navItems = isAuthenticated ? protectedNavItems : publicNavItems;

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="sm:hidden relative">
      {/* Bouton hamburger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors z-50 relative"
        aria-label="Menu"
      >
        {isOpen ? (
          <X className="h-5 w-5 animate-in fade-in-0 duration-200" />
        ) : (
          <Menu className="h-5 w-5 animate-in fade-in-0 duration-200" />
        )}
      </button>

      {/* Menu déroulant */}
      {isOpen && (
        <div className="fixed top-[56px] sm:top-[64px] left-4 right-4 bg-background border border-border/50 rounded-xl shadow-lg backdrop-blur-sm animate-in slide-in-from-top-2 fade-in-0 duration-200 z-[60]">
          <div className="p-2 space-y-1">
            {/* Liens de navigation */}
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Séparateur */}
            {isAuthenticated && (
              <>
                <div className="h-px bg-border/50 my-2" />
                
                {/* Info utilisateur */}
                <div className="px-4 py-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span className="truncate">
                    {user?.username || user?.email || 'Utilisateur'}
                  </span>
                </div>

                {/* Bouton déconnexion */}
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Déconnexion</span>
                </Button>
              </>
            )}

            {/* Lien connexion si non authentifié */}
            {!isAuthenticated && (
              <>
                <div className="h-px bg-border/50 my-2" />
                <Link
                  to="/login"
                  onClick={handleLinkClick}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                    location.pathname === '/login'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                >
                  <LogIn className="h-5 w-5" />
                  <span>Connexion</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Overlay pour fermer le menu */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[55] animate-in fade-in-0 duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
