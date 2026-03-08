#!/usr/bin/env node

import { program } from "commander";
import chalk from "chalk";
import path from "path";
import { VERSION } from "./src/constants.js";
import { IsProjectNameValid, BuildProjectDir } from "./src/helpers.js";
import { GenTemplate, GenReadme } from "./src/template.js";
import { GitInit, handleGitPush } from "./src/git.js";
import { startLivePreview } from "./src/server.js";
import InteractiveSetup from "./interactive.js";

// Mapping CLI -> Noms complets
const AvailableTemplates = {
  "bootstrap": "Bootstrap 5",
  "tailwind": "Tailwind CSS",
  "empty": "Site Vide (HTML/CSS/JS basique)"
};

// Fonction principale
async function main(projectName, templateName, options) {
  const { gitInit, darkMode, push, local, token, serve } = options;
  
  BuildProjectDir(projectName);
  await GenTemplate(projectName, templateName, VERSION, { darkMode, local });
  GenReadme(projectName, templateName, VERSION);
  GitInit(projectName, gitInit);
  
  if (push) {
    await handleGitPush(projectName, push, VERSION, token);
  }

  console.log(chalk.green.bold(`\n✅ Projet "${projectName}" prêt avec succès !`));
  console.log(chalk.cyan(`\nProchaines étapes :`));
  console.log(chalk.white(`  1. Accéder au dossier : `) + chalk.yellow(`cd ${projectName}`));
  console.log(chalk.white(`  2. Lancer le serveur plus tard : `) + chalk.yellow(`npx create-my-site serve`));

  if (serve) {
    const targetPath = path.resolve(process.cwd(), projectName);
    startLivePreview(targetPath);
  } else {
    console.log(chalk.blue.bold(`\n✨ Bonne création avec CREATE MY SITE ! 🚀\n`));
  }
}

// Configuration de Commander
program
  .version(VERSION)
  .name("create-my-site")
  .usage("[name] [options]")
  .description("CREATE MY SITE - Un CLI ultra-rapide pour générer des structures web professionnelles.")
  .argument('[name]', "Le nom du projet (facultatif pour lancer le mode interactif)")
  .option('-t, --template <T>', "Choix du template (bootstrap, tailwind, empty).", "tailwind")
  .option('--no-init', "Désactive l'initialisation automatique de Git.")
  .option('--dark', "Génère un projet direct en mode sombre.", false)
  .option('--local', "Télécharge les bibliothèques en local (Bootstrap).", false)
  .option('--push', "Crée le dépôt et envoie le code vers GitHub.", false)
  .option('--token <T>', "Passe un GitHub Token temporaire.")
  .option('--serve', "Lance immédiatement le serveur de prévisualisation.", false)
  .addHelpText('after', `
Exemples :
  $ npx create-my-site mon-projet --dark
  $ npx create-my-site serve ./mon-projet
  `)
  .action(async (name, options) => {
    // Si aucun nom n'est fourni, on lance le mode interactif
    if (!name) {
      await InteractiveSetup();
    } else if (IsProjectNameValid(name)) {
      // Sinon on lance le mode automatique (CLI)
      const realTemplateName = AvailableTemplates[options.template.trim().toLowerCase()];
      
      if (!realTemplateName) {
        console.log(chalk.red(`❌ Erreur : "${options.template}" n'est pas un template officiel.`));
        console.log(chalk.yellow("Templates disponibles :"));
        Object.keys(AvailableTemplates).forEach(t => console.log(`- ${t}`));
        process.exit(1);
      }

      try {
        await main(name, realTemplateName, options);
      } catch (error) {
        if (error.message && error.message.includes('force closed')) {
          console.log(chalk.yellow("\n👋 Opération annulée par l'utilisateur."));
        } else {
          console.log(chalk.red("\n❌ Une erreur critique est survenue : " + error.message));
        }
        process.exit(0);
      }
    } else {
      console.log(chalk.red("❌ Le format du nom du projet est invalide."));
      process.exit(1);
    }
  });

program
  .command('serve')
  .description("Lance le serveur de prévisualisation sur un projet existant.")
  .argument('[dir]', "Le répertoire à servir (défaut: dossier courant)", ".")
  .action((dir) => {
    const targetPath = path.resolve(process.cwd(), dir);
    startLivePreview(targetPath);
  });

program.parse();