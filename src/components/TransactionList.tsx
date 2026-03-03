import { useNavigate } from 'react-router-dom';
import { useFinanceStore } from '@/contexts/FinanceContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, History as HistoryIcon } from 'lucide-react';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import { useAlert } from '@/hooks/useAlert';
import { TransactionItem } from '@/components/TransactionItem';

/**
 * Composant pour afficher la liste complète de toutes les transactions
 * Utilisé sur la page Historique
 */
export function TransactionList() {
  const navigate = useNavigate();
  const { getSortedTransactions, isLoading, filteredTransactions } = useFinanceStore();
  const { confirm, ConfirmDialog } = useConfirmDialog();
  const { alert, Alert } = useAlert();

  // Récupérer les transactions filtrées (triées par date, plus récentes en premier)
  const sortedTransactions = getSortedTransactions(false);

  if (isLoading) {
    return (
      <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
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
    <>
      <Card className="border-border/50 shadow-sm transition-all duration-200 hover:shadow-md bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Toutes les transactions</CardTitle>
          <CardDescription className="text-sm">
            {sortedTransactions.length === 0 
              ? 'Aucune transaction pour cette période'
              : `${sortedTransactions.length} transaction${sortedTransactions.length > 1 ? 's' : ''} trouvée${sortedTransactions.length > 1 ? 's' : ''}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedTransactions.length === 0 ? (
            <div className="text-center py-12 space-y-4 animate-in fade-in-0 duration-300">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <HistoryIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Aucune transaction</p>
                <p className="text-xs text-muted-foreground">Ajustez la période ou ajoutez une transaction</p>
              </div>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="mt-4 transition-all duration-200 hover:scale-105 rounded-xl"
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une transaction
              </Button>
            </div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
              {sortedTransactions.map((transaction, index) => (
                <div
                  key={transaction.id}
                  className="animate-in fade-in-0 slide-in-from-left-4 duration-300"
                  style={{ animationDelay: `${index * 30}ms` }}
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
    </>
  );
}
