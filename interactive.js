import chalk from "chalk";
import inquirer from "inquirer";
import {
  IsProjectNameValid,
  BuildProjectDir,
  GenTemplate,
  GenReadme,
  GitInit,
  handleGitPush,
  checkCommand,
  loadToken,
} from "./utility.js";

export default function InteractiveSetup() {
  const hasGH = checkCommand("gh");
  const hasToken = loadToken();
  console.log(chalk.blue.bold("\n🚀 CMS Generator v1.2.0 - Configuration Interactive\n"));

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
  ];

  inquirer.prompt(questions).then(async (answers) => {
    const { projectName, template, darkMode, gitInit, gitPush, local } = answers;

    try {
      BuildProjectDir(projectName);
      await GenTemplate(projectName, template, { darkMode, local });
      GenReadme(projectName, template);
      GitInit(projectName, gitInit);
      
      if (gitPush) {
        await handleGitPush(projectName, gitPush);
      }
    } catch (error) {
      console.log(chalk.red("\n❌ Une erreur est survenue : " + error.message));
    }
  });
}