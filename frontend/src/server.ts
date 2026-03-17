import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import { existsSync, readFileSync } from 'node:fs';

import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine({
  allowedHosts: [
    'www.neumaticosramos.es',
    'neumaticosramos.es',
    'www.neumaticosramos.com',
    'neumaticosramos.com',
    'neumaticos-ramos-production.up.railway.app',
  ]
});

/**
 * Servir robots.txt y sitemap.xml explícitamente
 */
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\n\nSitemap: https://neumaticosramos.es/sitemap.xml`);
});

app.get('/sitemap.xml', (req, res) => {
  const sitemapPath = join(browserDistFolder, 'sitemap.xml');
  if (existsSync(sitemapPath)) {
    res.type('application/xml');
    res.send(readFileSync(sitemapPath, 'utf-8'));
  } else {
    res.status(404).send('Sitemap not found');
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
