import { Transaction } from '@/types/transaction';
import { STORAGE_KEY } from './constants';

/**
 * Charge les transactions depuis LocalStorage
 * @returns Array de transactions ou array vide si aucune donnée
 */
export function loadTransactions(): Transaction[] {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('LocalStorage n\'est pas disponible');
      return [];
    }

    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return [];
    }

    const transactions = JSON.parse(data) as Transaction[];
    
    // Validation basique
    if (!Array.isArray(transactions)) {
      console.warn('Les données dans LocalStorage ne sont pas un array valide');
      return [];
    }

    return transactions;
  } catch (error) {
    console.error('Erreur lors du chargement des transactions:', error);
    return [];
  }
}

/**
 * Sauvegarde les transactions dans LocalStorage
 * @param transactions Array de transactions à sauvegarder
 */
export function saveTransactions(transactions: Transaction[]): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('LocalStorage n\'est pas disponible');
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des transactions:', error);
    // Gérer les erreurs de quota (LocalStorage plein)
    if (error instanceof DOMException && error.code === 22) {
      console.error('LocalStorage est plein. Impossible de sauvegarder.');
    }
  }
}

/**
 * Vérifie si LocalStorage est disponible
 */
export function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}
