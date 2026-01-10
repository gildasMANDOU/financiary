import { Transaction } from '@/types/transaction';

/**
 * Calcule le solde actuel (revenus - dépenses)
 */
export function calculateBalance(transactions: Transaction[]): number {
  const totalIncome = calculateTotalIncome(transactions);
  const totalExpenses = calculateTotalExpenses(transactions);
  return totalIncome - totalExpenses;
}

/**
 * Calcule le total des revenus
 */
export function calculateTotalIncome(transactions: Transaction[]): number {
  return transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Calcule le total des dépenses
 */
export function calculateTotalExpenses(transactions: Transaction[]): number {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Filtre les transactions par type
 */
export function filterTransactionsByType(
  transactions: Transaction[],
  type: 'expense' | 'income' | 'all'
): Transaction[] {
  if (type === 'all') {
    return transactions;
  }
  return transactions.filter(t => t.type === type);
}

/**
 * Trie les transactions par date (plus récentes en premier)
 */
export function sortTransactionsByDate(
  transactions: Transaction[],
  ascending: boolean = false
): Transaction[] {
  return [...transactions].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
}
