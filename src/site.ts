/**
 * Navigacija, footer, kontakt in meta opisi – vse sestavljeno iz briefa in splošnih besedil (i18n.ts).
 */
import type { LinkItem, NavItem } from '@e-visuals-studio/core';
import { companyInfo, isTodo, t, telHref } from '@e-visuals-studio/core/brief';
import { brief } from './brief';
import { BLOG_PATH, routes, ui, type Lang, type PageKey } from './i18n';

export const languages = brief.jeziki as Lang[];
export const hasEnglish = languages.includes('en');
export const siteName = brief.stranka.ime;

export function nav(lang: Lang): NavItem[] {
  const r = routes[lang];
  const s = ui[lang];
  return [
    { label: s.services, href: r.services },
    { label: s.about, href: r.about },
    // Blog je samo v slovenščini.
    ...(lang === 'sl' ? [{ label: s.blog, href: BLOG_PATH, match: BLOG_PATH }] : []),
    { label: s.contact, href: r.contact },
  ];
}

export const cta = (lang: Lang): LinkItem => ({ label: ui[lang].cta, href: routes[lang].contact });

export function footer(lang: Lang) {
  const s = ui[lang];
  return {
    tagline: t(brief.stranka.dejavnost, lang),
    columns: [
      { title: s.footerSite, links: nav(lang) },
      {
        title: s.contact,
        links: [
          { label: brief.kontakt.telefon, href: telHref(brief.kontakt.telefon) },
          { label: brief.kontakt.email, href: `mailto:${brief.kontakt.email}` },
        ],
      },
    ],
    legal: [{ label: s.privacy, href: routes[lang].privacy }, ...(lang === 'sl' ? [{ label: 'RSS', href: '/rss.xml' }] : [])],
    companyInfo: companyInfo(brief, lang),
  };
}

/** Povezave na isto stran v drugih jezikih (hreflang); `null` za strani samo v slovenščini. */
export function alternates(page: PageKey | null) {
  if (!page || !hasEnglish) return [];
  return [
    ...languages.map((l) => ({ hreflang: l, href: routes[l][page] })),
    { hreflang: 'x-default', href: routes.sl[page] },
  ];
}

export function languageSwitch(lang: Lang, page: PageKey | null) {
  if (!hasEnglish || !page) return undefined;
  const other = lang === 'sl' ? 'en' : 'sl';
  return { ...ui[lang].languageSwitch, href: routes[other][page] };
}

/**
 * Meta description iz delov briefa: 50–160 znakov. Prekratkemu doda opis podjetja,
 * predolgega skrajša na meji besede.
 */
export function describe(lang: Lang, ...parts: string[]): string {
  let text = parts.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
  if (text.length < 50) text = `${text} ${t(brief.stranka.opis, lang)}`.trim();
  if (text.length <= 160) return text;
  const cut = text.slice(0, 159);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,.;:–-]$/, '')}…`;
}

/** Ali ima vrednost še TODO (za pogojni prikaz, npr. zemljevida ali FAQ). */
export const filled = (value: unknown) => !isTodo(value);
