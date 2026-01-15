# Financiary - Suivi Financier Personnel

Application web simple et intuitive pour suivre vos finances personnelles en temps réel.

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
- **Radix UI** - Composants primitifs accessibles (@radix-ui/react-alert-dialog)

## 📦 Installation

```bash
npm install
```

## 🔧 Configuration Backend (PocketBase)

Cette application nécessite PocketBase comme backend. Suivez ces étapes pour le configurer :

### 1. Télécharger PocketBase

Téléchargez PocketBase depuis le site officiel : [https://pocketbase.io/docs/](https://pocketbase.io/docs/)

**Pour macOS (Apple Silicon - M1/M2/M3) :**
```bash
curl -L https://github.com/pocketbase/pocketbase/releases/latest/download/pocketbase_darwin_arm64.zip -o pocketbase.zip
unzip pocketbase.zip
chmod +x pocketbase
```

**Pour macOS (Intel) :**
```bash
curl -L https://github.com/pocketbase/pocketbase/releases/latest/download/pocketbase_darwin_amd64.zip -o pocketbase.zip
unzip pocketbase.zip
chmod +x pocketbase
```

**Pour Linux :**
```bash
curl -L https://github.com/pocketbase/pocketbase/releases/latest/download/pocketbase_linux_amd64.zip -o pocketbase.zip
unzip pocketbase.zip
chmod +x pocketbase
```

**Pour Windows :**
Téléchargez `pocketbase_windows_amd64.zip` depuis [https://github.com/pocketbase/pocketbase/releases/latest](https://github.com/pocketbase/pocketbase/releases/latest) et décompressez-le.

### 2. Lancer PocketBase

```bash
./pocketbase serve
```

PocketBase sera accessible sur `http://127.0.0.1:8090`

### 3. Accéder à l'interface d'administration

Ouvrez votre navigateur et allez sur : **http://127.0.0.1:8090/_/**

Créez le premier compte administrateur avec un email et un mot de passe.

### 4. Créer la collection `transactions`

Dans l'interface d'administration PocketBase :

1. Allez dans **Collections** dans le menu de gauche
2. Cliquez sur **New collection**
3. Nommez la collection : `transactions`
4. Cliquez sur **Create**

### 5. Ajouter les champs à la collection

Dans la collection `transactions` que vous venez de créer, ajoutez les champs suivants :

| Nom du champ | Type | Options |
|--------------|------|---------|
| `userId` | Relation | Collection: `users`, Max select: 1, Required: true |
| `amount` | Number | Min: 0, Decimal: true |
| `type` | Select | Options: `income`, `expense` |
| `category` | Text | Required: false |
| `date` | Date | Required: true |
| `description` | Text | Required: true |

**Important :** Le champ `userId` doit être ajouté en premier car il est requis pour lier les transactions aux utilisateurs.

Pour chaque champ :
- Cliquez sur **New field**
- Sélectionnez le type approprié
- Pour `userId` : Sélectionnez "Relation", choisissez la collection `users`, configurez "Max select: 1" et "Required: true"
- Configurez les autres options selon le tableau ci-dessus
- Cliquez sur **Save**

### 6. Configurer les API Rules (avec authentification)

⚠️ **Important :** Ces règles sécurisent les données en filtrant par utilisateur connecté.

Dans l'onglet **API Rules** de la collection `transactions`, configurez :

- **List/Search rule :** `@request.auth.id != "" && userId = @request.auth.id`
- **View rule :** `@request.auth.id != "" && userId = @request.auth.id`
- **Create rule :** `@request.auth.id != "" && userId = @request.auth.id`
- **Update rule :** `@request.auth.id != "" && userId = @request.auth.id` (non utilisé actuellement)
- **Delete rule :** `@request.auth.id != "" && userId = @request.auth.id`

Ces règles garantissent que :
- Seuls les utilisateurs authentifiés peuvent accéder aux transactions
- Chaque utilisateur ne peut voir que ses propres transactions
- Chaque utilisateur ne peut créer/supprimer que ses propres transactions

### 7. Configuration de l'environnement

Créez un fichier `.env` à la racine du projet (vous pouvez copier `.env_exemple`) :

```env
VITE_POCKETBASE_URL=http://127.0.0.1:8090
```

Si PocketBase est sur un autre port ou une autre URL, modifiez cette variable en conséquence.

## 🛠️ Développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

⚠️ **Assurez-vous que PocketBase est lancé avant de démarrer l'application frontend.**

## 🏗️ Build

```bash
npm run build
```

## 👀 Preview

```bash
npm run preview
```

## 📁 Structure du Projet

```
src/
├── pages/            # Pages React Router
│   ├── Home.tsx      # Page d'Accueil (/) - Formulaire (protégée)
│   ├── History.tsx   # Page Historique (/transactions) - Solde, liste, graphique (protégée)
│   ├── About.tsx     # Page À propos (/about) - Informations (publique)
│   ├── Login.tsx     # Page de Connexion (/login) - Formulaire de connexion (publique)
│   └── Register.tsx   # Page d'Inscription (/register) - Formulaire d'inscription (publique)
├── components/       # Composants React
│   ├── ui/           # Composants Shadcn/UI
│   │   ├── alert-dialog.tsx  # Dialog d'alerte et de confirmation
│   │   └── ...
│   ├── TransactionForm.tsx    # Formulaire d'ajout
│   ├── TransactionItem.tsx    # Composant partagé pour afficher une transaction
│   ├── TransactionList.tsx    # Liste complète des transactions
│   ├── ExpenseChart.tsx       # Graphique des dépenses
│   ├── Navbar.tsx             # Barre de navigation avec menu utilisateur
│   ├── MobileMenu.tsx         # Menu hamburger mobile
│   └── ProtectedRoute.tsx    # Composant pour protéger les routes
├── contexts/         # Contexts React
│   ├── FinanceContext.tsx     # Context global (état des transactions)
│   └── AuthContext.tsx        # Context global (état d'authentification)
├── hooks/            # Hooks personnalisés
│   ├── useFinanceStore.ts     # Hook réexporté depuis FinanceContext
│   ├── useAuth.ts             # Hook réexporté depuis AuthContext
│   ├── useConfirmDialog.tsx  # Hook pour les dialogs de confirmation
│   └── useAlert.tsx           # Hook pour les alertes
├── lib/              # Bibliothèques utilitaires
│   ├── pocketbase.ts # Instance singleton PocketBase
│   └── utils.ts      # Utilitaires
├── utils/            # Utilitaires métier
├── types/            # Types TypeScript
├── App.tsx           # Composant principal avec Routes et Providers
└── main.tsx          # Point d'entrée avec BrowserRouter
```

## 🎯 Fonctionnalités

### Pages disponibles
- **Page d'Accueil (/) :** Formulaire d'ajout de transaction (protégée - nécessite authentification)
- **Page Historique (/transactions) :** Solde, totaux, liste complète, graphique (protégée - nécessite authentification)
- **Page À propos (/about) :** Informations sur l'application (publique)
- **Page de Connexion (/login) :** Formulaire de connexion avec email et mot de passe (publique)
- **Page d'Inscription (/register) :** Formulaire d'inscription avec email, mot de passe et username optionnel (publique)

### Fonctionnalités principales

#### Gestion des transactions
- ✅ Ajouter une transaction (dépense/revenu) avec description obligatoire
- ✅ Afficher le solde actuel (calculé automatiquement)
- ✅ Afficher la liste complète de toutes les transactions
- ✅ Supprimer une transaction (avec confirmation via popup personnalisé)
- ✅ Graphique en camembert des dépenses par catégorie
- ✅ Bouton de suppression toujours visible sur mobile, au hover sur desktop

#### Authentification et sécurité
- ✅ Créer un compte utilisateur (inscription)
- ✅ Se connecter avec email et mot de passe
- ✅ Se déconnecter
- ✅ Connexion automatique après inscription
- ✅ Option "Se souvenir de moi" pour persistance de session
- ✅ Protection des routes nécessitant une authentification
- ✅ Chaque utilisateur voit uniquement ses propres transactions
- ✅ Filtrage automatique des données par utilisateur connecté

#### Interface utilisateur
- ✅ Navigation multi-pages avec barre de navigation
- ✅ Menu hamburger mobile avec menu déroulant
- ✅ Menu utilisateur avec affichage du nom/email
- ✅ Popups/dialogs personnalisés remplaçant les alertes natives
- ✅ Design responsive mobile-first
- ✅ Animations fluides (fade-in, slide-in, scale-in)
- ✅ Boutons œil pour afficher/masquer les mots de passe

#### Backend et synchronisation
- ✅ Stockage dans PocketBase (backend cloud)
- ✅ Synchronisation automatique après chaque opération
- ✅ Gestion de session avec token JWT
- ✅ Gestion d'erreurs réseau avec messages clairs

### Backend
- **PocketBase** v0.26.5 (BaaS)
- **Authentification** : API Auth PocketBase (inscription, connexion, déconnexion)
- **Base de données** : SQLite avec collection `users` (système PocketBase)
- **Collection `transactions`** avec champs :
  - `userId` (relation vers `users`) - **Requis pour lier les transactions aux utilisateurs**
  - `type` (select: income/expense)
  - `amount` (number)
  - `description` (text, obligatoire)
  - `category` (text, optionnel)
  - `date` (date)
- **API Rules** : Protégées par authentification, filtrage automatique par `userId`

---

## 🔐 Sécurité

### Authentification
- Les utilisateurs doivent créer un compte pour accéder à l'application
- Les mots de passe sont hashés par PocketBase (bcrypt)
- Les tokens JWT sont utilisés pour la gestion de session
- Les routes protégées redirigent automatiquement vers la page de connexion

### Protection des données
- Chaque utilisateur ne peut accéder qu'à ses propres transactions
- Les API Rules PocketBase filtrent automatiquement par `userId`
- Les transactions sont liées à l'utilisateur connecté lors de la création

### Configuration requise
- ⚠️ **Important :** Assurez-vous de configurer correctement les API Rules dans PocketBase (voir section 6)
- Le champ `userId` doit être ajouté à la collection `transactions` avec une relation vers `users`
- Les API Rules doivent être configurées pour filtrer par `userId = @request.auth.id`

---

## ⚠️ Disclaimer

Ce projet est un exercice personnel d'apprentissage. Ne pas utiliser pour des données financières sensibles sans sécurisation complète du backend et configuration HTTPS en production.

---

## 📚 Documentation

Pour plus de détails, consultez :
- **PRD.md** - Product Requirements Document (toutes les user stories)
- **TECH_STACK.md** - Stack technique complète et architecture
- **CHANGELOG.md** - Journal des changements et limitations

---

**Version :** 3.0.0 (Cycle 3 - Authentification complétée)  
**Statut :** ✅ MVP Complété avec Authentification
