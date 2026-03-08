import chalk from "chalk";
import inquirer from "inquirer";
import path from "path";
import { VERSION } from "./src/constants.js";
import { IsProjectNameValid, BuildProjectDir, checkCommand, loadToken } from "./src/helpers.js";
import { GenTemplate, GenReadme } from "./src/template.js";
import { GitInit, handleGitPush } from "./src/git.js";
import { startLivePreview } from "./src/server.js";

export default async function InteractiveSetup() {
  const hasGH = checkCommand("gh");
  const hasToken = loadToken();
  console.log(chalk.blue.bold(`\n🚀 CREATE MY SITE v${VERSION} - Configuration Interactive\n`));

  const questions = [
    {
      type: "input",
      name: "projectName",
      message: "Quel est le nom de ton projet ?",
      default: "mon-site-web",
      validate: (input) => {
        if (IsProjectNameValid(input)) return true;
        return "Le nom doit contenir uniquement des minuscules, chiffres, tirets ou underscores.";
      },
    },
    {
      type: "rawlist",
      name: "template",
      message: "Quel template veux-tu utiliser ?",
      choices: [
        "Tailwind CSS",
        "Bootstrap 5",
        "Site Vide (HTML/CSS/JS basique)",
      ],
    },
    {
      type: "confirm",
      name: "darkMode",
      message: "Activer le mode sombre par défaut ?",
      default: false,
    },
    {
      type: "confirm",
      name: "local",
      message: "Utiliser des fichiers locaux au lieu des CDN (Offline mode) ?",
      default: false,
      when: (answers) => answers.template === "Bootstrap 5",
    },
    {
      type: "confirm",
      name: "gitInit",
      message: "Initialiser un dépôt Git local ?",
      default: true,
    },
    {
      type: "confirm",
      name: "gitPush",
      message: hasGH 
        ? "Créer un dépôt GitHub et pusher immédiatement ? (Utilise 'gh')"
        : hasToken 
          ? "Créer un dépôt GitHub et pusher ? (Utilise le Token mémorisé)"
          : "Créer un dépôt GitHub et pusher ? (L'outil demandera un Token)",
      default: false,
      when: (answers) => answers.gitInit === true,
    },
    {
      type: "confirm",
      name: "serve",
      message: "Lancer le serveur de prévisualisation (Live Preview) ?",
      default: true,
    }
  ];

  try {
    const answers = await inquirer.prompt(questions);
    const { projectName, template, darkMode, gitInit, gitPush, local, serve } = answers;

    BuildProjectDir(projectName);
    await GenTemplate(projectName, template, VERSION, { darkMode, local });
    GenReadme(projectName, template, VERSION);
    GitInit(projectName, gitInit);
    
    if (gitPush) {
      await handleGitPush(projectName, gitPush, VERSION);
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
  } catch (error) {
    if (error.isTtyError) {
      console.log(chalk.red("\n❌ Impossible de lancer le prompt dans cet environnement."));
    } else if (error.message.includes('force closed')) {
      console.log(chalk.yellow("\n👋 Opération annulée par l'utilisateur."));
    } else {
      console.log(chalk.red("\n❌ Une erreur est survenue : " + error.message));
    }
    process.exit(0);
  }
}