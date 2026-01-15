import { TransactionForm } from '@/components/TransactionForm';

/**
 * Page d'Accueil (/)
 * Contient le Dashboard (solde, totaux) + Formulaire d'ajout de transaction
 */
export function Home() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="mb-6 animate-in fade-in-0 slide-in-from-left-4 duration-500 delay-100">
        <h2 className="text-2xl font-semibold mb-2">Tableau de bord</h2>
        <p className="text-sm text-muted-foreground">
          Ajoutez une transaction et consultez votre solde
        </p>
      </div>

      {/* Dashboard avec solde et totaux */}
      {/* <Dashboard /> */}

      {/* Formulaire d'ajout de transaction */}
      <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-200">
        <TransactionForm />
      </div>
    </div>
  );
}
