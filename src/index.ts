/**
 * @copyright 2017-present, Charlike Mike Reagent (https://i.am.charlike.online)
 * @license Apache-2.0
 */

import { Plugin, Mappers } from './types';
import { parse } from './lib/parse';
import { mentions } from './lib/mentions';
import { increment } from './lib/increment';

const mappers: Mappers = { mentions, increment };
const plugins: Plugin[] = [mentions, increment];

export { parse, plugins, mappers };
