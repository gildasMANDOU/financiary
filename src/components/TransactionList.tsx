import { useNavigate } from 'react-router-dom';
import { useFinanceStore } from '@/contexts/FinanceContext';
import { Transaction } from '@/types/transaction';
import { formatDateShort } from '@/utils/dateUtils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowDownRight, Trash2, Plus } from 'lucide-react';

/**
 * Composant pour afficher la liste complète de toutes les transactions
 * Utilisé sur la page Historique
 */
export function TransactionList() {
  const navigate = useNavigate();
  const { getSortedTransactions, isLoading } = useFinanceStore();

  // Récupérer TOUTES les transactions (triées par date, plus récentes en premier)
  const allTransactions = getSortedTransactions(false);

  if (isLoading) {
    return (
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">Chargement...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Toutes les transactions</CardTitle>
        <CardDescription className="text-sm">
          {allTransactions.length === 0 
            ? 'Aucune transaction enregistrée'
            : `${allTransactions.length} transaction${allTransactions.length > 1 ? 's' : ''}`
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {allTransactions.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <p className="text-sm text-muted-foreground">Aucune transaction</p>
            <p className="text-xs text-muted-foreground">Commencez par ajouter votre première transaction</p>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="mt-4"
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une transaction
            </Button>
          </div>
        ) : (
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {allTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Composant interne pour afficher une transaction - Style Apple épuré
function TransactionItem({ transaction }: { transaction: Transaction }) {
  const { deleteTransaction } = useFinanceStore();
  const isIncome = transaction.type === 'income';

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
    }).format(amount);
  };

  const handleDelete = async () => {
    if (confirm('Supprimer cette transaction ?')) {
      try {
        await deleteTransaction(transaction.id);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Une erreur est survenue lors de la suppression de la transaction');
      }
    }
  };

  return (
    <div className="group flex items-center gap-3 rounded-xl border border-border/50 bg-card p-4 transition-all hover:border-border hover:shadow-sm">
      {/* Icône */}
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
        isIncome 
          ? 'bg-income-light text-income' 
          : 'bg-expense-light text-expense'
      }`}>
        {isIncome ? (
          <ArrowUpRight className="h-4 w-4" />
        ) : (
          <ArrowDownRight className="h-4 w-4" />
        )}
      </div>

      {/* Informations */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={`text-base font-semibold ${
            isIncome ? 'text-income' : 'text-expense'
          }`}>
            {formatCurrency(transaction.amount)}
          </span>
          {transaction.category && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {transaction.category}
            </span>
          )}
        </div>
        {transaction.description && (
          <p className="mt-0.5 text-sm text-muted-foreground truncate">
            {transaction.description}
          </p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          {formatDateShort(transaction.date)}
        </p>
      </div>

      {/* Bouton de suppression */}
      <button
        onClick={handleDelete}
        className="opacity-0 p-2 text-muted-foreground transition-all hover:text-destructive group-hover:opacity-100"
        aria-label="Supprimer"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
