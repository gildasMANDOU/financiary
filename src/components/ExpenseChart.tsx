import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useFinanceStore } from '@/contexts/FinanceContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingDown, Plus } from 'lucide-react';

// Couleurs pour chaque catégorie (palette moderne)
const CATEGORY_COLORS = [
  '#ef4444', // Rouge principal
  '#f97316', // Orange
  '#eab308', // Jaune
  '#22c55e', // Vert
  '#3b82f6', // Bleu
  '#8b5cf6', // Violet
  '#ec4899', // Rose
];

export function ExpenseChart() {
  const navigate = useNavigate();
  const { transactions } = useFinanceStore();

  // Calculer les dépenses par catégorie
  const expenseData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    
    // Grouper par catégorie
    const categoryMap = new Map<string, number>();
    
    expenses.forEach(expense => {
      const category = expense.category || 'Autres';
      const current = categoryMap.get(category) || 0;
      categoryMap.set(category, current + expense.amount);
    });

    // Convertir en array et trier par montant décroissant
    const data = Array.from(categoryMap.entries())
      .map(([name, value], index) => ({
        name,
        value: Math.round(value * 100) / 100, // Arrondir à 2 décimales
        color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);

    return data;
  }, [transactions]);

  // Formater les montants pour le tooltip
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
    }).format(value);
  };

  // Custom label pour afficher le pourcentage
  const renderLabel = (entry: any) => {
    const total = expenseData.reduce((sum, item) => sum + item.value, 0);
    const percentage = total > 0 ? ((entry.value / total) * 100).toFixed(0) : 0;
    return `${percentage}%`;
  };

  if (expenseData.length === 0) {
    return (
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <TrendingDown className="h-5 w-5 text-expense" />
            Dépenses par catégorie
          </CardTitle>
          <CardDescription className="text-sm">
            Répartition de vos dépenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 space-y-4 text-muted-foreground">
            <p className="text-sm">Aucune dépense enregistrée</p>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              size="sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une dépense
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <TrendingDown className="h-5 w-5 text-expense" />
          Dépenses par catégorie
        </CardTitle>
        <CardDescription className="text-sm">
          Répartition de vos dépenses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.98)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={40}
                formatter={(value) => {
                  const item = expenseData.find(d => d.name === value);
                  return item ? `${value} (${formatCurrency(item.value)})` : value;
                }}
                wrapperStyle={{
                  fontSize: '11px',
                  paddingTop: '16px',
                  fontWeight: '500',
                }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
