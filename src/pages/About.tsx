import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, TrendingUp, BarChart3, Shield, Plus } from 'lucide-react';

/**
 * Page À Propos (/about)
 * Informations sur l'application sans détails techniques
 */
export function About() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-3xl space-y-6 sm:space-y-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">À propos de Financiary</h2>
        <p className="text-sm text-muted-foreground">
          Découvrez notre application de suivi financier personnel
        </p>
      </div>

      {/* Section principale */}
      <Card className="border-border/50 shadow-sm animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Qu'est-ce que Financiary ?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Financiary est une application web simple et intuitive conçue pour vous aider à gérer vos finances personnelles au quotidien. 
            Que vous souhaitiez suivre vos dépenses, vos revenus ou simplement avoir une vue d'ensemble de votre situation financière, 
            Financiary vous accompagne dans votre gestion budgétaire.
          </p>
          <p className="text-muted-foreground">
            Notre objectif est de rendre la gestion financière accessible à tous, sans complexité inutile. 
            Avec une interface épurée et des fonctionnalités essentielles, vous pouvez prendre le contrôle de vos finances en quelques clics.
          </p>
        </CardContent>
      </Card>

      {/* Fonctionnalités */}
      <div className="grid gap-4 sm:grid-cols-2 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-300">
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg font-semibold">Suivi en temps réel</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Visualisez votre solde actuel et vos totaux de revenus et dépenses instantanément. 
              Vos données sont mises à jour automatiquement à chaque transaction.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-income-light">
                <TrendingUp className="h-5 w-5 text-income" />
              </div>
              <CardTitle className="text-lg font-semibold">Gestion simple</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Ajoutez rapidement vos transactions avec une description, une catégorie et une date. 
              L'interface intuitive vous permet d'enregistrer vos mouvements financiers en quelques secondes.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-expense-light">
                <BarChart3 className="h-5 w-5 text-expense" />
              </div>
              <CardTitle className="text-lg font-semibold">Statistiques visuelles</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Consultez des graphiques clairs pour comprendre la répartition de vos dépenses par catégorie. 
              Identifiez rapidement vos principales sources de dépenses.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg font-semibold">Sécurité et confidentialité</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Vos données financières sont sécurisées et accessibles uniquement par vous. 
              Synchronisez vos informations entre vos appareils en toute sécurité.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Section utilisation */}
      <Card className="border-border/50 shadow-sm animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-400">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Comment utiliser Financiary ?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">1. Ajoutez vos transactions</h3>
            <p className="text-sm text-muted-foreground">
              Sur la page d'accueil, enregistrez rapidement vos dépenses et revenus. 
              Indiquez le montant, ajoutez une description et choisissez une catégorie si vous le souhaitez.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">2. Consultez votre historique</h3>
            <p className="text-sm text-muted-foreground">
              Accédez à la page Historique pour voir toutes vos transactions, votre solde actuel 
              et des graphiques détaillés de vos dépenses par catégorie.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">3. Gérez vos finances</h3>
            <p className="text-sm text-muted-foreground">
              Utilisez les informations affichées pour prendre des décisions éclairées sur votre budget. 
              Supprimez les transactions si nécessaire et gardez un historique à jour.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CTA principal */}
      <Card className="border-border/50 shadow-sm bg-gradient-to-br from-primary/5 to-background animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-500">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Prêt à commencer ?</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Ajoutez votre première transaction et prenez le contrôle de vos finances dès maintenant
            </p>
            <Button
              onClick={() => navigate('/')}
              size="lg"
              className="mt-4"
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une transaction
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer de la page */}
      <div className="text-center py-6 text-sm text-muted-foreground">
        <p>© 2024 Financiary - Application de suivi financier personnel</p>
        <p className="mt-2">Conçue pour simplifier votre gestion budgétaire au quotidien</p>
      </div>
    </div>
  );
}
