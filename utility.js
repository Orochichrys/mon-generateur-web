import fs from "fs";
import path from "path";
import chalk from "chalk";

export function IsProjectNameValid(ProjectName){
    const expression = /^([a-z\-\_\d])+$/;
    return expression.test(ProjectName);
}


export function BuildProjectDir(projectName){
    const currentDir = process.cwd();
    const projectDir = path.join(currentDir, projectName);

  // ---------------------------------------------------------
  // 1. CRÉATION DE LA STRUCTURE DE DOSSIERS
  // ---------------------------------------------------------
  if (fs.existsSync(projectDir)) {
    console.log(chalk.red('❌ Ce dossier existe déjà.'));
    process.exit(1);
  }

  fs.mkdirSync(projectDir);
  fs.mkdirSync(path.join(projectDir, 'css')); // Dossier CSS
  fs.mkdirSync(path.join(projectDir, 'js'));  // Dossier JS
  fs.mkdirSync(path.join(projectDir, 'img')); // Dossier IMG
  
  console.log(chalk.green(`📁 Structure créée : ${projectName}/ (css, js, img)`));
}
