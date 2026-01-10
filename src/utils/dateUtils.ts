import { format, isValid, parseISO } from 'date-fns';

/**
 * Retourne la date du jour au format ISO (YYYY-MM-DD)
 */
export function getTodayDate(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/**
 * Formate une date ISO pour l'affichage
 * @param dateString Date au format ISO (YYYY-MM-DD)
 * @returns Date formatée (ex: "15 janvier 2024")
 */
export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) {
      return dateString;
    }
    // Format simple sans locale pour éviter les dépendances supplémentaires
    return format(date, 'd MMMM yyyy');
  } catch {
    return dateString;
  }
}

/**
 * Formate une date ISO pour l'affichage court
 * @param dateString Date au format ISO (YYYY-MM-DD)
 * @returns Date formatée (ex: "15/01/2024")
 */
export function formatDateShort(dateString: string): string {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) {
      return dateString;
    }
    return format(date, 'dd/MM/yyyy');
  } catch {
    return dateString;
  }
}

/**
 * Valide qu'une chaîne est une date ISO valide
 */
export function isValidDate(dateString: string): boolean {
  try {
    const date = parseISO(dateString);
    return isValid(date);
  } catch {
    return false;
  }
}
