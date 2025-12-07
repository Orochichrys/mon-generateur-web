#!/usr/bin/env node

import chalk from "chalk";
import { program } from "commander";
import { IsProjectNameValid,BuildProjectDir,GenTemplate,GitInit } from "./utility.js";
import InteractiveSetup from "./interactive.js";

function main(projetName, templateName, init){
  BuildProjectDir(projetName);
  GenTemplate(projetName, templateName);
  GitInit(projetName,init)
}

program
  .argument('[name]',"le nom du projet")
  .option('-t, --template <TEMPLATE>',"la template à utilisée","tailwind")
  .option('--no-init',"désactive l'éxecution automatique de git init",true)

program.parse()

const options = program.opts();
const Template = options.template.trim()
const Init = options.init

const [ Arg ] = program.args;
const NameArg = Arg === undefined ? "" : Arg.trim();
const AvalaibleTemplates = {
  "bootstrap" : "Bootstrap 5",
  "tailwind" : "Tailwind CSS",
  "empty" : "Site Vide (HTML/CSS/JS basique)" 
}


if ( NameArg === "" ){ // start interactive setup if no value is passed
  InteractiveSetup()

} else if ( IsProjectNameValid(NameArg) === true ){ // If the Project is valid start automatic creation
  
  //check if template is an avalaible one
  const realTemplateName = AvalaibleTemplates[Template]
  if (realTemplateName === undefined){
    console.log(
      chalk.red(`"${Template}" n'est pas une template officiel`)
    );
    console.log("Disponible:");
    console.log(Object.keys(AvalaibleTemplates));
    process.exit(1);
  }

  // run main when everything is ok
  main(NameArg, realTemplateName, Init);

} else {
  console.log(chalk.red("Le format pour le nom du projet est invalide"));
  console.log(chalk.magenta("Veuillez à ce que le nom du projet:"))
  console.log(
    chalk.bold(`  * Contienne que des lettres mininuscules de 'a' à 'z'
  * Contienne aucuns caractéres spéciales sauf ('_' et '-')
  * Contienne des chiffres`)
  )
}
