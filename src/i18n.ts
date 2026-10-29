/**
 * Splošna besedila vmesnika in poti po jezikih. Tu NI podatkov o stranki – ti so samo v brief.yaml.
 */
import type { BriefLang } from '@e-visuals-studio/core/brief';

export type Lang = BriefLang;
export type PageKey = 'home' | 'about' | 'services' | 'contact' | 'privacy';

export const routes: Record<Lang, Record<PageKey, string>> = {
  sl: { home: '/', about: '/o-nas/', services: '/storitve/', contact: '/kontakt/', privacy: '/zasebnost/' },
  en: { home: '/en/', about: '/en/about/', services: '/en/services/', contact: '/en/contact/', privacy: '/en/privacy/' },
};

export const BLOG_PATH = '/blog/';

export const ui = {
  sl: {
    home: 'Domov',
    about: 'O nas',
    services: 'Storitve',
    contact: 'Kontakt',
    privacy: 'Politika zasebnosti',
    blog: 'Blog',
    blogTitle: 'Blog in novice',
    blogLatest: 'Iz bloga',
    blogAll: 'Vse objave',
    blogEmpty: 'Objav še ni.',
    blogDescription: 'Novice in nasveti',
    cta: 'Pošljite povpraševanje',
    ourServices: 'Naše storitve',
    faq: 'Pogosta vprašanja',
    ctaTitle: 'Potrebujete ponudbo?',
    ctaText: 'Opišite, kaj potrebujete, in pripravili vam bomo ponudbo.',
    contactIntro: 'Pokličite, pišite ali nas obiščite.',
    footerSite: 'Stran',
    breadcrumbs: 'Drobtinice',
    notFoundTitle: 'Te strani ni',
    notFoundText: 'Morda je bila premaknjena. Poskusite z domačo stranjo.',
    notFoundCta: 'Na domačo stran',
    notFoundDescription: 'Iskana stran ne obstaja ali je bila premaknjena. Vrnite se na domačo stran.',
    languageSwitch: { label: 'EN', title: 'English', hreflang: 'en' },
    privacyIntro: 'Kako obdelujemo osebne podatke',
    controller: 'Upravljavec osebnih podatkov',
    contactPrivacy: 'Kontakt za vprašanja o zasebnosti',
    analytics: 'Merjenje obiskanosti',
    analyticsText: {
      none: 'Obiskanosti strani ne merimo in ne uporabljamo analitičnih orodij.',
      umami:
        'Obiskanost merimo z orodjem Umami, ki ne uporablja piškotkov in ne shranjuje IP-naslovov. Zbiramo samo zbirne podatke: obiskane strani, napotitelja, vrsto naprave in brskalnika ter državo.',
      plausible:
        'Obiskanost merimo z orodjem Plausible, ki ne uporablja piškotkov in ne shranjuje IP-naslovov. Zbiramo samo zbirne podatke: obiskane strani, napotitelja, vrsto naprave in brskalnika ter državo.',
      ga4: 'Z vašo privolitvijo uporabljamo Google Analytics 4, ki postavi piškotke _ga in _ga_*. Privolitev lahko kadarkoli spremenite prek povezave »Nastavitve piškotkov« na dnu strani.',
    },
  },
  en: {
    home: 'Home',
    about: 'About us',
    services: 'Services',
    contact: 'Contact',
    privacy: 'Privacy policy',
    blog: 'Blog',
    blogTitle: 'Blog and news',
    blogLatest: 'From the blog',
    blogAll: 'All posts',
    blogEmpty: 'No posts yet.',
    blogDescription: 'News and advice',
    cta: 'Send an enquiry',
    ourServices: 'Our services',
    faq: 'Frequently asked questions',
    ctaTitle: 'Need a quote?',
    ctaText: 'Tell us what you need and we will prepare a quote for you.',
    contactIntro: 'Call, write or visit us.',
    footerSite: 'Site',
    breadcrumbs: 'Breadcrumbs',
    notFoundTitle: 'Page not found',
    notFoundText: 'It may have been moved. Try the home page.',
    notFoundCta: 'Go to the home page',
    notFoundDescription: 'The page you are looking for does not exist or has been moved. Return to the home page.',
    languageSwitch: { label: 'SL', title: 'Slovenščina', hreflang: 'sl' },
    privacyIntro: 'How we process personal data',
    controller: 'Data controller',
    contactPrivacy: 'Contact for privacy questions',
    analytics: 'Visitor statistics',
    analyticsText: {
      none: 'We do not measure visits and do not use analytics tools.',
      umami:
        'We measure visits with Umami, which does not use cookies or store IP addresses. We only collect aggregate data: pages visited, referrer, device and browser type, and country.',
      plausible:
        'We measure visits with Plausible, which does not use cookies or store IP addresses. We only collect aggregate data: pages visited, referrer, device and browser type, and country.',
      ga4: 'With your consent we use Google Analytics 4, which sets the _ga and _ga_* cookies. You can change your consent at any time via the "Cookie settings" link at the bottom of the page.',
    },
  },
} satisfies Record<Lang, unknown>;

export const otherLang = (lang: Lang): Lang => (lang === 'sl' ? 'en' : 'sl');
