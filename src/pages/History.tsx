import { TransactionList } from '@/components/TransactionList';
import { ExpenseChart } from '@/components/ExpenseChart';
import { useFinanceStore } from '@/contexts/FinanceContext';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

/**
 * Page Historique (/transactions)
 * Contient la liste complète de toutes les transactions + graphique
 */
export function History() {
  const { balance, totalIncome, totalExpenses, isLoading } = useFinanceStore();

  // Formater les montants en XOF
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="mb-6 animate-in fade-in-0 slide-in-from-left-4 duration-500 delay-100">
        <h2 className="text-2xl font-semibold mb-2">Historique financier</h2>
        <p className="text-sm text-muted-foreground">
          Consultez votre solde, toutes vos transactions et vos statistiques
        </p>
      </div>

      {/* Section Solde et Totaux */}
      <div className="grid gap-4 sm:grid-cols-2 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-200">
        {/* Solde Actuel */}
        <Card className={`sm:col-span-2 border-border/50 shadow-sm overflow-hidden ${
          balance >= 0 
            ? 'bg-gradient-to-br from-income-light/30 to-background border-income/20' 
            : 'bg-gradient-to-br from-expense-light/30 to-background border-expense/20'
        }`}>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2 text-xs font-medium">
              <Wallet className="h-3.5 w-3.5" />
              Solde actuel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl sm:text-4xl font-bold tracking-tight ${
              balance >= 0 ? 'text-income' : 'text-expense'
            }`}>
              {isLoading ? '...' : formatCurrency(balance)}
            </div>
          </CardContent>
        </Card>

        {/* Total Revenus */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2 text-xs font-medium">
              <TrendingUp className="h-3.5 w-3.5 text-income" />
              Revenus
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-income tracking-tight">
              {isLoading ? '...' : formatCurrency(totalIncome)}
            </div>
          </CardContent>
        </Card>

        {/* Total Dépenses */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2 text-xs font-medium">
              <TrendingDown className="h-3.5 w-3.5 text-expense" />
              Dépenses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-expense tracking-tight">
              {isLoading ? '...' : formatCurrency(totalExpenses)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste complète des transactions */}
      <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-300">
        <TransactionList />
      </div>

      {/* Graphique des dépenses par catégorie */}
      <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-400">
        <ExpenseChart />
      </div>
    </div>
  );
}
