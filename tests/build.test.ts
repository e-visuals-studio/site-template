/**
 * Testi buildov (pnpm test): preview/produkcija po branchu, primer/ ne uide v build stranke, check:todo.
 * Vsak build gre v svojo mapo v .test-dist/ (v projektu: Astro premika datoteke, kar med diski ne gre), dist/ ostane nedotaknjen.
 */
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { before, describe, it } from 'node:test';

const root = new URL('..', import.meta.url).pathname;

/** Okolje brez spremenljivk, ki določajo preview (CI jih nastavi sam). */
function cleanEnv(extra: Record<string, string>) {
  const env = { ...process.env };
  for (const name of ['SITE_ENV', 'CF_PAGES_BRANCH', 'GITHUB_REF_NAME', 'BRIEF', 'SITE_URL', 'ANALYTICS_ID']) delete env[name];
  return { ...env, ...extra };
}

async function build(env: Record<string, string>) {
  await mkdir(join(root, '.test-dist'), { recursive: true });
  const outDir = await mkdtemp(join(root, '.test-dist', 'build-'));
  const result = spawnSync('pnpm', ['exec', 'astro', 'build', '--outDir', outDir], { cwd: root, env: cleanEnv(env), encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return outDir;
}

async function htmlFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { recursive: true });
  return entries.filter((f) => f.endsWith('.html')).map((f) => join(dir, f));
}

const checkTodo = (dist: string, ...files: string[]) =>
  spawnSync('pnpm', ['exec', 'factory-check-todo', dist, ...files], { cwd: root, encoding: 'utf8' });

describe('branch, ki ni main (GitHub Actions) → preview', () => {
  let dist: string;
  before(async () => {
    dist = await build({ BRIEF: 'primer', GITHUB_REF_NAME: 'faza-3-template' });
  });

  it('robots.txt prepove indeksiranje', async () => {
    assert.match(await readFile(join(dist, 'robots.txt'), 'utf8'), /^Disallow: \/$/m);
  });

  it('vsaka stran ima meta noindex', async () => {
    const files = await htmlFiles(dist);
    assert.ok(files.length > 10);
    for (const file of files) {
      assert.match(await readFile(file, 'utf8'), /<meta name="robots" content="noindex, nofollow">/, file);
    }
  });

  it('check:todo preview preskoči (tudi z briefom, polnim TODO)', () => {
    const result = checkTodo(dist, 'brief.yaml');
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /preview/);
  });
});

describe('main → produkcija', () => {
  let dist: string;
  before(async () => {
    dist = await build({ BRIEF: 'primer', GITHUB_REF_NAME: 'main' });
  });

  it('indeksiranje dovoljeno, sitemap v robots.txt', async () => {
    const robots = await readFile(join(dist, 'robots.txt'), 'utf8');
    assert.doesNotMatch(robots, /^Disallow: \/$/m);
    assert.match(robots, /Sitemap: https:\/\/www\.mizarstvo-vzorec\.example\/sitemap-index\.xml/);
    assert.match(await readFile(join(dist, 'index.html'), 'utf8'), /<meta name="robots" content="index, follow/);
  });

  it('primer je brez TODO', () => {
    const result = checkTodo(dist, 'primer/brief.yaml', 'assets.licenses.yaml');
    assert.equal(result.status, 0, result.stderr);
  });

  it('SITE_ENV ima prednost pred branchem', async () => {
    const preview = await build({ BRIEF: 'primer', GITHUB_REF_NAME: 'main', SITE_ENV: 'preview' });
    assert.match(await readFile(join(preview, 'robots.txt'), 'utf8'), /^Disallow: \/$/m);
  });
});

describe('build stranke (brez BRIEF)', () => {
  let dist: string;
  before(async () => {
    dist = await build({});
  });

  it('ne vsebuje ničesar iz primer/', async () => {
    for (const file of await readdir(dist, { recursive: true })) {
      assert.doesNotMatch(file, /vzdrzevanje-oljenega|kako-izbrati-les/, `datoteka iz primer/blog: ${file}`);
      if (!/\.(html|xml|txt|json|js|css)$/.test(file)) continue;
      const content = await readFile(join(dist, file), 'utf8');
      assert.doesNotMatch(content, /Vzorec|mizarstvo-vzorec|izmišljen primer/i, `vsebina primera v ${file}`);
    }
  });

  it('nima angleških strani, ker brief nima jezika en', async () => {
    assert.ok(!(await readdir(dist)).includes('en'));
  });

  it('check:todo pade na TODO iz briefa', () => {
    const result = checkTodo(dist, 'brief.yaml');
    assert.equal(result.status, 1);
    assert.match(result.stderr, /TODO/);
  });
});
