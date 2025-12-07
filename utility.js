import fs from "fs";
import path from "path";
import chalk from "chalk";

export function IsProjectNameValid(ProjectName) {
  const expression = /^([a-z\-\_\d])+$/;
  return expression.test(ProjectName);
}

export function BuildProjectDir(projectName) {
  const currentDir = process.cwd();
  const projectDir = path.join(currentDir, projectName);

  // ---------------------------------------------------------
  // 1. CRÉATION DE LA STRUCTURE DE DOSSIERS
  // ---------------------------------------------------------
  if (fs.existsSync(projectDir)) {
    console.log(chalk.red("❌ Ce dossier existe déjà."));
    process.exit(1);
  }

  fs.mkdirSync(projectDir);
  fs.mkdirSync(path.join(projectDir, "css")); // Dossier CSS
  fs.mkdirSync(path.join(projectDir, "js")); // Dossier JS
  fs.mkdirSync(path.join(projectDir, "img")); // Dossier IMG

  console.log(
    chalk.green(`📁 Structure créée : ${projectName}/ (css, js, img)`)
  );
}

export function GenTemplate(projectName, template) {
  const currentDir = process.cwd();
  const projectDir = path.join(currentDir, projectName);
  let headContent = "";
  let bodyContent = "";
  let cssContent = "";

  switch (template) {
    case "Bootstrap 5":
      headContent = `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">`;
      bodyContent = `
    <div class="container py-5">
        <h1 class="mb-3">Bienvenue sur ${projectName}</h1>
        <div class="alert alert-primary" role="alert">
            Bootstrap 5 est installé et fonctionnel !
        </div>
        <button class="btn btn-success">Un bouton Bootstrap</button>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>`;
      cssContent = `/* Tes styles perso ici (après Bootstrap) */\nbody { background-color: #f8f9fa; }`;
      break;

    case "Tailwind CSS":
      headContent = `<script src="https://cdn.tailwindcss.com"></script>`;
      bodyContent = `
    <div class="container mx-auto p-10">
        <h1 class="text-4xl font-bold text-blue-600 mb-4">Bienvenue sur ${projectName}</h1>
        <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
            <p>Tailwind CSS est actif !</p>
        </div>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Bouton Tailwind
        </button>
    </div>`;
      cssContent = `/* Tes styles perso ici (si besoin) */\n@tailwind base;\n@tailwind components;\n@tailwind utilities;`;
      break;

    default: // Site Vide
      headContent = "";
      bodyContent = `
    <h1>Bienvenue sur ${projectName}</h1>
    <p>Ceci est un site basique.</p>`;
      cssContent = `body {\n    font-family: sans-serif;\n    padding: 20px;\n    background-color: #f0f0f0;\n}`;
      break;
  }

  // Création du fichier index.html
  const finalHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectName}</title>
    ${headContent}
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    ${bodyContent}
    <script src="js/script.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(projectDir, "index.html"), finalHtml);

  // Création du fichier CSS (dans le dossier css/)
  fs.writeFileSync(path.join(projectDir, "css", "style.css"), cssContent);

  // Création du fichier JS (dans le dossier js/)
  const jsContent = `console.log('Script chargé pour ${projectName}');`;
  fs.writeFileSync(path.join(projectDir, "js", "script.js"), jsContent);

  console.log(chalk.cyan("📄 Fichiers générés (html, css, js)."));
}
