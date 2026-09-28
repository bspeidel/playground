/**
 * nav demo / shell strings.
 *
 * `de` is the source of truth for this namespace. `en` and `fr` are typed
 * as `Record<NamespaceKey, string>` against it, so adding a key without
 * translating it is a compile error rather than a silent fallback.
 */
export const de = {
  'nav.category.general': 'Allgemein',
  'nav.category.angular': 'Angular-Funktionen & Performance',
  'nav.category.ui': 'UI-Komponenten & Demos',
  'nav.overview': 'Übersicht',
  'nav.signals': 'Signals & Zoneless',
  'nav.defer': 'Defer (@defer)',
  'nav.api': 'API & Netzwerk',
  'nav.virtualScroll': 'Virtuelles Scrollen & Performance',
  'nav.material': 'Material 3',
  'nav.forms': 'Typisierte Formulare',
  'nav.table': 'Datentabelle & KPIs',
  'nav.kanban': 'Kanban-Board',
  'nav.charts': 'Analysen & Diagramme',
  'nav.stepper': 'Bereitstellungsassistent',
  'nav.tree': 'Datei-Explorer',
} as const;

export type NamespaceKey = keyof typeof de;

export const en: Record<NamespaceKey, string> = {
  'nav.category.general': 'General',
  'nav.category.angular': 'Angular Features & Performance',
  'nav.category.ui': 'UI Components & Demos',
  'nav.overview': 'Overview',
  'nav.signals': 'Signals & Zoneless',
  'nav.defer': 'Defer (@defer)',
  'nav.api': 'API & Network',
  'nav.virtualScroll': 'Virtual Scrolling & Performance',
  'nav.material': 'Material 3',
  'nav.forms': 'Typed Forms',
  'nav.table': 'Data Table & KPIs',
  'nav.kanban': 'Kanban Board',
  'nav.charts': 'Analytics & Charts',
  'nav.stepper': 'Deployment Assistant',
  'nav.tree': 'File Explorer',
};

export const fr: Record<NamespaceKey, string> = {
  'nav.category.general': 'Général',
  'nav.category.angular': 'Fonctionnalités Angular & Performance',
  'nav.category.ui': 'Composants UI & Démos',
  'nav.overview': "Vue d'ensemble",
  'nav.signals': 'Signals & Zoneless',
  'nav.defer': 'Defer (@defer)',
  'nav.api': 'API & Réseau',
  'nav.virtualScroll': 'Défilement virtuel & Performance',
  'nav.material': 'Material 3',
  'nav.forms': 'Formulaires typés',
  'nav.table': 'Tableau de données & KPIs',
  'nav.kanban': 'Tableau Kanban',
  'nav.charts': 'Analyses & Graphiques',
  'nav.stepper': 'Assistant de déploiement',
  'nav.tree': 'Explorateur de fichiers',
};
