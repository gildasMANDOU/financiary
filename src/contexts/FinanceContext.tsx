import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { Transaction, TransactionInput } from '@/types/transaction';
import pb from '@/lib/pocketbase';
import {
  calculateBalance,
  calculateTotalIncome,
  calculateTotalExpenses,
  filterTransactionsByType,
  sortTransactionsByDate,
  filterTransactionsByPeriod,
} from '@/utils/calculations';

// Type pour les enregistrements PocketBase
interface PocketBaseRecord {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  description: string;
  amount: number;
  category?: string;
  type: 'expense' | 'income';
  date: string;
  userId?: string; // Cycle 3 : ID de l'utilisateur propriétaire
}

// Mapper un enregistrement PocketBase vers Transaction
function mapPocketBaseToTransaction(record: PocketBaseRecord): Transaction {
  return {
    id: record.id,
    type: record.type,
    amount: record.amount,
    description: record.description,
    category: record.category,
    date: record.date,
    createdAt: new Date(record.created).getTime(),
  };
}

interface FinanceContextType {
  // Données
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  
  // Filtres
  period: 'current_month' | 'last_7_days' | 'last_30_days' | 'current_year' | 'all';
  setPeriod: (period: 'current_month' | 'last_7_days' | 'last_30_days' | 'current_year' | 'all') => void;
  
  // Calculs
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  
  // Actions (maintenant asynchrones)
  addTransaction: (input: TransactionInput) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  getTransactionById: (id: string) => Transaction | undefined;
  
  // Filtres et tris
  getTransactionsByType: (type: 'expense' | 'income' | 'all') => Transaction[];
  getSortedTransactions: (ascending?: boolean) => Transaction[];
  
  // État
  isLoading: boolean;
  error: string | null;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [period, setPeriod] = useState<'current_month' | 'last_7_days' | 'last_30_days' | 'current_year' | 'all'>('current_month');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour recharger les transactions depuis PocketBase
  const reloadTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Vérifier l'authentification (Cycle 3)
      if (!pb.authStore.isValid || !pb.authStore.model) {
        setTransactions([]);
        setIsLoading(false);
        return;
      }
      
      // Récupérer les transactions de l'utilisateur connecté
      // Les API Rules PocketBase filtrent automatiquement par userId
      const records = await pb.collection('transactions').getFullList<PocketBaseRecord>({
        sort: '-created', // Plus récentes en premier
        // Le filtrage par userId est géré automatiquement par les API Rules
      });
      
      // Mapper les enregistrements PocketBase vers le format Transaction
      const mappedTransactions = records.map(mapPocketBaseToTransaction);
      setTransactions(mappedTransactions);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des données';
      setError(errorMessage);
      console.error('Erreur lors du chargement depuis PocketBase:', err);
      setTransactions([]); // En cas d'erreur, vider la liste
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Charger les transactions depuis PocketBase au montage
  useEffect(() => {
    reloadTransactions();
  }, [reloadTransactions]);

  // Transactions filtrées par période
  const filteredTransactions = useMemo(() => {
    return filterTransactionsByPeriod(transactions, period);
  }, [transactions, period]);

  // Calculs mémorisés basés sur les transactions filtrées
  const balance = useMemo(() => calculateBalance(filteredTransactions), [filteredTransactions]);
  const totalIncome = useMemo(() => calculateTotalIncome(filteredTransactions), [filteredTransactions]);
  const totalExpenses = useMemo(() => calculateTotalExpenses(filteredTransactions), [filteredTransactions]);

  // Ajouter une transaction
  const addTransaction = useCallback(async (input: TransactionInput) => {
    try {
      setError(null);
      
      // Vérifier l'authentification (Cycle 3)
      if (!pb.authStore.isValid || !pb.authStore.model) {
        throw new Error('Vous devez être connecté pour ajouter une transaction');
      }
      
      // Validation : description obligatoire
      if (!input.description || !input.description.trim()) {
        throw new Error('La description est obligatoire');
      }
      
      // Obtenir l'ID de l'utilisateur connecté
      const userId = pb.authStore.model.id;
      
      // Préparer les données pour PocketBase
      const transactionData: any = {
        type: input.type,
        amount: input.amount,
        description: input.description.trim(),
        date: input.date,
        userId: userId,
      };
      
      if (input.category && input.category.trim()) {
        transactionData.category = input.category.trim();
      }
      
      // Créer la transaction dans PocketBase
      try {
        await pb.collection('transactions').create<PocketBaseRecord>(transactionData);
      } catch (firstError: any) {
        // Fallback si userId n'existe pas encore
        if (firstError?.response?.status === 400 && 
            firstError?.response?.data && 
            Object.keys(firstError.response.data).length === 0) {
          const { userId: _, ...dataWithoutUserId } = transactionData;
          await pb.collection('transactions').create<PocketBaseRecord>(dataWithoutUserId);
        } else {
          throw firstError;
        }
      }
      
      // Recharger toutes les transactions depuis le serveur pour garantir la cohérence
      await reloadTransactions();
    } catch (err: any) {
      let errorMessage = 'Erreur lors de l\'ajout de la transaction';
      if (err?.response) {
        const pbError = err.response;
        if (pbError.status === 400 && pbError.data && Object.keys(pbError.data).length === 0) {
          errorMessage = 'Le champ "userId" n\'existe pas dans la collection "transactions".';
        } else if (pbError.message) {
          errorMessage = pbError.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [reloadTransactions]);

  // Supprimer une transaction
  const deleteTransaction = useCallback(async (id: string) => {
    try {
      setError(null);
      
      // Supprimer la transaction dans PocketBase
      await pb.collection('transactions').delete(id);
      
      // Recharger toutes les transactions depuis le serveur pour garantir la cohérence
      await reloadTransactions();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression de la transaction';
      setError(errorMessage);
      console.error('Erreur lors de la suppression de la transaction:', err);
      throw err; // Propager l'erreur pour que le composant puisse la gérer
    }
  }, [reloadTransactions]);

  // Récupérer une transaction par ID
  const getTransactionById = useCallback(
    (id: string): Transaction | undefined => {
      return transactions.find(t => t.id === id);
    },
    [transactions]
  );

  // Filtrer les transactions par type
  const getTransactionsByType = useCallback(
    (type: 'expense' | 'income' | 'all'): Transaction[] => {
      return filterTransactionsByType(filteredTransactions, type);
    },
    [filteredTransactions]
  );

  // Obtenir les transactions triées par date
  const getSortedTransactions = useCallback(
    (ascending: boolean = false): Transaction[] => {
      return sortTransactionsByDate(filteredTransactions, ascending);
    },
    [filteredTransactions]
  );

  const value: FinanceContextType = {
    transactions,
    filteredTransactions,
    period,
    setPeriod,
    balance,
    totalIncome,
    totalExpenses,
    addTransaction,
    deleteTransaction,
    getTransactionById,
    getTransactionsByType,
    getSortedTransactions,
    isLoading,
    error,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

// Hook pour utiliser le contexte
export function useFinanceStore(): FinanceContextType {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinanceStore must be used within a FinanceProvider');
  }
  return context;
}
