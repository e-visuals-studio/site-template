/** Brief, naložen in preverjen enkrat ob buildu (shema in register licenc iz @e-visuals-studio/core/brief). */
import { loadBrief } from '@e-visuals-studio/core/brief';
import { dataSource } from './data-source';

export const { brief, todos } = await loadBrief(dataSource.brief);
