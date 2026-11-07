import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// Social previews (LinkedIn, WhatsApp) need absolute image URLs.
// On Vercel, VERCEL_PROJECT_PRODUCTION_URL is set at build time (e.g. my-app.vercel.app).
// Set SITE_URL yourself to use a custom domain.
const siteUrl =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '');

// All files sit in one folder, so copy the two static images into the build ourselves.
const STATIC_FILES = ['favicon.svg', 'og-image.png'];

export default defineConfig({
  publicDir: false,
  plugins: [
    {
      name: 'site-url',
      transformIndexHtml: {
        order: 'pre',
        handler: (html) => html.replaceAll('%SITE_URL%', siteUrl),
      },
    },
    {
      name: 'copy-static-files',
      apply: 'build',
      closeBundle() {
        for (const file of STATIC_FILES) copyFileSync(resolve(file), resolve('dist', file));
      },
    },
  ],
});
