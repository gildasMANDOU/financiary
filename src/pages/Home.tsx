import { TransactionForm } from '@/components/TransactionForm';

/**
 * Page d'Accueil (/)
 * Contient le Dashboard (solde, totaux) + Formulaire d'ajout de transaction
 */
export function Home() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Tableau de bord</h2>
        <p className="text-sm text-muted-foreground">
          Ajoutez une transaction et consultez votre 
        </p>
      </div>

      {/* Dashboard avec solde et totaux */}
      {/* <Dashboard /> */}

      {/* Formulaire d'ajout de transaction */}
      <TransactionForm />
    </div>
  );
}
