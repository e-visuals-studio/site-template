/**
 * pnpm check:todo – pade, če produkcijski build (dist) ali podatki stranke vsebujejo TODO.
 * Preveri brief, ki je bil uporabljen (BRIEF=primer → primer/brief.yaml), pravna besedila in register licenc.
 * Preview build (robots.txt Disallow: /) se preskoči – logika je v factory-check-todo (@e-visuals-studio/core).
 */
import { spawnSync } from 'node:child_process';
import { dataSource } from '../src/data-source.ts';

const files = [dataSource.brief, `${dataSource.pravno}/zasebnost.sl.md`, `${dataSource.pravno}/zasebnost.en.md`, 'assets.licenses.yaml'];
const result = spawnSync('factory-check-todo', ['dist', ...files], { stdio: 'inherit', shell: process.platform === 'win32' });
process.exit(result.status ?? 1);
