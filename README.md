
# Moni_Point de Vente

## Informations sur le projet

Application de point de vente pour cafés et restaurants avec gestion des factures et rapports.

## Comment cloner et exécuter ce projet

Pour cloner et exécuter ce projet sur votre PC de bureau, suivez ces étapes:

```sh
# Étape 1: Cloner le dépôt Git
git clone <URL_DU_PROJET>

# Étape 2: Naviguer vers le répertoire du projet
cd <NOM_DU_PROJET>

# Étape 3: Installer les dépendances nécessaires
npm install

# Étape 4: Lancer le serveur de développement
npm run dev
```

L'application sera accessible à l'adresse : http://localhost:8080

## Technologies utilisées

Ce projet est construit avec:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Fonctionnalités principales

- Gestion des produits et catégories
- Création et gestion des factures
- Sauvegarde automatique des factures en cours
- Rapports de ventes journaliers
- Clôture journalière avec rapport détaillé
- Impression de tickets au format 80mm et rapports au format A4

## Formats d'impression

- **Factures**: Format ticket 80mm x 150mm
- **Rapports et main courante**: Format A4 standard

## Comment déployer ce projet

Pour déployer ce projet sur un serveur web, utilisez la commande:

```sh
npm run build
```

Les fichiers générés se trouveront dans le répertoire `dist` et pourront être déployés sur n'importe quel serveur web.
