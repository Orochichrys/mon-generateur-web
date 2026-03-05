#!/usr/bin/env node

import chalk from "chalk";
import { program } from "commander";
import { IsProjectNameValid, BuildProjectDir, GenTemplate, GenReadme, GitInit, handleGitPush } from "./utility.js";
import InteractiveSetup from "./interactive.js";

// Fonction principale qui orchestre la création
async function main(projectName, templateName, options) {
  const { gitInit, darkMode, push, local, token } = options;
  
  BuildProjectDir(projectName);
  await GenTemplate(projectName, templateName, { darkMode, local });
  GenReadme(projectName, templateName);
  GitInit(projectName, gitInit);
  
  // Nouvelle fonctionnalité Auto-Push
  if (push) {
    await handleGitPush(projectName, push, token);
  }
}

// Configuration de Commander
program
  .argument('[name]', "le nom du projet")
  .option('-t, --template <TEMPLATE>', "le template à utiliser", "tailwind")
  .option('--no-init', "désactive l'exécution automatique de git init")
  .option('--dark', "génère un boilerplate en mode sombre", false)
  .option('--push', "crée un dépôt GitHub et push immédiatement", false)
  .option('--local', "télécharge les assets (Bootstrap) pour usage offline", false)
  .option('--token <TOKEN>', "GitHub Token pour pusher sans 'gh' CLI");

program.parse();

const options = program.opts();
const TemplateOption = options.template.trim(); // "bootstrap", "tailwind", etc.
const InitOption = options.init; // true par défaut, false si --no-init
const DarkOption = options.dark;
const PushOption = options.push;
const LocalOption = options.local;
const TokenOption = options.token;

const [Arg] = program.args;
const NameArg = Arg === undefined ? "" : Arg.trim();

// Mapping entre les noms courts (CLI) et les noms complets (Menu interactif)
const AvailableTemplates = {
  "bootstrap": "Bootstrap 5",
  "tailwind": "Tailwind CSS",
  "empty": "Site Vide (HTML/CSS/JS basique)"
};

// --- Logique de Contrôle ---

if (NameArg === "") {
  // 1. Mode Interactif (si aucun nom n'est donné)
  InteractiveSetup();

} else if (IsProjectNameValid(NameArg)) {
  // 2. Mode Automatique (CLI)
  
  // Vérification du template
  const realTemplateName = AvailableTemplates[TemplateOption];
  
  if (realTemplateName === undefined) {
    console.log(chalk.red(`❌ Erreur : "${TemplateOption}" n'est pas un template officiel.`));
    console.log(chalk.yellow("Templates disponibles :"));
    // Affiche les clés (bootstrap, tailwind, empty)
    Object.keys(AvailableTemplates).forEach(t => console.log(`- ${t}`));
    process.exit(1);
  }

  // Lancement
  await main(NameArg, realTemplateName, { 
    gitInit: InitOption, 
    darkMode: DarkOption, 
    push: PushOption,
    local: LocalOption,
    token: TokenOption
  });

} else {
  // 3. Erreur de format du nom
  console.log(chalk.red("❌ Le format du nom du projet est invalide."));
  console.log(chalk.magenta("Règles pour le nom :"));
  console.log(chalk.bold(`  * Uniquement des minuscules (a-z)
  * Pas de caractères spéciaux (sauf '_' et '-')
  * Chiffres autorisés`));
  process.exit(1);
}