import { useNavigate } from 'react-router-dom';
import { useFinanceStore } from '@/contexts/FinanceContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Wallet, Plus } from 'lucide-react';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import { useAlert } from '@/hooks/useAlert';
import { TransactionItem } from '@/components/TransactionItem';

export function Dashboard() {
  const navigate = useNavigate();
  const {
    balance,
    totalIncome,
    totalExpenses,
    getSortedTransactions,
  } = useFinanceStore();
  const { confirm, ConfirmDialog } = useConfirmDialog();
  const { alert, Alert } = useAlert();

  // Récupérer les 5 dernières transactions (triées par date, plus récentes en premier)
  const recentTransactions = getSortedTransactions(false).slice(0, 5);

  // Formater les montants en euros
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Section Solde et Totaux - Mobile First */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Solde Actuel - Style Apple épuré */}
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
              {formatCurrency(balance)}
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
              {formatCurrency(totalIncome)}
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
              {formatCurrency(totalExpenses)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section Dernières Transactions - Style Apple */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Dernières transactions</CardTitle>
          <CardDescription className="text-sm">
            Vos 5 transactions les plus récentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentTransactions.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <p className="text-sm text-muted-foreground">Aucune transaction</p>
              <p className="text-xs text-muted-foreground">Commencez par ajouter votre première transaction</p>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                size="sm"
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une transaction
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {recentTransactions.map((transaction, index) => (
                <div
                  key={transaction.id}
                  className="animate-in fade-in-0 slide-in-from-left-4 duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TransactionItem 
                    transaction={transaction} 
                    confirm={confirm} 
                    alert={alert} 
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <ConfirmDialog />
      <Alert />
    </div>
  );
}
