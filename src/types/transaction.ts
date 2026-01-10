export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description?: string;
  category?: string;
  date: string; // ISO format (YYYY-MM-DD)
  createdAt: number; // Timestamp
}

export interface TransactionInput {
  type: TransactionType;
  amount: number;
  description: string; // Obligatoire
  category?: string;
  date: string;
}
