import { useState, FormEvent } from 'react';
import { Plus, TrendingDown, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useFinanceStore } from '@/hooks/useFinanceStore';
import { TransactionType } from '@/types/transaction';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/utils/constants';
import { getTodayDate } from '@/utils/dateUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAlert } from '@/hooks/useAlert';

export function TransactionForm() {
  const { addTransaction } = useFinanceStore();
  const { alert, Alert } = useAlert();
  
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('');
  const [date, setDate] = useState(getTodayDate());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validation
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Veuillez entrer un montant valide et positif', {
        title: 'Erreur de validation',
        variant: 'destructive',
      });
      return;
    }

    // Validation de la description (obligatoire)
    const trimmedDescription = description.trim();
    if (!trimmedDescription) {
      alert('La description est obligatoire', {
        title: 'Erreur de validation',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await addTransaction({
        type,
        amount: amountNum,
        description: trimmedDescription,
        category: category || undefined,
        date,
      });

      // Réinitialiser le formulaire
      setAmount('');
      setDescription('');
      setCategory('');
      setDate(getTodayDate());
      
      // Afficher le message de succès
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la transaction:', error);
      alert('Une erreur est survenue lors de l\'ajout de la transaction', {
        title: 'Erreur',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategory('');
  };

  return (
    <>
      <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Nouvelle transaction</CardTitle>
        <CardDescription className="text-sm">
          Ajoutez une dépense ou un revenu
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type de transaction - Style Apple */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`flex items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all ${
                  type === 'expense'
                    ? 'border-expense bg-expense-light/50 text-expense shadow-sm'
                    : 'border-border bg-background text-muted-foreground hover:bg-accent/50'
                }`}
              >
                <TrendingDown className="h-4 w-4" />
                <span className="text-sm font-medium">Dépense</span>
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`flex items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all ${
                  type === 'income'
                    ? 'border-income bg-income-light/50 text-income shadow-sm'
                    : 'border-border bg-background text-muted-foreground hover:bg-accent/50'
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">Revenu</span>
              </button>
            </div>
          </div>

          {/* Montant */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">Montant</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">
                XOF
              </span>
              <Input
                id="amount"
                type="number"
                step="25"
                min="100"
                placeholder="100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="h-12 pl-[58px] rounded-xl border-border/50 text-base"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
            <Input
              id="description"
              type="text"
              placeholder="Ex: Déjeuner au restaurant"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="h-12 rounded-xl border-border/50"
            />
          </div>

          {/* Catégorie et Date en grille sur mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Catégorie */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">Catégorie</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category" className="h-12 rounded-xl border-border/50">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={getTodayDate()}
                className="h-12 rounded-xl border-border/50"
              />
            </div>
          </div>

          {/* Message de succès */}
          {showSuccess && (
            <div className="p-3 rounded-lg bg-income-light/50 border border-income/20 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-2 text-income">
                <CheckCircle2 className="h-4 w-4" />
                <p className="text-sm font-medium">Transaction ajoutée avec succès !</p>
              </div>
            </div>
          )}

          {/* Bouton de soumission */}
          <Button
            type="submit"
            className="w-full h-12 rounded-xl font-medium shadow-sm transition-all duration-200 hover:scale-105"
            disabled={isSubmitting || !amount || parseFloat(amount) <= 0 || !description.trim()}
          >
            {isSubmitting ? (
              <>
                <Plus className="mr-2 h-4 w-4 animate-spin" />
                Ajout en cours...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter
              </>
            )}
          </Button>
        </form>
      </CardContent>
      </Card>
      <Alert />
    </>
  );
}
