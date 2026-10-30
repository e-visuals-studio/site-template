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
| `pnpm core:update vX.Y.Z` | preklop na drug tag factory-core: odvisnost, dovoljenje za build v `pnpm-workspace.yaml` in `site.yml@vX.Y.Z` v `.github/workflows/ci.yml` (paket in CI vedno na istem tagu) |

## Okoljske spremenljivke

| Spremenljivka | Pomen |
| --- | --- |
| `SITE_ENV` | `preview` ali `production`; ima prednost pred branchem |
| `GITHUB_REF_NAME` / `CF_PAGES_BRANCH` | nastavi CI; vse razen `main` je preview |
| `ANALYTICS_ID` | Umami websiteId ali GA4 measurementId (ponudnik je v briefu); obvezen v produkcijskem buildu, če ponudnik ni `none` |
| `BRIEF` | samo `primer` (izmišljen primer) |
| `SITE_URL` | lokalni Lighthouse (`http://localhost`) in deploy templata (`site-url: https://factory.krizaj.net` v CI); stranka ga ne nastavi (domena iz briefa) |
| `SITE_NOINDEX` | `true`: produkcijski build z noindex (meta, `X-Robots-Tag`), `robots.txt` odprt; samo template (`noindex: true` v CI) |

**Preview** (branch ≠ `main` ali `SITE_ENV=preview`): `robots.txt` z `Disallow: /`, `<meta name="robots" content="noindex">` na vseh straneh, brez analitike, TODO je dovoljen. **Produkcija** (`main`): `pnpm check:todo` mora uspeti.

## CI

`.github/workflows/ci.yml` (PR in push na `main`) pokliče reusable workflow `site.yml` iz factory-core: `pnpm install --frozen-lockfile`, `build`, `check`, `check:tokens`, `test`, `lighthouse` in na pushu v `main` še `check:todo`. Build teče s `SITE_ENV=production` (na PR-ju sicer preview z noindex). Po zelenih checkih sledi deploy na Cloudflare Workers (spodaj).

- `site.yml` je na istem tagu kot `@e-visuals-studio/core`; oba posodobi `pnpm core:update vX.Y.Z`. Dependabot (`.github/dependabot.yml`) posodablja samo druge akcije, `site.yml` izpusti.
- V templatu CI gradi izmišljen primer (`brief: primer`), ker je `brief.yaml` poln TODO. **Repozitorij stranke vrstico `brief: primer` odstrani**, da CI gradi njen `brief.yaml` (in na `main` `check:todo` zahteva izpolnjen brief).
- `main` je zaščiten z rulesetom: samo prek PR-ja z zelenim CI, brez force pusha in brisanja; pregled drugega človeka ni obvezen, admin ni izvzet. Repozitorij stranke ustvarjen iz templata rulesetov ne podeduje – nastavi ga ob zagonu enako kot v site-template.

## Deploy (Cloudflare Workers)

Stran je Worker samo s statičnimi datotekami (`wrangler.jsonc`, `wrangler` kot devDependency); gradi in nalaga GitHub Actions prek `site.yml`, Cloudflare ne gradi ničesar.

- **PR** → preview `https://pr-<št.>-<worker>.<podomena>.workers.dev` (noindex, brez analitike), povezava v komentarju na PR (ob novem pushu se isti komentar posodobi). Alias vedno kaže zadnji commit, vsak commit ima še svoj URL (`<verzija>-<worker>.<podomena>.workers.dev`), ki ostane. Produkcija se ne spremeni.
- **push na `main`** (po zelenih checkih) → `wrangler deploy` na produkcijsko domeno in smoke test.
- Template se objavlja na `https://factory.krizaj.net` (izmišljen primer, `noindex: true`); previewi na `https://pr-<št.>-site-template.krizaj.workers.dev`. Produkcijski `site-template.krizaj.workers.dev` je izklopljen (`workers_dev: false`, Cloudflare vrne napako 1042).
- **Rollback**: Cloudflare dashboard → Workers & Pages → Worker → Deployments → izbrana verzija → Deploy.

**Nova stranka** (Cloudflare račun stranke, ti si član):

1. Cloudflare: workers.dev podomena računa (Workers & Pages), Account ID.
2. API token: My Profile → API Tokens → Create Custom Token → samo **Account → Workers Scripts → Edit**, samo račun stranke, brez cone, z rokom veljavnosti.
3. GitHub repo stranke → Settings → Secrets and variables → Actions: secret `CLOUDFLARE_API_TOKEN`, variable `CLOUDFLARE_ACCOUNT_ID`.
4. `.github/workflows/ci.yml`: `worker-name` = ime stranke (npr. `client-ime`), odstrani `brief: primer`, `site-url` in `noindex`.
5. Merge v `main` ustvari Worker. Nato Worker → Settings → Domains & Routes → Add → Custom domain → domena stranke (ne sme imeti obstoječega CNAME zapisa). Do takrat smoke test javi le opozorilo.

## Posodobitev core

Core je za zdaj git odvisnost na tag (`github:e-visuals-studio/factory-core#vX.Y.Z&path:packages/core`). Nova verzija: `pnpm core:update vX.Y.Z` (posodobi tudi klic `site.yml` v CI na isti tag), nato build in testi. Ko bo core na npm, bo to navadna semver odvisnost (posodablja Renovate) – glej README v factory-core, Distribucija.
