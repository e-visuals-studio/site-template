# CLAUDE.md – stran stranke (iz e-visuals-studio/site-template)

Astro stran na `@e-visuals-studio/core` (factory-core). Plan tovarne: `WEBSITE_FACTORY_PLAN.md` v factory-core.
Ukazi in koraki: `README.md`. Node 22.23.4 (`nvm use`), pnpm prek corepacka.

## Podatki stranke

- **Edini vir podatkov o stranki je `brief.yaml`**: ime, dejavnost, storitve, kontakt, naslov, delovni čas, jeziki, lokacija, ključne besede, analitika, domena, pravni podatki in slike. Strani, SEO, JSON-LD, Header, Footer in Contact jih berejo samo od tam (`src/brief.ts`, `src/site.ts`).
- **Nikoli si ne izmisli podatkov** (naslov, telefon, številke, reference, mnenja strank, letnice). Manjkajoče označi v briefu z `TODO` ali `TODO: kaj manjka`. Prazna vrednost ni dovoljena – build jo zavrne.
- Podatkov stranke ne piši v `.astro`/`.ts` datoteke; če manjka polje v briefu, ga dodaj v shemo v factory-core (`src/brief/`), ne obidi ga.
- `primer/` je izmišljen primer samo za template (`BRIEF=primer`). Iz njega nikoli ne kopiraj podatkov v `brief.yaml` stranke; v buildu stranke se ne sme pojaviti (test v `tests/build.test.ts`).
- ID analitike (Umami websiteId, GA4 measurementId) ni v repozitoriju: samo okoljska spremenljivka `ANALYTICS_ID`.
- Pravna besedila (`src/content/pravno/`) pripravi pravnik; samo okvir (upravljavec, kontakt, analitika) pride iz briefa. Ne piši pravnega besedila na pamet.

## Pravila iz core (veljajo tudi tu)

**Design samo iz tokenov**
- Barve, fonti, velikosti, razmiki, radiji, sence in animacije samo iz `tokens.json` (razredi kot `bg-primary`, `text-on-surface-muted`, `py-section`). Nikoli hex/rgb/oklch, Tailwind arbitrary vrednosti (`p-[13px]`), privzetih palet ali inline `style`. `tokens.json` zamenja designer (izvoz Figma Variables).
- Pari `on-<ozadje>` morajo imeti kontrast ≥ 4.5 : 1; build sicer pade.

**Slike in avtorske pravice**
- Nikoli ne prenašaj slik s spleta in ne vstavljaj URL-jev tujih slik.
- Manjkajoča prava slika = placeholder (`pnpm placeholders`) + `TODO` v alt besedilu v briefu.
- Vsaka slika ima zapis v `assets.licenses.yaml` (`avtor`, `vir`, `licenca`, `ai`); za slike iz briefa build brez zapisa pade.
- AI slike (`ai: true`) samo kot ilustracija: nikoli ljudje, ekipa, objekt ali izdelek stranke, ne v referencah.
- Slike samo prek `<Image>` iz `astro:assets` (bloki iz core to naredijo sami).
- Vhodne slike samo JPG, PNG ali WebP. AVIF in HEIC (iPhone fotografije) nista dovoljena kot vhod (libheif, GHSA-26w7-cxv4-gfx2): build ju zavrne po vsebini, tudi preimenovana. Sliko pretvori; varovala ne obidi z lastnim image servisom.

**Komponente in strani**
- Strani so samo kompozicija blokov iz core (`src/views/`, `src/pages/`); vsaka uporablja `<Page>` (ta vključi `BaseLayout` in `<SEO>`). En `<h1>` na stran, description 50–160 znakov.
- Kode iz core ne kopiraj. Blok, ki ga stranka potrebuje drugačen, prekrij v `src/blocks/` samo z razlogom (komentar zakaj); nova splošna komponenta gre najprej v factory-core.
- Brez JavaScripta; interaktivnost samo kot Astro island z razlogom. Analitika samo prek `factory({ analytics })` (iz briefa), nikoli ročno vstavljenih skript.
- `src/fetch.ts` je v Astro 7 rezervirano ime; ne ustvarjaj datoteke s tem imenom.
- Astro 7 pod agentom `astro dev`/`astro preview` zažene v ozadju (`astro dev status`, ustavi z `astro dev stop`); strežnik v ospredju z `--ignore-lock`.

**Jezik in odprta koda**
- Besedila na straneh, komentarji, commit sporočila in PR opisi so v slovenščini (angleške strani samo, če brief vsebuje `en`).
- Nove odvisnosti samo z OSI licenco (MIT, Apache-2.0, BSD, ISC, MPL-2.0).

## Preview in produkcija

Preview (`SITE_ENV=preview`, sicer vsak branch razen `main` prek `GITHUB_REF_NAME`/`CF_PAGES_BRANCH`): noindex, brez analitike, TODO dovoljen. Produkcija (`main`): `pnpm check:todo` mora uspeti.

## Pred commitom

```sh
pnpm build && pnpm check && pnpm check:tokens && pnpm test
```

`main` je zaščiten z rulesetom: vse prek PR-ja, ki ga združiš šele, ko je zelen CI (`.github/workflows/ci.yml` → `site.yml` iz factory-core). Core posodobi samo s `pnpm core:update vX.Y.Z` – paket in `site.yml@vX.Y.Z` morata biti na istem tagu; vrstice `uses:` ne spreminjaj ročno.

Pred produkcijo (merge v `main`) še `pnpm check:todo` (brez TODO v buildu, briefu, pravnih besedilih in registru licenc) in `SITE_ENV=production SITE_URL=http://localhost pnpm build && pnpm lighthouse` (≥ 95 v vseh kategorijah, mobilno).
