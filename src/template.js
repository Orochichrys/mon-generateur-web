import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

async function downloadFile(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
  const arrayBuffer = await res.arrayBuffer();
  fs.writeFileSync(dest, Buffer.from(arrayBuffer));
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

  const BOOTSTRAP_CSS_URL = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
  const BOOTSTRAP_JS_URL = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js";
  const TAILWIND_JS_URL = "https://cdn.tailwindcss.com";

  // Common CSS parts (Animations, Fonts, etc.)
  const commonStyles = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@700;900&display=swap');

*, *::before, *::after {
    box-sizing: border-box;
}

:root {
    --bg-deep: #050505;
    --cyan-neon: #00d2ff;
    --violet-neon: #9d50bb;
    --glass-bg: rgba(255, 255, 255, 0.03);
    --glass-border: rgba(255, 255, 255, 0.08);
}

body {
    background-color: var(--bg-deep) !important;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    margin: 0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem 1rem;
    background-image: 
        radial-gradient(circle at 15% 50%, rgba(157, 80, 187, 0.15), transparent 25%),
        radial-gradient(circle at 85% 30%, rgba(0, 210, 255, 0.15), transparent 25%);
    position: relative;
    overflow-x: hidden;
}

body::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: 
        linear-gradient(var(--glass-border) 1px, transparent 1px),
        linear-gradient(90deg, var(--glass-border) 1px, transparent 1px);
    background-size: 30px 30px;
    z-index: -1;
    mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
    -webkit-mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
}

.glass-card {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 24px;
    padding: 3rem;
    text-align: center;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    max-width: 600px;
    width: 90%;
    position: relative;
    z-index: 1;
}

h1 {
    font-family: 'Outfit', sans-serif;
    font-size: 3.5rem;
    font-weight: 900;
    line-height: 1.1;
    margin-top: 0;
    margin-bottom: 1rem;
    letter-spacing: -2px;
}

.text-gradient {
    background: linear-gradient(135deg, var(--cyan-neon), var(--violet-neon));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
}

.subtitle {
    color: #a0a0a0;
    font-size: 1.1rem;
    margin-bottom: 2.5rem;
}

.btn-cyber {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    font-family: 'Outfit', sans-serif;
    font-weight: 700;
    font-size: 1.2rem;
    padding: 1rem 2.5rem;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    position: relative;
    overflow: hidden;
    display: inline-block;
}

.btn-cyber::before {
    content: '';
    position: absolute;
    top: 0; left: -100%; width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    transition: all 0.5s ease;
}

.btn-cyber:hover {
    border-color: var(--cyan-neon);
    box-shadow: 0 0 20px rgba(0, 210, 255, 0.3), inset 0 0 10px rgba(0, 210, 255, 0.1);
    transform: translateY(-2px);
    color: white;
}

.btn-cyber:hover::before {
    left: 100%;
}

.code-box {
    margin-top: 2rem;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid var(--glass-border);
    padding: 1rem;
    border-radius: 8px;
    font-family: monospace;
    color: var(--cyan-neon);
    font-size: 0.9rem;
}

.badge-cyber {
    background: rgba(157, 80, 187, 0.15);
    color: var(--violet-neon);
    padding: 0.4rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    border: 1px solid rgba(157, 80, 187, 0.3);
    margin-bottom: 1.5rem;
    display: inline-block;
}

.plus-sep {
    display: block;
    font-size: 2rem;
    line-height: 1;
    margin: 0.2rem 0;
    background: linear-gradient(135deg, var(--cyan-neon), var(--violet-neon));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 900;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .glass-card {
        padding: 2rem 1.5rem;
        width: 95%;
    }
    h1 {
        font-size: 2.5rem;
        letter-spacing: -1px;
    }
    .btn-cyber {
        font-size: 1rem;
        padding: 0.8rem 1.5rem;
    }
    .subtitle {
        font-size: 1rem;
    }
}`;

  switch (template) {
    case "Bootstrap 5":
      let bsCss = local ? "assets/vendor/bootstrap.min.css" : BOOTSTRAP_CSS_URL;
      if (local) {
        try {
          await downloadFile(BOOTSTRAP_CSS_URL, path.join(vendorDir, "bootstrap.min.css"));
          await downloadFile(BOOTSTRAP_JS_URL, path.join(vendorDir, "bootstrap.bundle.min.js"));
        } catch (error) {
          bsCss = BOOTSTRAP_CSS_URL;
        }
      }

      headContent = `<link href="${bsCss}" rel="stylesheet">`;
      bodyContent = `
    <div class="glass-card">
        <div class="badge-cyber">v${version} • Cyber-Elegance</div>

        <h1 class="mb-3">
            <a href="https://create-my-site-docs.vercel.app/" style="color: inherit; text-decoration: none;">Create My Site</a>
            <span class="plus-sep">+</span>
            <a href="https://getbootstrap.com/" target="_blank" style="text-decoration: none;"><span class="text-gradient">Bootstrap</span></a>
        </h1>
        
        <p class="subtitle mb-4">Scaffolder Ready. Stop configuring, start creating.</p>

        <button id="counter" class="btn-cyber w-100 mb-4">
            Initiate Sequence: <span id="count-val">0</span>
        </button>
        
        <div class="code-box text-center">
            Edit <code>assets/js/script.js</code>
        </div>
    </div>`;
      cssContent = commonStyles;
      break;

    case "Tailwind CSS":
      let twJs = local ? "assets/vendor/tailwindcss.js" : TAILWIND_JS_URL;
      if (local) {
        try {
          await downloadFile(TAILWIND_JS_URL, path.join(vendorDir, "tailwindcss.js"));
        } catch (error) {
          twJs = TAILWIND_JS_URL;
        }
      }

      headContent = `<script src="${twJs}"></script>
    <script src="assets/js/tailwind.config.js"></script>`;
      bodyContent = `
    <!-- Mesh Background -->
    <div class="absolute inset-0 z-0 bg-mesh"></div>
    <!-- Grid Background -->
    <div class="absolute inset-0 z-0 bg-grid-pattern bg-grid"></div>

    <!-- Container central -->
    <div class="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 w-full">
        <!-- Glass Card -->
        <div class="w-[95%] md:w-[90%] max-w-[600px] bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-6 md:p-12 text-center shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
            
            <div class="inline-block bg-[rgba(157,80,187,0.15)] text-[--violet-neon] px-4 py-1.5 rounded-full text-sm font-semibold border border-[rgba(157,80,187,0.3)] mb-6">
                v${version} • Cyber-Elegance
            </div>

            <h1 class="font-display text-4xl md:text-5xl font-black leading-tight mb-4 tracking-[-2px]">
                <a href="https://create-my-site-docs.vercel.app/" style="color: inherit; text-decoration: none;">Create My Site</a>
                <span class="plus-sep">+</span>
                <a href="https://tailwindcss.com/" target="_blank" style="text-decoration: none;"><span class="text-gradient">Tailwind</span></a>
            </h1>
            
            <p class="text-[#a0a0a0] text-lg mb-10">Scaffolder Ready. Stop configuring, start creating.</p>

            <button id="counter" class="btn-cyber relative overflow-hidden bg-white/5 border border-white/10 text-white font-display font-bold text-base md:text-xl py-3 px-6 md:py-4 md:px-10 rounded-xl block w-full">
                Initiate Sequence: <span id="count-val">0</span>
            </button>
            
            <div class="code-box text-center mt-8">
                Edit <code>assets/js/script.js</code>
            </div>
        </div>
    </div>`;
      cssContent = `${commonStyles}`;
      break;

    case "Site Vide (HTML/CSS/JS basique)":
      headContent = ``;
      bodyContent = `
    <div class="glass-card">
        <div class="badge-cyber">v${version} • Cyber-Elegance</div>

        <h1 style="margin-bottom: 1rem;">
            <a href="https://create-my-site-docs.vercel.app/" style="color: inherit; text-decoration: none;">Create My Site</a>
            <span class="plus-sep">+</span>
            <a href="https://developer.mozilla.org/" target="_blank" style="text-decoration: none;"><span class="text-gradient">Pure HTML/CSS/JS</span></a>
        </h1>
        
        <p class="subtitle" style="margin-bottom: 2rem;">Scaffolder Ready. Stop configuring, start creating.</p>

        <button id="counter" class="btn-cyber" style="width: 100%; margin-bottom: 2rem;">
            Initiate Sequence: <span id="count-val">0</span>
        </button>
        
        <div class="code-box" style="text-align: center;">
            Edit <code>assets/js/script.js</code>
        </div>
    </div>`;
      cssContent = `${commonStyles}`;
      break;
  }

  let htmlAttributes = 'lang="fr"';
  if (darkMode) {
    if (template === "Bootstrap 5") {
      htmlAttributes += ' data-bs-theme="dark"';
    } else if (template === "Tailwind CSS") {
      htmlAttributes += ' class="dark"';
    } else {
      htmlAttributes += ' data-theme="dark"';
    }
  }

  const finalHtml = `<!DOCTYPE html>
<html ${htmlAttributes}>
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
<body>
    ${bodyContent}
    <script src="assets/js/script.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(projectDir, "index.html"), finalHtml);
  fs.writeFileSync(path.join(projectDir, "assets", "css", "style.css"), cssContent);
  
  const jsContent = `document.addEventListener('DOMContentLoaded', () => {
  let count = 0;
  const button = document.querySelector('#counter');
  const countVal = document.querySelector('#count-val');

  const updateCounter = () => {
    count++;
    if (countVal) {
        countVal.textContent = count;
    } else {
        button.innerHTML = \`Le compteur est à \${count}\`;
    }
  };

  button.addEventListener('click', updateCounter);

  console.log("🚀 Create My Site v${version} chargé avec succès !");
});`;
  fs.writeFileSync(path.join(projectDir, "assets", "js", "script.js"), jsContent);

  if (template === "Tailwind CSS") {
    const tailwindConfigStr = `tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        deep: '#050505',
        cyanNeon: '#00d2ff',
        violetNeon: '#9d50bb',
      },
      backgroundImage: {
          'mesh': 'radial-gradient(circle at 15% 50%, rgba(157, 80, 187, 0.15), transparent 25%), radial-gradient(circle at 85% 30%, rgba(0, 210, 255, 0.15), transparent 25%)',
          'grid-pattern': 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          'text-gradient': 'linear-gradient(135deg, #00d2ff, #9d50bb)',
      }
    }
  }
};`;
    fs.writeFileSync(path.join(projectDir, "assets", "js", "tailwind.config.js"), tailwindConfigStr);
  }

  console.log(chalk.cyan(`📄 Fichiers générés (Structure v${version} cohérente).`));
}
