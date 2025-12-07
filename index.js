#!/usr/bin/env node

import chalk from "chalk";
import { program } from "commander";
import { IsProjectNameValid,BuildProjectDir,GenTemplate,GitInit } from "./utility.js";


function main(projetName, templateName, init){
  BuildProjectDir(projetName);
  GenTemplate(projetName, templateName);
  GitInit(projetName,init)
}

program
  .argument('[name]',"the name of the project")
  .option('-t, --template <TEMPLATE>',"the template to use","tailwind")
  .option('--no-init',"deactivate default git init execution",true)

program.parse()

const options = program.opts();
const Template = options.template.trim()
const Init = options.init

const Args  = program.args;
const NameArg = Args[0].trim() // remove trailing and leading whitespace for NameArg
const AvalaibleTemplates = {
  "bootstrap" : "Bootstrap 5",
  "tailwind" : "Tailwind CSS",
  "empty" : "Site Vide (HTML/CSS/JS basique)" 
}

if ( NameArg === "" ){ // start interactive setup if no value is passed
  console.log(`No name value Passed\nInteractive Mode started`);

} else if ( IsProjectNameValid(NameArg) === true ){ // If the Project is valid start automatic creation
  
  //check if template is an avalaible one
  const realTemplateName = AvalaibleTemplates[Template]
  if (realTemplateName === undefined){
    console.log(
      chalk.red(`"${Template}" is not an official template name`)
    );
    console.log("Avalaible:");
    console.log(Object.keys(AvalaibleTemplates));
    process.exit(1);
  }

  // run main when everything is ok
  main(NameArg, realTemplateName, Init);

} else {
  console.log("Invalid format for the Project Name");
}
