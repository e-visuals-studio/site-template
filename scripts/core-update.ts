/**
 * pnpm core:update vX.Y.Z
 *
 * Preklopi @e-visuals-studio/core na drug tag iz factory-core: posodobi odvisnost v package.json
 * in dovoljenje za build (prepare → dist/) v pnpm-workspace.yaml, ki ga pnpm 10 zahteva s točnim commitom.
 * Nato požene `pnpm install`. Ko bo core na npm, ta skript odpade (glej README v factory-core, Distribucija).
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';

const REPO = 'e-visuals-studio/factory-core';
const PACKAGE = '@e-visuals-studio/core';
const tag = process.argv[2];
if (!tag || !/^v\d+\.\d+\.\d+(-[\w.]+)?$/.test(tag)) {
  console.error('Uporaba: pnpm core:update vX.Y.Z');
  process.exit(1);
}

// Anotiran tag ima ločen objekt; `^{}` vrne commit, na katerega kaže.
const refs = execFileSync('git', ['ls-remote', `https://github.com/${REPO}.git`, `refs/tags/${tag}`, `refs/tags/${tag}^{}`], {
  encoding: 'utf8',
});
const lines = refs.trim().split('\n').filter(Boolean);
const commit = (lines.find((l) => l.endsWith('^{}')) ?? lines[0])?.split('\t')[0];
if (!commit) {
  console.error(`Tag ${tag} v ${REPO} ne obstaja.`);
  process.exit(1);
}

const pkgPath = new URL('../package.json', import.meta.url);
const pkg = JSON.parse(await readFile(pkgPath, 'utf8'));
pkg.dependencies[PACKAGE] = `github:${REPO}#${tag}&path:packages/core`;
await writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

const wsPath = new URL('../pnpm-workspace.yaml', import.meta.url);
const allow = `  - "${PACKAGE}@https://codeload.github.com/${REPO}/tar.gz/${commit}#path:packages/core"`;
const ws = await readFile(wsPath, 'utf8');
const pattern = new RegExp(`^  - "${PACKAGE.replace('/', '\\/')}@.*"$`, 'm');
if (!pattern.test(ws)) {
  console.error(`V pnpm-workspace.yaml ni vrstice za ${PACKAGE} v onlyBuiltDependencies.`);
  process.exit(1);
}
await writeFile(wsPath, ws.replace(pattern, allow));

console.log(`✓ ${PACKAGE} → ${tag} (${commit.slice(0, 7)})`);
execFileSync('pnpm', ['install'], { stdio: 'inherit' });

// pnpm 10 ob PRVI razrešitvi novega commita zapiše v lockfile `integrity` brez `path: packages/core`;
// `pnpm install --frozen-lockfile` (CI, nov klon) bi nato razpakiral cel monorepo namesto paketa.
// Ko je tarball že v store-u, ponovna razrešitev zapiše pravilno – zato po potrebi še `pnpm update` samo za core.
const lockUrl = new URL('../pnpm-lock.yaml', import.meta.url);
const installed = new URL('../node_modules/@e-visuals-studio/core/', import.meta.url);
const lockHasPath = async () =>
  new RegExp(`resolution: \\{gitHosted: true, path: packages/core, tarball: [^}]*${commit}`).test(await readFile(lockUrl, 'utf8'));

if (!(await lockHasPath())) {
  console.log('↻ lockfile brez path: packages/core – ponovna razrešitev core');
  execFileSync('pnpm', ['update', PACKAGE], { stdio: 'inherit' });
}
const ok =
  (await lockHasPath()) &&
  existsSync(new URL('dist/integration.js', installed)) &&
  JSON.parse(await readFile(new URL('package.json', installed), 'utf8')).name === PACKAGE;
if (!ok) {
  console.error(`✗ lockfile ali node_modules ne vsebuje ${PACKAGE} iz packages/core. Izbriši pnpm-lock.yaml in node_modules ter ponovi pnpm install.`);
  process.exit(1);
}
console.log('✓ lockfile in node_modules preverjena (packages/core, dist/)');
