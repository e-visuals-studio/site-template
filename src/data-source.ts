/**
 * Od kod so podatki: brief.yaml stranke (privzeto) ali izmišljen primer (BRIEF=primer).
 * Mapa primer/ se uporabi SAMO z BRIEF=primer – nobena datoteka je ne uvaža statično,
 * zato se v build stranke nikoli ne znajde (preverja tests/build.test.ts).
 */
const selected = process.env.BRIEF?.trim();
if (selected && selected !== 'primer') {
  throw new Error(`BRIEF sme biti samo "primer" (izmišljen primer) ali prazen (brief.yaml), ne "${selected}".`);
}

export const PRIMER = selected === 'primer';

export const dataSource = PRIMER
  ? { brief: 'primer/brief.yaml', blog: './primer/blog', pravno: './primer/pravno' }
  : { brief: 'brief.yaml', blog: './src/content/blog', pravno: './src/content/pravno' };
