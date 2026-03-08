import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { execSync } from 'child_process';

export function IsProjectNameValid(ProjectName) {
  const expression = /^([a-z\-\_\d])+$/;
  return expression.test(ProjectName);
}

export function checkCommand(command) {
  try {
    execSync(`${command} --version`, { stdio: "ignore" });
    return true;
  } catch (e) {
    return false;
  }
}

const CONFIG_PATH = path.join(process.env.HOME || process.env.USERPROFILE, ".cms-config.json");

export function saveToken(token) {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify({ github_token: token }));
  } catch (e) {}
}

export function loadToken() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
      return config.github_token;
    }
  } catch (e) {}
  return null;
}

export function BuildProjectDir(projectName) {
  const currentDir = process.cwd();
  const projectDir = path.join(currentDir, projectName);

  if (fs.existsSync(projectDir)) {
    console.log(chalk.red("❌ Ce dossier existe déjà."));
    process.exit(1);
  }

  const assetsDir = path.join(projectDir, "assets");
  fs.mkdirSync(projectDir);
  fs.mkdirSync(assetsDir);
  fs.mkdirSync(path.join(assetsDir, "css"));
  fs.mkdirSync(path.join(assetsDir, "js"));
  fs.mkdirSync(path.join(assetsDir, "img"));
  fs.mkdirSync(path.join(assetsDir, "vendor"));

  console.log(chalk.green(`📁 Structure créée : ${projectName}/ (assets/css, js, img, vendor)`));
}
