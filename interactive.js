import chalk from "chalk";
import inquirer from "inquirer";
import {
  IsProjectNameValid,
  BuildProjectDir,
  GenTemplate,
  GitInit,
} from "./utility.js";

export default function InteractiveSetup() {
  console.log(chalk.blue.bold("🚀 Générateur de Site Web Ultime"));

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
        "Site Vide (HTML/CSS/JS basique)",
        "Bootstrap 5",
        "Tailwind CSS",
      ],
    },
    {
      type: "confirm",
      name: "gitInit",
      message: "Initialiser un dépôt Git (git init) ?",
      default: true,
    },
  ];

  inquirer.prompt(questions).then((answers) => {
    const { projectName, template, gitInit } = answers;

    // On exécute les fonctions utilitaires séquentiellement
    try {
      BuildProjectDir(projectName);
      GenTemplate(projectName, template);
      GitInit(projectName, gitInit);
    } catch (error) {
      console.log(chalk.red("Une erreur est survenue : " + error.message));
    }
  });
}