# 🚀 CMS Generator (Create My Site)

> Un outil en ligne de commande (CLI) ultra-rapide pour générer des structures de sites web professionnelles.

Version: **v1.2.0**

Ce projet permet de créer en quelques secondes un squelette de projet web incluant HTML, CSS, JS, et des dossiers optimisés. Il supporte également l'intégration de **Bootstrap**, **Tailwind CSS**, le **Mode Sombre**, le **SEO automatique** et le **Push GitHub**.

## ✨ Fonctionnalités v1.2.0

- 📁 **Structure Professionnelle** : Dossiers organisés dans `/assets` (`css/`, `js/`, `img/`, `vendor/`).
- 🔍 **SEO & Open Graph** : Balises Meta et OG-Tags pré-configurés pour le partage social.
- 🌗 **Mode Sombre** : Support natif du mode sombre pour Tailwind et Bootstrap.
- 🎨 **Templates au choix** :
  - **Tailwind CSS** : Script inclus + design moderne et responsive.
  - **Bootstrap 5** : CDN inclus + personnalisation thématique.
  - **Site Vide** : HTML/CSS/JS pur avec structure assets.
- 🦊 **Git Ready** : Initialisation `git init` et `.gitignore` par défaut.
- 🐙 **Auto-Push GitHub** : Crée un dépôt et push le code immédiatement (nécessite `gh`).

---

## 📦 Utilisation

Lancez simplement l'outil sans installation préalable :

```bash
npx create-my-site
```

### Options du CLI

Pour les habitués du terminal, vous pouvez passer des arguments directement :

```bash
Usage: create-my-site [name] [options]

Arguments:
  name                       Le nom de votre projet

Options:
  -t, --template <TEMPLATE>  Le template à utiliser (tailwind|bootstrap|empty)
  --no-init                  Désactive l'initialisation Git
  --dark                     Génère un boilerplate en mode sombre
  --push                     Crée un dépôt GitHub et push immédiatement
  -h, --help                 Affiche l'aide
```

## 📄 Licence

Ce projet est sous licence **ISC**.  
Voir le fichier [LICENSE](./LICENSE) pour plus de détails.
