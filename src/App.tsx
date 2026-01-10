import { Routes, Route } from 'react-router-dom';
import { FinanceProvider } from '@/contexts/FinanceContext';
import { Navbar } from '@/components/Navbar';
import { Home } from '@/pages/Home';
import { History } from '@/pages/History';
import { About } from '@/pages/About';

function App() {
  return (
    <FinanceProvider>
      <div className="min-h-screen bg-background">
        {/* Header avec navigation */}
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
                  <span className="text-sm font-bold text-primary-foreground">F</span>
                </div>
                <h1 className="text-xl font-semibold tracking-tight">Financiary</h1>
              </div>
              <Navbar />
            </div>
          </div>
        </header>

        {/* Main Content avec Routes */}
        <main className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/transactions" element={<History />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

        {/* Footer minimaliste */}
        <footer className="border-t border-border/40 mt-16 py-6">
          <div className="container mx-auto px-4 text-center">
            <p className="text-xs text-muted-foreground">
              © 2024 Financiary
            </p>
          </div>
        </footer>
      </div>
    </FinanceProvider>
  );
}

export default App;
