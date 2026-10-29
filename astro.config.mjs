// @ts-check
import { defineConfig } from 'astro/config';
import factory from '@e-visuals-studio/core/integration';
import { analyticsFromBrief, loadBrief, siteUrl, t } from '@e-visuals-studio/core/brief';
import { dataSource, PRIMER } from './src/data-source.ts';
import { routes } from './src/i18n.ts';

// Vse nastavitve strani pridejo iz briefa (glej CLAUDE.md). Neveljaven brief ali slika brez licence ustavi build.
const { brief, todos } = await loadBrief(dataSource.brief);
if (PRIMER) console.info('[brief] BRIEF=primer – izmišljen primer, ne stranka.');
if (todos.length) console.warn(`[brief] ${todos.length}× TODO v ${dataSource.brief} (produkcijo ustavi pnpm check:todo): ${todos.join(', ')}`);

export default defineConfig({
  // SITE_URL samo za lokalni Lighthouse (canonical na isti domeni).
  site: process.env.SITE_URL ?? siteUrl(brief),
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'sl',
    locales: brief.jeziki,
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    factory({
      siteName: brief.stranka.ime,
      og: { tagline: t(brief.stranka.dejavnost) },
      rss: {
        collection: 'blog',
        title: `${brief.stranka.ime} – blog`,
        description: t(brief.stranka.opis),
        basePath: '/blog/',
      },
      // Ponudnik iz briefa, ID iz okolja (ANALYTICS_ID). Preview build analitiko vedno izklopi.
      analytics: analyticsFromBrief(brief, {
        privacyHref: Object.fromEntries(brief.jeziki.map((lang) => [lang, routes[lang].privacy])),
      }),
    }),
  ],
});
