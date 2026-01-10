// Clé de stockage LocalStorage
export const STORAGE_KEY = 'financiary_transactions';

// Catégories pour les dépenses
export const EXPENSE_CATEGORIES = [
  'Alimentation',
  'Transport',
  'Logement',
  'Loisirs',
  'Santé',
  'Autres',
] as const;

// Catégories pour les revenus
export const INCOME_CATEGORIES = [
  'Salaire',
  'Freelance',
  'Investissement',
  'Cadeau',
  'Autres',
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];
export type IncomeCategory = typeof INCOME_CATEGORIES[number];
