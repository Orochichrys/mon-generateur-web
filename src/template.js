import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import https from 'https';

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on("finish", () => {
        file.close(resolve);
      });
    }).on("error", (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

export function GenReadme(projectName, template, version) {
  const projectDir = path.join(process.cwd(), projectName);
  const content = `# ${projectName}

Projet généré avec **CREATE MY SITE v${version}**.

## 🚀 Démarrage Rapide

1. Ouvre \`index.html\` dans ton navigateur.
2. Édite les fichiers dans \`assets/\` pour personnaliser ton site.

## 📁 Structure du Projet

- \`index.html\` : Structure principale (SEO & Open Graph ready).
- \`assets/css/style.css\` : Tes styles personnalisés.
- \`assets/js/script.js\` : Ta logique JavaScript.
- \`assets/img/\` : Images et icônes.
- \`assets/vendor/\` : Bibliothèques externes (ex: Bootstrap local).

## 🛠 Template utilisé
Ce projet utilise le template **${template}**.

---
*Généré par [CREATE MY SITE](https://create-my-site-docs.vercel.app/)*
`;
  fs.writeFileSync(path.join(projectDir, "README.md"), content);
}

export async function GenTemplate(projectName, template, version, options = {}) {
  const { darkMode = false, local = false } = options;
  const projectDir = path.join(process.cwd(), projectName);
  const vendorDir = path.join(projectDir, "assets", "vendor");
  
  let headContent = "";
  let bodyContent = "";
  let cssContent = "";
  let htmlClass = darkMode ? ' class="dark"' : "";
  let bodyAttr = darkMode ? ' data-bs-theme="dark"' : "";

  const BOOTSTRAP_CSS_URL = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
  const BOOTSTRAP_JS_URL = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js";

  switch (template) {
    case "Bootstrap 5":
      let bsCss = local ? "assets/vendor/bootstrap.min.css" : BOOTSTRAP_CSS_URL;
      let bsJs = local ? "assets/vendor/bootstrap.bundle.min.js" : BOOTSTRAP_JS_URL;

      if (local) {
        console.log(chalk.yellow("📦 Téléchargement de Bootstrap pour usage local..."));
        try {
          await downloadFile(BOOTSTRAP_CSS_URL, path.join(vendorDir, "bootstrap.min.css"));
          await downloadFile(BOOTSTRAP_JS_URL, path.join(vendorDir, "bootstrap.bundle.min.js"));
        } catch (error) {
          console.log(chalk.red("❌ Échec du téléchargement local. Utilisation du CDN."));
          bsCss = BOOTSTRAP_CSS_URL;
          bsJs = BOOTSTRAP_JS_URL;
        }
      }

      headContent = `<link href="${bsCss}" rel="stylesheet">`;
      bodyContent = `
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg border-bottom ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-white shadow-sm'}">
        <div class="container">
            <a class="navbar-brand fw-bold" href="#">${projectName}</a>
        </div>
    </nav>

    <!-- Hero Section -->
    <header class="py-5 text-center bg-light border-bottom ${darkMode ? 'bg-dark text-white border-secondary' : ''}">
        <div class="container py-5">
            <h1 class="display-4 fw-bold mb-4">Bienvenue sur votre nouveau projet</h1>
            <p class="lead mb-5 text-muted">Ce site a été généré avec <strong>CREATE MY SITE</strong>. <br> Prêt pour le déploiement immédiat.</p>
            <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
                <button type="button" class="btn btn-primary btn-lg px-4 gap-3">Commencer</button>
                <button type="button" class="btn btn-outline-secondary btn-lg px-4">Documentation</button>
            </div>
        </div>
    </header>

    <!-- Content / Features -->
    <main class="container py-5">
        <div class="row g-4 py-5 justify-content-center">
            <div class="col-md-6">
                <div class="card h-100 shadow-sm border-0 rounded-4 ${darkMode ? 'bg-secondary bg-opacity-10 text-white' : ''}">
                    <div class="card-body p-5">
                        <div class="mb-3 d-inline-flex p-3 bg-primary bg-opacity-10 rounded-3">
                            <svg class="text-primary" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/><path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/></svg>
                        </div>
                        <h2 class="h4 fw-bold">Bootstrap 5 ${local ? '(Offline)' : '(CDN)'}</h2>
                        <p class="card-text text-muted">Structure robuste, composants réactifs et thèmes personnalisables. Vous êtes sur la branche <code>main</code> active.</p>
                        <a href="#" class="text-decoration-none fw-semibold">En savoir plus &rarr;</a>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <footer class="py-4 border-top text-center text-muted">
        <p>&copy; 2026 ${projectName} &middot; Fait avec CREATE MY SITE</p>
    </footer>

    <script src="${bsJs}"></script>`;
      cssContent = `/* Styles personnalisés */\nbody { font-family: 'Inter', system-ui, -apple-system, sans-serif; }`;
      break;

    case "Tailwind CSS":
      headContent = `<script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            colors: {
              primary: '#3b82f6',
            }
          }
        }
      }
    </script>`;
      bodyContent = `
    <!-- Navbar -->
    <nav class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16 items-center">
                <span class="text-xl font-bold text-slate-900 dark:text-white">${projectName}</span>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <header class="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-20 text-center">
        <div class="max-w-4xl mx-auto px-4">
            <h1 class="text-5xl font-extrabold text-slate-900 dark:text-white mb-6">Bienvenue sur votre nouveau projet</h1>
            <p class="text-xl text-slate-600 dark:text-slate-400 mb-10">Ce site a été généré avec <span class="font-bold text-blue-600 dark:text-blue-400">CREATE MY SITE</span>. <br> Prêt pour le déploiement immédiat.</p>
            <div class="flex flex-col sm:flex-row justify-center gap-4">
                <button class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition duration-300 shadow-lg">Commencer</button>
                <button class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold py-3 px-8 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition">Documentation</button>
            </div>
        </div>
    </header>

    <!-- Content / Features -->
    <main class="max-w-7xl mx-auto py-20 px-4">
        <div class="flex justify-center">
            <div class="max-w-lg w-full bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-10 transform hover:scale-[1.02] transition duration-300">
                <div class="inline-flex p-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-6">
                    <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">Tailwind CSS (Zero-Build)</h2>
                <p class="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">Framework utilitaire pour une liberté totale de design. Votre site est structuré avec élégance. Branche <code>main</code> active.</p>
                <a href="#" class="text-blue-600 dark:text-blue-400 font-bold hover:underline inline-flex items-center">
                    En savoir plus <span class="ml-2">&rarr;</span>
                </a>
            </div>
        </div>
    </main>

    <footer class="py-10 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400">
        <p>&copy; 2026 ${projectName} &middot; Fait avec CREATE MY SITE</p>
    </footer>`;
      cssContent = `/* Styles personnalisés */\n@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\nbody { font-family: 'Inter', system-ui, sans-serif; }`;
      break;

    default: // Site Vide
      headContent = "";
      bodyContent = `
    <div style="max-width: 600px; margin: 100px auto; text-align: center; font-family: system-ui, sans-serif;">
        <h1 style="color: #333;">Bienvenue sur ${projectName}</h1>
        <p style="color: #666; font-size: 1.2rem;">Ton site statique a été généré avec succès.</p>
        <div style="margin-top: 30px; padding: 20px; background: #eee; border-radius: 8px;">
            <code>Édite assets/js/script.js pour commencer</code>
        </div>
    </div>`;
      cssContent = `body {\n    font-family: sans-serif;\n    padding: 0;\n    margin: 0;\n    background-color: ${darkMode ? '#121212' : '#ffffff'};\n    color: ${darkMode ? '#e0e0e0' : '#1a1a1a'};\n}`;
      break;
  }

  const finalHtml = `<!DOCTYPE html>
<html lang="fr"${htmlClass}>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <title>${projectName}</title>
    <meta name="description" content="Site web créé avec CREATE MY SITE">
    <meta name="author" content="CREATE MY SITE">
    
    <meta property="og:title" content="${projectName}">
    <meta property="og:description" content="Découvrez mon nouveau projet web !">
    <meta property="og:type" content="website">
    <meta property="og:url" content="">
    <meta property="og:image" content="assets/img/og-image.jpg">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${projectName}">
    
    <link rel="icon" type="image/x-icon" href="assets/img/favicon.ico">
    ${headContent}
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body${bodyAttr}>
    ${bodyContent}
    <script src="assets/js/script.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(projectDir, "index.html"), finalHtml);
  fs.writeFileSync(path.join(projectDir, "assets", "css", "style.css"), cssContent);
  
  const jsContent = `/**\n * Script pour ${projectName}\n * Généré par CREATE MY SITE v${version}\n */\nconsole.log('🚀 Site chargé avec succès !');`;
  fs.writeFileSync(path.join(projectDir, "assets", "js", "script.js"), jsContent);

  console.log(chalk.cyan("📄 Fichiers générés (SEO ready, Assets structurés)."));
}
