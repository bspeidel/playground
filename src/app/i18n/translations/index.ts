/**
 * Aggregates the per-namespace dictionaries into the three lookup tables the
 * app uses at runtime.
 *
 * Splitting the dictionary by namespace keeps the diffs reviewable and stops
 * unrelated pages from clobbering each other, while `TranslationKey` below is
 * still the union of every key in the app: `en` and `fr` are declared as
 * `Record<TranslationKey, string>`, so a key missing from either is a compile
 * error at this boundary even if it slipped past a namespace's own check.
 */
import { DE, EN, FR, type LocaleId } from '../locales';

import * as shell from './shell';
import * as nav from './nav';
import * as overview from './overview';
import * as signals from './signals';
import * as defer from './defer';
import * as api from './api';
import * as table from './table';
import * as kanban from './kanban';
import * as tree from './tree';
import * as forms from './forms';
import * as charts from './charts';
import * as material from './material';
import * as virtualScroll from './virtual-scroll';
import * as stepper from './stepper';

/**
 * One entry per namespace. The key is only for readability — the dictionary
 * is a flat map and the namespaces are already encoded in each key.
 */
const NAMESPACES = {
  shell,
  nav,
  overview,
  signals,
  defer,
  api,
  table,
  kanban,
  tree,
  forms,
  charts,
  material,
  virtualScroll,
  stepper,
} as const;

type NamespaceTable = (typeof NAMESPACES)[keyof typeof NAMESPACES];

/**
 * Distributes over the union of the 14 namespace types. A plain
 * `keyof NamespaceTable['de']` would intersect instead of union — and since
 * the namespaces have disjoint key sets, that collapses to `never`.
 */
type KeysOf<T> = T extends unknown ? keyof T : never;

/** Every key in the app, across all namespaces. */
export type TranslationKey = KeysOf<NamespaceTable['de']>;

function merge(pick: (table: NamespaceTable) => Record<string, string>) {
  const out: Record<string, string> = {};
  for (const table of Object.values(NAMESPACES)) {
    Object.assign(out, pick(table));
  }
  return out;
}

export const de: Record<TranslationKey, string> = merge((t) => t.de) as Record<
  TranslationKey,
  string
>;
export const en: Record<TranslationKey, string> = merge((t) => t.en) as Record<
  TranslationKey,
  string
>;
export const fr: Record<TranslationKey, string> = merge((t) => t.fr) as Record<
  TranslationKey,
  string
>;

export const TRANSLATIONS: Record<LocaleId, Record<string, string>> = {
  [DE]: de,
  [EN]: en,
  [FR]: fr,
};
