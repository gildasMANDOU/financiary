import { useFinanceStore } from '@/contexts/FinanceContext';
import { Transaction } from '@/types/transaction';
import { formatDateShort } from '@/utils/dateUtils';
import { ArrowUpRight, ArrowDownRight, Trash2 } from 'lucide-react';

interface TransactionItemProps {
  transaction: Transaction;
  confirm: (message: string, callback: () => void, options?: any) => void;
  alert: (message: string, options?: any) => void;
}

/**
 * Composant pour afficher une transaction individuelle
 * Style Apple épuré, mobile-first
 * Utilisé dans Dashboard et TransactionList
 */
export function TransactionItem({ transaction, confirm, alert }: TransactionItemProps) {
  const { deleteTransaction } = useFinanceStore();
  const isIncome = transaction.type === 'income';

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
    }).format(amount);
  };

  const handleDelete = () => {
    confirm(
      'Êtes-vous sûr de vouloir supprimer cette transaction ? Cette action est irréversible.',
      async () => {
        try {
          await deleteTransaction(transaction.id);
        } catch (error) {
          console.error('Erreur lors de la suppression:', error);
          alert('Une erreur est survenue lors de la suppression de la transaction', {
            variant: 'destructive',
            title: 'Erreur',
          });
        }
      },
      {
        title: 'Supprimer la transaction',
        confirmText: 'Supprimer',
        cancelText: 'Annuler',
        variant: 'destructive',
      }
    );
  };

  return (
    <div className="group flex items-center gap-3 rounded-xl border border-border/50 bg-card p-4 transition-all duration-200 hover:border-border hover:shadow-md hover:scale-[1.02]">
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

      {/* Bouton de suppression - Toujours visible sur mobile, au hover sur desktop */}
      <button
        onClick={handleDelete}
        className="opacity-100 sm:opacity-0 p-2 text-muted-foreground transition-all hover:text-destructive sm:group-hover:opacity-100 active:scale-95"
        aria-label="Supprimer"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
