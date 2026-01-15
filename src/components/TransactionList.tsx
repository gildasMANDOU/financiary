import { useNavigate } from 'react-router-dom';
import { useFinanceStore } from '@/contexts/FinanceContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import { useAlert } from '@/hooks/useAlert';
import { TransactionItem } from '@/components/TransactionItem';

/**
 * Composant pour afficher la liste complète de toutes les transactions
 * Utilisé sur la page Historique
 */
export function TransactionList() {
  const navigate = useNavigate();
  const { getSortedTransactions, isLoading } = useFinanceStore();
  const { confirm, ConfirmDialog } = useConfirmDialog();
  const { alert, Alert } = useAlert();

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
    <>
      <Card className="border-border/50 shadow-sm transition-all duration-200 hover:shadow-md">
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
            <div className="text-center py-12 space-y-4 animate-in fade-in-0 duration-300">
              <p className="text-sm text-muted-foreground">Aucune transaction</p>
              <p className="text-xs text-muted-foreground">Commencez par ajouter votre première transaction</p>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="mt-4 transition-all duration-200 hover:scale-105"
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une transaction
              </Button>
            </div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {allTransactions.map((transaction, index) => (
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
    </>
  );
}
