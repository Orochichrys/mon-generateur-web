import http from 'http';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import chalk from 'chalk';

export function startLivePreview(targetDir) {
  const PORT = 3000;
  const clients = new Set();

  // Surveiller les fichiers pour le rechargement automatique
  fs.watch(targetDir, { recursive: true }, (eventType, filename) => {
    if (filename) {
      // Ignorer les dossiers système comme .git ou node_modules
      if (filename.includes('.git') || filename.includes('node_modules')) return;
      
      console.log(chalk.yellow(`\n📝 Changement détecté : ${filename}. Actualisation...`));
      clients.forEach(client => {
        client.write('data: reload\n\n');
      });
    }
  });

  const requestListener = (req, res) => {
    // Gestion du flux Server-Sent Events (SSE) pour le reload
    if (req.url === '/reload') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });
      clients.add(res);
      req.on('close', () => clients.delete(res));
      return;
    }

    let filePath = path.join(targetDir, req.url === '/' ? 'index.html' : req.url);
    const extname = path.extname(filePath);
    let contentType = 'text/html';

    switch (extname) {
      case '.js': contentType = 'text/javascript'; break;
      case '.css': contentType = 'text/css'; break;
      case '.json': contentType = 'application/json'; break;
      case '.png': contentType = 'image/png'; break;
      case '.jpg': contentType = 'image/jpg'; break;
      case '.svg': contentType = 'image/svg+xml'; break;
    }

    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404);
          res.end('Fichier non trouvé');
        } else {
          res.writeHead(500);
          res.end(`Erreur serveur: ${err.code}`);
        }
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        
        // Injection du script de Live Reload uniquement dans le HTML
        if (contentType === 'text/html') {
          let html = content.toString();
          const reloadScript = `
            <script>
              const eventSource = new EventSource('/reload');
              eventSource.onmessage = (event) => {
                if (event.data === 'reload') {
                  console.log('🔄 Changement détecté, rechargement...');
                  location.reload();
                }
              };
              eventSource.onerror = () => {
                // Tentative de reconnexion si le serveur tombe
                setTimeout(() => location.reload(), 1000);
              };
            </script>
          `;
          // Ajouter le script avant la balise de fermeture body ou à la fin
          if (html.includes('</body>')) {
            html = html.replace('</body>', `${reloadScript}</body>`);
          } else {
            html += reloadScript;
          }
          res.end(html);
        } else {
          res.end(content, 'utf-8');
        }
      }
    });
  };

  const server = http.createServer(requestListener);

  server.listen(PORT, () => {
    const url = `http://localhost:${PORT}`;
    console.log(chalk.green.bold(`\n🚀 Serveur Live Preview lancé sur ${url}`));
    console.log(chalk.gray(`   Les changements de fichiers sont détectés automatiquement.`));
    console.log(chalk.gray(`   Appuyez sur Ctrl+C pour arrêter le serveur.`));

    const start = (process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open');
    exec(`${start} ${url}`);
  });
}
