/**
 * api demo / shell strings.
 *
 * `de` is the source of truth for this namespace. `en` and `fr` are typed
 * as `Record<NamespaceKey, string>` against it, so adding a key without
 * translating it is a compile error rather than a silent fallback.
 */
export const de = {
  'api.page.title': 'API-Explorer & <code>resource()</code> Netzwerk',
  'api.page.subtitle':
    'Live-Suche über die öffentliche GitHub-API zur Demonstration der nativen Netzwerk-Reaktivität von Angular 22, asynchronem Statusmanagement und automatischem Abbruch laufender Anfragen via <code>AbortSignal</code>.',
  'api.search.label': 'GitHub-Repository suchen',
  'api.search.placeholder': 'Z. B.: angular, rxjs, vite...',
  'api.sort.label': 'Sortieren nach',
  'api.sort.stars': 'Sterne (Stars)',
  'api.sort.forks': 'Forks',
  'api.sort.updated': 'Kürzlich aktualisiert',
  'api.actions.refresh': 'Aktualisieren',
  'api.quickTags.label': 'Schnellvorschläge :',
  'api.status.loading': 'Ladevorgang läuft via resource()...',
  'api.status.error': 'Anfragefehler',
  'api.status.success': 'Repositories gefunden',
  'api.metrics.aborted': 'Automatisch abgebrochene Anfragen (AbortSignal) :',
  'api.metrics.debounce': 'Eingaben werden {ms} ms entprellt',
  'api.error.title': 'Repositories konnten nicht geladen werden',
  'api.error.retry': 'Erneut versuchen',
  'api.repo.noDescription': 'Keine Beschreibung angegeben.',
  'api.repo.viewOnGithub': 'Auf GitHub ansehen',
  'api.empty.title': 'Keine Ergebnisse gefunden für "{query}"',
  'api.empty.hint': 'Versuchen Sie eine andere Suche wie "angular", "typescript" oder "material".',
} as const;

export type NamespaceKey = keyof typeof de;

export const en: Record<NamespaceKey, string> = {
  'api.page.title': 'API Explorer & <code>resource()</code> network',
  'api.page.subtitle':
    "Live search over the public GitHub API to demonstrate Angular 22's native network reactivity, async state management, and automatic cancellation of in-flight requests via <code>AbortSignal</code>.",
  'api.search.label': 'Search GitHub repositories',
  'api.search.placeholder': 'E.g.: angular, rxjs, vite...',
  'api.sort.label': 'Sort by',
  'api.sort.stars': 'Stars',
  'api.sort.forks': 'Forks',
  'api.sort.updated': 'Recently updated',
  'api.actions.refresh': 'Refresh',
  'api.quickTags.label': 'Quick suggestions:',
  'api.status.loading': 'Loading via resource()...',
  'api.status.error': 'Request error',
  'api.status.success': 'Repositories found',
  'api.metrics.aborted': 'Automatically aborted requests (AbortSignal):',
  'api.metrics.debounce': 'Input is debounced by {ms} ms',
  'api.error.title': 'Could not load repositories',
  'api.error.retry': 'Retry',
  'api.repo.noDescription': 'No description provided.',
  'api.repo.viewOnGithub': 'View on GitHub',
  'api.empty.title': 'No results found for "{query}"',
  'api.empty.hint': 'Try a different search, such as "angular", "typescript" or "material".',
};

export const fr: Record<NamespaceKey, string> = {
  'api.page.title': 'Explorateur d’API & réseau avec <code>resource()</code>',
  'api.page.subtitle':
    'Recherche en direct via l’API publique GitHub pour démontrer la réactivité réseau native d’Angular 22, la gestion asynchrone des états et l’annulation automatique des requêtes en cours via <code>AbortSignal</code>.',
  'api.search.label': 'Rechercher un dépôt GitHub',
  'api.search.placeholder': 'Ex. : angular, rxjs, vite...',
  'api.sort.label': 'Trier par',
  'api.sort.stars': 'Étoiles (Stars)',
  'api.sort.forks': 'Forks',
  'api.sort.updated': 'Récemment mis à jour',
  'api.actions.refresh': 'Actualiser',
  'api.quickTags.label': 'Suggestions rapides :',
  'api.status.loading': 'Chargement en cours via resource()...',
  'api.status.error': 'Erreur de requête',
  'api.status.success': 'dépôts trouvés',
  'api.metrics.aborted': 'Requêtes annulées automatiquement (AbortSignal) :',
  'api.metrics.debounce': 'Les saisies sont débouncées de {ms} ms',
  'api.error.title': 'Impossible de charger les dépôts',
  'api.error.retry': 'Réessayer',
  'api.repo.noDescription': 'Aucune description fournie.',
  'api.repo.viewOnGithub': 'Voir sur GitHub',
  'api.empty.title': 'Aucun résultat trouvé pour « {query} »',
  'api.empty.hint':
    'Essayez une autre recherche comme « angular », « typescript » ou « material ».',
};
