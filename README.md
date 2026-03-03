# Financiary - Suivi Financier Personnel

Application web simple et intuitive pour suivre vos finances personnelles en temps réel, avec une interface moderne inspirée du design Apple.

## 🚀 Technologies

- **Vite** - Build tool rapide et moderne
- **React 18** - Bibliothèque UI
- **TypeScript** - Typage statique
- **React Router DOM** v7.12.0 - Navigation multi-pages avec protection de routes
- **TailwindCSS** - Framework CSS utility-first
- **Shadcn/UI** - Composants React accessibles (Button, Input, Select, Card, Dialog, AlertDialog)
- **Recharts** - Bibliothèque de graphiques
- **Lucide React** - Icônes
- **PocketBase** v0.26.5 - Backend-as-a-Service (BaaS) avec authentification
- **date-fns** - Manipulation des dates
- **tailwindcss-animate** - Animations fluides

## 📦 Installation

```bash
npm install
```

## 🔧 Configuration Backend (PocketBase)

Cette application nécessite PocketBase comme backend. Suivez ces étapes pour le configurer :

### 1. Télécharger PocketBase

Téléchargez PocketBase depuis le site officiel : [https://pocketbase.io/docs/](https://pocketbase.io/docs/)

### 2. Lancer PocketBase

```bash
./pocketbase serve
```

PocketBase sera accessible sur `http://127.0.0.1:8090`

### 3. Accéder à l'interface d'administration

Ouvrez votre navigateur et allez sur : **http://127.0.0.1:8090/_/**

### 4. Créer la collection `transactions`

Dans l'interface d'administration PocketBase :

1. Allez dans **Collections** dans le menu de gauche
2. Cliquez sur **New collection**
3. Nommez la collection : `transactions`
4. Ajoutez les champs suivants :

| Nom du champ | Type | Options |
|--------------|------|---------|
| `userId` | Relation | Collection: `users`, Max select: 1, Required: true |
| `amount` | Number | Min: 0, Decimal: true |
| `type` | Select | Options: `income`, `expense` |
| `category` | Text | Required: false |
| `date` | Date | Required: true |
| `description` | Text | Required: true |

### 5. Configurer les API Rules

Dans l'onglet **API Rules** de la collection `transactions`, configurez :

- **List/Search rule :** `@request.auth.id != "" && userId = @request.auth.id`
- **View rule :** `@request.auth.id != "" && userId = @request.auth.id`
- **Create rule :** `@request.auth.id != "" && userId = @request.auth.id`
- **Delete rule :** `@request.auth.id != "" && userId = @request.auth.id`

## 🎯 Fonctionnalités Clés

### 📊 Gestion & Analyse
- **Filtrage par période** : Visualisez vos données par mois actuel (par défaut), 7 jours, 30 jours, année ou historique complet.
- **Tableau de bord intelligent** : Solde en temps réel, totaux revenus/dépenses et dernières opérations.
- **Graphiques interactifs** : Répartition des dépenses par catégorie via Recharts.
- **Historique complet** : Liste détaillée de toutes vos transactions avec suppression sécurisée.

### 🔐 Sécurité & Confidentialité
- **Authentification complète** : Inscription, connexion sécurisée et gestion de session (JWT).
- **Isolation des données** : Chaque utilisateur accède uniquement à ses propres données financières.
- **Protection des routes** : Accès restreint aux pages sensibles pour les utilisateurs non connectés.

### 🎨 Design & Expérience Utilisateur
- **Identité Visuelle** : Palette de couleurs basée sur les logos officiels (Bleu Profond et Vert Émeraude).
- **Style Apple-like** : Interface épurée, ombres douces, arrondis généreux et transitions fluides.
- **Mobile-First** : Expérience optimisée pour smartphones avec menu hamburger et boutons adaptés.
- **Feedback Visuel** : Animations au survol (hover) contextuelles (rouge pour dépenses, vert pour revenus).

## 📁 Structure du Projet

```
src/
├── pages/            # Home, History, About, Login, Register
├── components/       # UI (Shadcn), TransactionForm, TransactionList, Navbar, etc.
├── contexts/         # FinanceContext, AuthContext
├── hooks/            # useFinanceStore, useAuth, useConfirmDialog, useAlert
├── lib/              # pocketbase.ts, utils.ts
└── utils/            # calculations.ts, constants.ts, dateUtils.ts
```

---

**Version :** 3.1.0 (Filtrage & Identité Visuelle)  
**Statut :** ✅ MVP Complété avec Authentification et Design Harmonisé
