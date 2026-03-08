import { execSync } from 'child_process';
import path from 'path';
import chalk from 'chalk';
import https from 'https';
import fs from 'fs';
import inquirer from 'inquirer';
import { saveToken, loadToken, checkCommand } from './helpers.js';

async function createGitHubRepoViaAPI(projectName, token, version) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      name: projectName,
      public: true,
      description: `Project created with CREATE MY SITE (REST API Fallback)`,
    });

    const options = {
      hostname: "api.github.com",
      path: "/user/repos",
      method: "POST",
      headers: {
        "Authorization": `token ${token}`,
        "User-Agent": `CREATE-MY-SITE-v${version}`,
        "Content-Type": "application/json",
        "Content-Length": data.length,
      },
    };

    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        let responseData;
        try {
          responseData = JSON.parse(body);
        } catch (e) {
          return reject(new Error("Réponse invalide de l'API GitHub"));
        }

        if (res.statusCode === 201) {
          resolve(responseData);
        } else {
          // Analyser les erreurs détaillées de GitHub
          let errorMessage = responseData.message || "Erreur inconnue";
          if (responseData.errors && responseData.errors.length > 0) {
            const details = responseData.errors.map(err => `${err.resource} ${err.code} (${err.message || ''})`).join(", ");
            errorMessage += ` - ${details}`;
          }
          reject(new Error(errorMessage));
        }
      });
    });

    req.on("error", (err) => reject(err));
    req.write(data);
    req.end();
  });
}

export async function handleGitPush(projectName, shouldPush, version, token = null) {
  if (!shouldPush) return;

  const projectDir = path.join(process.cwd(), projectName);

  try {
    execSync("git add .", { cwd: projectDir, stdio: "ignore" });
    execSync('git commit -m "Initial commit: Project created with CREATE MY SITE"', {
      cwd: projectDir,
      stdio: "ignore",
    });
  } catch (e) {}

  const ghInstalled = checkCommand("gh");

  if (ghInstalled && !token && !loadToken()) {
    try {
      console.log(chalk.blue(`\n🚀 Utilisation de GitHub CLI pour créer le dépôt...`));
      execSync(`gh repo create ${projectName} --public --source=. --remote=origin --push`, {
        cwd: projectDir,
        stdio: "inherit",
      });
      console.log(chalk.green.bold(`\n✨ Dépôt créé et projet pushé via "gh" !`));
      return;
    } catch (error) {
      const errorMsg = error.message.toLowerCase();
      if (errorMsg.includes("already exists") || errorMsg.includes("exist déjà")) {
        console.log(chalk.yellow(`\n⚠️  Le dépôt "${projectName}" existe déjà sur GitHub.`));
        return;
      }
      console.log(chalk.yellow("⚠️  L'envoi via 'gh' a échoué. Tentative via API..."));
    }
  }

  let apiToken = token || loadToken();
  let retry = true;

  while (retry) {
    if (!apiToken) {
      console.log(chalk.yellow("\n💡 GitHub CLI n'est pas installé ou non connecté."));
      const answers = await inquirer.prompt([{
        type: "password",
        name: "token",
        message: "Colle ton GitHub Personal Access Token (PAT) pour continuer :",
        validate: (input) => input.length > 0 || "Le token est requis."
      }]);
      apiToken = answers.token;
    }

    try {
      console.log(chalk.cyan(`\n📦 Création du dépôt via l'API GitHub REST...`));
      const repoData = await createGitHubRepoViaAPI(projectName, apiToken, version);
      
      saveToken(apiToken);

      const repoUrl = repoData.clone_url.replace("https://", `https://${apiToken}@`);
      
      console.log(chalk.blue("📤 Envoi des fichiers vers GitHub..."));
      execSync("git branch -M main", { cwd: projectDir, stdio: "ignore" });
      execSync(`git remote add origin ${repoData.clone_url}`, { cwd: projectDir, stdio: "ignore" });
      execSync(`git push ${repoUrl} main`, { cwd: projectDir, stdio: "ignore" });

      console.log(chalk.green.bold(`\n✨ Dépôt créé et projet pushé avec succès via API !`));
      retry = false;
    } catch (error) {
      const errorMsg = error.message.toLowerCase();
      if (errorMsg.includes("bad credentials") || errorMsg.includes("unauthorized")) {
        console.log(chalk.red("\n❌ Token invalide ou expiré."));
        apiToken = null;
      } else if (errorMsg.includes("already_exists") || errorMsg.includes("already exists")) {
        console.log(chalk.yellow(`\n⚠️  Le dépôt "${projectName}" existe déjà sur GitHub.`));
        // Essayer quand même de pusher si le remote n'existe pas localement
        try {
          const repoUrl = `https://${apiToken}@github.com/${projectName}.git`; // Estimation simplifiée de l'URL
          console.log(chalk.blue("📤 Le dépôt existe déjà, tentative de push vers l'existant..."));
          try { execSync(`git remote add origin https://github.com/${projectName}.git`, { cwd: projectDir, stdio: "ignore" }); } catch(e) {}
          execSync(`git push https://${apiToken}@github.com/${projectName}.git main`, { cwd: projectDir, stdio: "ignore" });
          console.log(chalk.green.bold(`\n✨ Projet pushé vers le dépôt existant !`));
        } catch (pushError) {
          console.log(chalk.yellow("⚠️ Impossible de pusher vers le dépôt existant (vérifie les permissions)."));
        }
        retry = false;
      } else {
        console.log(chalk.red(`\n❌ Erreur API : ${error.message}`));
        retry = false;
      }
    }
  }
}

export function GitInit(projectName, init) {
  const projectDir = path.join(process.cwd(), projectName);

  if (init) {
    try {
      execSync('git init', { cwd: projectDir, stdio: 'ignore' });
      execSync('git branch -M main', { cwd: projectDir, stdio: 'ignore' });
      console.log(chalk.magenta('🦊 Dépôt Git initialisé (branche main).'));

      const gitignoreContent = `node_modules/\n.DS_Store\n.env\nassets/vendor/\n`;
      fs.writeFileSync(path.join(projectDir, '.gitignore'), gitignoreContent);
    } catch (error) {
      console.log(chalk.yellow("⚠️ Impossible d'initialiser Git."));
    }
  }
}
