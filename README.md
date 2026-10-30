# site-template

GitHub Template za strani strank Website Factory (e-visuals). Astro 7 na [`@e-visuals-studio/core`](https://github.com/e-visuals-studio/factory-core): bloki, SEO, JSON-LD, analitika in tokeni so iz core, tu so samo **podatki stranke (`brief.yaml`)** in kompozicija strani.

## Nova stranka: od nič do lokalnega zagona

```sh
# 1. Repo stranke iz templata (zaseben) in klon
gh repo create e-visuals-studio/client-<ime> --private --template e-visuals-studio/site-template --clone
cd client-<ime>

# 2. Orodja
nvm use              # Node iz .nvmrc (22.23.4)
corepack enable      # pnpm iz package.json
pnpm install         # core se namesti iz git taga in zgradi (prepare)

# 3. Podatki stranke: izpolni brief.yaml (manjkajoče ostane TODO, nikoli izmišljeno)
$EDITOR brief.yaml

# 4. Placeholder slike iz tokenov (dokler ni pravih fotografij)
pnpm placeholders

# 5. Zagon
pnpm dev             # http://localhost:4321
```

Nato: `tokens.json` od designerja, prave fotografije v `src/assets/` z zapisom v `assets.licenses.yaml`, pravno besedilo v `src/content/pravno/`, posti v `src/content/blog/`.

## Struktura

```
brief.yaml              podatki stranke (shema: @e-visuals-studio/core/brief)
tokens.json             tema (designer jo zamenja)
assets.licenses.yaml    register licenc slik
src/
  brief.ts, site.ts     brief → navigacija, footer, meta opisi
  i18n.ts               splošna besedila vmesnika in poti (sl/en), brez podatkov stranke
  views/                Home, About, Services, Contact, Privacy (sestavljeni iz blokov core)
  pages/                /, /o-nas/, /storitve/, /kontakt/, /blog/, /zasebnost/, 404; /en/… samo z jezikom en
  content/blog/         posti (blogSchema iz core)
  content/pravno/       pravno besedilo zasebnosti (pravnik)
primer/                 izmišljen primer (samo BRIEF=primer), nikoli v buildu stranke
tests/                  testi buildov (preview, primer, check:todo)
```

## Ukazi

| Ukaz | Kaj naredi |
| --- | --- |
| `pnpm dev` | razvojni strežnik |
| `pnpm build` | produkcijski build v `dist/` (preview, če branch ni `main`, glej spodaj) |
| `pnpm build:primer` | build izmišljenega primera (`BRIEF=primer`) |
| `pnpm check` | `astro check` |
| `pnpm check:tokens` | pravilo »samo tokeni« (`factory-check-tokens src`) |
| `pnpm check:todo` | pade, če `dist`, brief, pravna besedila ali register licenc vsebujejo TODO; preview build preskoči. Z `BRIEF=primer` preveri primer |
| `pnpm placeholders` | placeholder slike iz `tokens.json` |
| `pnpm test` | testi buildov: noindex na branchu ≠ `main`, `primer/` ne uide v build, `check:todo` |
| `pnpm lighthouse` | Lighthouse CI na `dist/` (mobilno, ≥ 95); zgradi s `SITE_ENV=production SITE_URL=http://localhost`, Chromium iz `CHROME_PATH` |
| `pnpm core:update vX.Y.Z` | preklop na drug tag factory-core (odvisnost + dovoljenje za build v `pnpm-workspace.yaml`) |

## Okoljske spremenljivke

| Spremenljivka | Pomen |
| --- | --- |
| `SITE_ENV` | `preview` ali `production`; ima prednost pred branchem |
| `GITHUB_REF_NAME` / `CF_PAGES_BRANCH` | nastavi CI; vse razen `main` je preview |
| `ANALYTICS_ID` | Umami websiteId ali GA4 measurementId (ponudnik je v briefu); obvezen v produkcijskem buildu, če ponudnik ni `none` |
| `BRIEF` | samo `primer` (izmišljen primer) |
| `SITE_URL` | samo za lokalni Lighthouse (canonical na `http://localhost`) |

**Preview** (branch ≠ `main` ali `SITE_ENV=preview`): `robots.txt` z `Disallow: /`, `<meta name="robots" content="noindex">` na vseh straneh, brez analitike, TODO je dovoljen. **Produkcija** (`main`): `pnpm check:todo` mora uspeti.

## Posodobitev core

Core je za zdaj git odvisnost na tag (`github:e-visuals-studio/factory-core#vX.Y.Z&path:packages/core`). Nova verzija: `pnpm core:update vX.Y.Z`, nato build in testi. Ko bo core na npm, bo to navadna semver odvisnost (posodablja Renovate) – glej README v factory-core, Distribucija.
