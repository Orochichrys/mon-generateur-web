# 🚀 CREATE MY SITE

> Un outil en ligne de commande (CLI) ultra-rapide pour générer des structures de sites web professionnelles.

Version: **v1.2.1**

Ce projet permet de créer en quelques secondes un squelette de projet web incluant HTML, CSS, JS, et des dossiers optimisés. Il supporte également l'intégration de **Bootstrap**, **Tailwind CSS**, le **Mode Sombre**, le **SEO automatique** et le **Push GitHub**.

## ✨ Fonctionnalités v1.2.1

- 📁 **Structure Professionnelle** : Dossiers organisés dans `/assets` (`css/`, `js/`, `img/`, `vendor/`).
- 🔍 **SEO & Open Graph** : Balises Meta et OG-Tags pré-configurés pour le partage social.
- 🌗 **Mode Sombre** : Support natif du mode sombre pour Tailwind et Bootstrap.
- 🎨 **Templates au choix** :
  - **Tailwind CSS** : Script inclus + design moderne et responsive.
  - **Bootstrap 5** : CDN inclus + personnalisation thématique.
  - **Site Vide** : HTML/CSS/JS pur avec structure assets.
- 🦊 **Git Ready** : Initialisation `git init` et `.gitignore` par défaut.
- 🐙 **Auto-Push GitHub** : Crée un dépôt et push le code immédiatement (nécessite `gh`).
- 🔒 **Local-Lock** : Télécharge les bibliothèques en local (Bootstrap) pour un usage offline.
- 🌐 **Live Preview** : Lance un serveur local (`localhost:3000`) et ouvre automatiquement le navigateur pour voir ton site instantanément.

---

## 📦 Utilisation

Lancez simplement l'outil sans installation préalable :

```bash
npx create-my-site
```

### Lancer le serveur sur un projet existant

Si vous avez déjà généré un projet et souhaitez relancer la prévisualisation plus tard :

```bash
# Dans le dossier du projet
npx create-my-site serve

# Ou en spécifiant le dossier
npx create-my-site serve ./mon-projet
```

### Options du CLI

Pour les habitués du terminal, vous pouvez passer des arguments directement :

```bash
Usage: create-my-site [name] [options]

Arguments:
  name                 Le nom de votre projet

Options:
  -t, --template <T>   Choix du template (bootstrap, tailwind, empty).
  --dark               Génère un projet direct en mode sombre.
  --local              Télécharge les bibliothèques en local (Bootstrap).
  --push               Crée le dépôt et envoie le code vers GitHub.
  --token <T>          Passe un GitHub Token temporaire.
  --no-init            Désactive l'initialisation automatique de Git.
  --serve              Lance immédiatement le serveur de prévisualisation.
  -V, --version        Affiche la version actuelle du CLI.
  -h, --help           Affiche l'aide.
```

## 📄 Licence

Ce projet est sous licence **ISC**.  
Voir le fichier [LICENSE](./LICENSE) pour plus de détails.
