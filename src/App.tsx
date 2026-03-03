import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { FinanceProvider } from '@/contexts/FinanceContext';
import { Navbar } from '@/components/Navbar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Home } from '@/pages/Home';
import { History } from '@/pages/History';
import { About } from '@/pages/About';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';

function AppContent() {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header avec navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-in slide-in-from-top duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            <Link 
              to={isAuthenticated ? '/' : '/about'} 
              className="flex items-center gap-2 transition-transform duration-200 hover:scale-105"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm overflow-hidden border border-border/20">
                <img src="/financiary-logo-icon.png" alt="Logo" className="h-7 w-7 object-contain" />
              </div>
              <img src="/financiary-nom-texte.png" alt="Financiary" className="h-6 sm:h-7 object-contain hidden xs:block" />
              <h1 className="text-lg sm:text-xl font-bold tracking-tight xs:hidden">Financiary</h1>
            </Link>
            <Navbar />
          </div>
        </div>
      </header>

      {/* Main Content avec Routes */}
      <main className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
        <Routes>
          {/* Routes publiques */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          
          {/* Routes protégées */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          
          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer minimaliste */}
      <footer className="border-t border-border/40 mt-16 py-6 animate-in fade-in-0 duration-500">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            © 2024 Financ
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <AppContent />
      </FinanceProvider>
    </AuthProvider>
  );
}

export default App;
