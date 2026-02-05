[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=flat-square)](./LICENSE)
[![npm version](https://img.shields.io/npm/v/create-my-site.svg?style=flat-square)](https://www.npmjs.com/package/create-my-site)
[![Node.js](https://img.shields.io/badge/node-v20.5.1-brightgreen?style=flat-square)](https://nodejs.org/)

# 🚀 Générateur de Site Web (CLI)

> Un outil en ligne de commande (CLI) ultra-rapide pour générer des structures de sites web modernes.

Ce projet permet de créer en quelques secondes un squelette de projet web incluant HTML, CSS, JS, et des dossiers pré-organisés. Il supporte également l'intégration automatique de **Bootstrap**, **Tailwind CSS** et l'initialisation **Git**.

## ✨ Fonctionnalités

*   📁 **Structure automatique** : Crée les dossiers `css/`, `js/`, `img/`.
*   🎨 **Templates au choix** :
    *   **Site Vide** : HTML/CSS/JS pur.
    *   **Bootstrap 5** : CDN inclus + exemple de composant.
    *   **Tailwind CSS** : Script inclus + classes utilitaires.
*   🦊 **Git Ready** : Lance `git init` et crée un `.gitignore` automatiquement.
*   💻 **Interface Interactive** : Pose des questions simples pour configurer le projet.
*   💻 **Interface CLI** : Que ce soit pour les fanatiques des CLI sans interaction ou pour la vitesse 🚀
---

## 📦 Utilisation Rapide (Utilisateurs)

Pas besoin d'installer quoi que ce soit si vous voulez juste l'utiliser. Lancez simplement :

```bash
npx create-my-site
```

Envie d'utiliser `create-my-site` pour un script ou juste accélerer la création ?

**Ne vous en faites pas !**

vous pouvez aussi utilisez

```bash
Usage: create-my-site [options] [name]

Arguments:
  name                       le nom du projet

Options:
  -t, --template <TEMPLATE>  la template à utilisée (default: "tailwind")
  --no-init                  désactive l'éxecution automatique de git init
  -h, --help                 display help for command
```

## 📄 Licence

Ce projet est sous licence **ISC**.  
Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

