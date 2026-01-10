# Financiary - Suivi Financier Personnel

Application web simple et intuitive pour suivre vos finances personnelles en temps réel.

## 🚀 Technologies

- **Vite** - Build tool rapide et moderne
- **React 18** - Bibliothèque UI
- **TypeScript** - Typage statique
- **React Router DOM** v7.12.0 - Navigation multi-pages
- **TailwindCSS** - Framework CSS utility-first
- **Shadcn/UI** - Composants React accessibles
- **Recharts** - Bibliothèque de graphiques
- **Lucide React** - Icônes
- **PocketBase** v0.26.5 - Backend-as-a-Service (BaaS)
- **date-fns** - Manipulation des dates

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
| `amount` | Number | Min: 0, Decimal: true |
| `type` | Select | Options: `income`, `expense` |
| `category` | Text | Required: false |
| `date` | Date | Required: true |
| `description` | Text | Required: true |

Pour chaque champ :
- Cliquez sur **New field**
- Sélectionnez le type approprié
- Configurez les options selon le tableau ci-dessus
- Cliquez sur **Save**

### 6. Configurer les API Rules (pour le développement)

⚠️ **Important :** Ces règles sont publiques et uniquement pour le développement. Pour la production, configurez l'authentification.

Dans l'onglet **API Rules** de la collection `transactions`, configurez :

- **List/Search rule :** Laissez vide (ou entrez `""`) pour rendre public
- **View rule :** Laissez vide (ou entrez `""`) pour rendre public
- **Create rule :** Laissez vide (ou entrez `""`) pour rendre public
- **Update rule :** Laissez vide (ou entrez `""`) pour rendre public (non utilisé actuellement)
- **Delete rule :** Laissez vide (ou entrez `""`) pour rendre public

### 7. Configuration de l'environnement (optionnel)

Si PocketBase n'est pas sur `http://127.0.0.1:8090`, créez un fichier `.env` à la racine du projet :

```env
VITE_POCKETBASE_URL=http://127.0.0.1:8090
```

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
│   ├── Home.tsx      # Page d'Accueil (/) - Formulaire
│   ├── History.tsx   # Page Historique (/transactions) - Solde, liste, graphique
│   └── About.tsx     # Page À propos (/about) - Informations
├── components/       # Composants React
│   ├── ui/           # Composants Shadcn/UI
│   ├── TransactionForm.tsx    # Formulaire d'ajout
│   ├── TransactionList.tsx    # Liste complète des transactions
│   ├── ExpenseChart.tsx       # Graphique des dépenses
│   └── Navbar.tsx             # Barre de navigation
├── contexts/         # Contexts React
│   └── FinanceContext.tsx     # Context global (état des transactions)
├── hooks/            # Hooks personnalisés
│   └── useFinanceStore.ts     # Hook réexporté depuis FinanceContext
├── lib/              # Bibliothèques utilitaires
│   ├── pocketbase.ts # Instance singleton PocketBase
│   └── utils.ts      # Utilitaires
├── utils/            # Utilitaires métier
├── types/            # Types TypeScript
├── App.tsx           # Composant principal avec Routes
└── main.tsx          # Point d'entrée avec BrowserRouter
```

## 🎯 Fonctionnalités

### Pages disponibles
- **Page d'Accueil (/) :** Formulaire d'ajout de transaction
- **Page Historique (/transactions) :** Solde, totaux, liste complète, graphique
- **Page À propos (/about) :** Informations sur l'application

### Fonctionnalités principales
- ✅ Ajouter une transaction (dépense/revenu) avec description obligatoire
- ✅ Afficher le solde actuel (calculé automatiquement)
- ✅ Afficher la liste complète de toutes les transactions
- ✅ Supprimer une transaction (avec confirmation)
- ✅ Graphique en camembert des dépenses par catégorie
- ✅ Navigation multi-pages avec barre de navigation
- ✅ Stockage dans PocketBase (backend cloud)
- ✅ Synchronisation automatique après chaque opération

### Backend
- **PocketBase** v0.26.5 (BaaS)
- Connexion simple sans authentification (API Rules publiques pour le développement)
- Base de données SQLite
- Collection `transactions` avec champs : type, amount, description, category, date

---

## ⚠️ Disclaimer

Ce projet est un exercice personnel d'apprentissage. Ne pas utiliser pour des données financières sensibles sans sécurisation du backend.

---

**Version :** 2.0.0 (Cycle 2 - MVP fonctionnel)  
**Statut :** ✅ MVP Complété
