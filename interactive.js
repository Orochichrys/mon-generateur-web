import chalk from "chalk";
import inquirer from "inquirer";
import {
  IsProjectNameValid,
  BuildProjectDir,
  GenTemplate,
  GitInit,
} from "./utility.js";

export default function InteractiveSetup() {
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
      type: "rawlist", // Changement ici : une liste de choix
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
  console.log(chalk.blue.bold("🚀 Générateur de Site Web Ultime"));
  inquirer.prompt(questions).then((answers) => {
    const { projectName, template, gitInit } = answers;

    // ---------------------------------------------------------
    // 1. CRÉATION DE LA STRUCTURE DE DOSSIERS
    // ---------------------------------------------------------
    BuildProjectDir(projectName);

    // ---------------------------------------------------------
    // 2. GÉNÉRATION DU CONTENU SELON LE TEMPLATE
    // ---------------------------------------------------------
    GenTemplate(projectName, template);

    // ---------------------------------------------------------
    // 3. INITIALISATION GIT
    // ---------------------------------------------------------
    GitInit(projectName, gitInit);
  });
}
