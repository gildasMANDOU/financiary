import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home as HomeIcon, History, Info, LogIn, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { MobileMenu } from '@/components/MobileMenu';

/**
 * Barre de navigation entre les pages
 * Responsive : menu hamburger sur mobile, menu horizontal sur desktop
 * Cycle 3 : Menu utilisateur avec déconnexion si authentifié
 */
export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
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

  return (
    <>
      {/* Menu mobile (hamburger) */}
      <div className="sm:hidden">
        <MobileMenu />
      </div>

      {/* Menu desktop (horizontal) */}
      <nav className="hidden sm:flex items-center gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* Menu utilisateur */}
        {isAuthenticated ? (
          <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border/40">
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="max-w-[120px] truncate">
                {user?.username || user?.email || 'Utilisateur'}
              </span>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 transition-all duration-200 hover:scale-105"
            >
              <LogOut className="h-4 w-4" />
              <span>Déconnexion</span>
            </Button>
          </div>
        ) : (
          <Link
            to="/login"
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ml-2',
              location.pathname === '/login'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            )}
          >
            <LogIn className="h-4 w-4" />
            <span>Connexion</span>
          </Link>
        )}
      </nav>
    </>
  );
}
