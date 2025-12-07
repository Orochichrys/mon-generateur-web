#!/usr/bin/env node

import { program } from "commander";
import { IsProjectNameValid,BuildProjectDir } from "./utility.js";


function main(projetName, templateName, init){
  /* console.log(`Project Name: ${NameArg}|`);
  console.log(`Template: ${templateName}|`);
  console.log(`Init?: ${init}|`); */
  BuildProjectDir(projetName)
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

if ( NameArg === "" ){ // start interactive setup if no value is passed
  console.log(`No name value Passed\nInteractive Mode started`);

} else if ( IsProjectNameValid(NameArg) === true ){ // If the Project is valid start automatic creation
  
  main(NameArg, Template, Init);

} else {
  console.log("Invalid format for the Project Name");
}
