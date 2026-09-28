/**
 * defer demo / shell strings.
 *
 * `de` is the source of truth for this namespace. `en` and `fr` are typed
 * as `Record<NamespaceKey, string>` against it, so adding a key without
 * translating it is a compile error rather than a silent fallback.
 */
export const de = {
  'defer.page.title': 'Deferrable Views (<code>@defer</code>)',
  'defer.page.subtitle':
    'Native Performance-Optimierung von Angular zum granularen, verzögerten Laden von Komponenten.',
  'defer.interaction.title': 'Trigger : <code>on interaction</code>',
  'defer.interaction.subtitle': 'Verzögertes Laden beim Klick auf den Trigger-Button',
  'defer.interaction.placeholder': 'Der Inhalt wartet auf Benutzerinteraktion.',
  'defer.interaction.action': 'Klicken zum Laden der Komponente',
  'defer.interaction.loading': 'JavaScript-Chunk wird geladen...',
  'defer.hover.title': 'Trigger : <code>on hover</code>',
  'defer.hover.subtitle': 'Ladevorgang ausgelöst durch Überfahren mit dem Mauszeiger',
  'defer.hover.placeholder':
    'Bewegen Sie die Maus über diesen Bereich, um das sofortige Laden auszulösen!',
  'defer.hover.loading': 'Laden durch Hover ausgelöst...',
  'defer.timer.title': 'Trigger : <code>on timer(2s)</code>',
  'defer.timer.subtitle': 'Automatisches verzögertes Laden nach 2 Sekunden',
  'defer.timer.placeholder': 'Countdown von 2 Sekunden vor dem automatischen Laden...',
  'defer.timer.loading': 'Automatisches Laden nach Verzögerung...',
  'defer.heavy.title': 'Komponente bei Bedarf geladen (@defer)!',
  'defer.heavy.description':
    'Diese Komponente und ihr JavaScript-Code wurden erst heruntergeladen und instanziiert, als die Trigger-Bedingung erfüllt war.',
} as const;

export type NamespaceKey = keyof typeof de;

export const en: Record<NamespaceKey, string> = {
  'defer.page.title': 'Deferrable views (<code>@defer</code>)',
  'defer.page.subtitle':
    'Native performance optimization in Angular for granular, deferred loading of components.',
  'defer.interaction.title': 'Trigger: <code>on interaction</code>',
  'defer.interaction.subtitle': 'Deferred loading when the trigger button is clicked',
  'defer.interaction.placeholder': 'The content is waiting for user interaction.',
  'defer.interaction.action': 'Click to load the component',
  'defer.interaction.loading': 'Loading JavaScript chunk...',
  'defer.hover.title': 'Trigger: <code>on hover</code>',
  'defer.hover.subtitle': 'Loading triggered by hovering with the pointer',
  'defer.hover.placeholder': 'Hover over this area to trigger instant loading!',
  'defer.hover.loading': 'Loading triggered by hover...',
  'defer.timer.title': 'Trigger: <code>on timer(2s)</code>',
  'defer.timer.subtitle': 'Automatic deferred loading after 2 seconds',
  'defer.timer.placeholder': '2 second countdown before the automatic load...',
  'defer.timer.loading': 'Automatic loading after the delay...',
  'defer.heavy.title': 'Component loaded on demand (@defer)!',
  'defer.heavy.description':
    'This component and its JavaScript code were only downloaded and instantiated once the trigger condition was met.',
};

export const fr: Record<NamespaceKey, string> = {
  'defer.page.title': 'Vues différables (<code>@defer</code>)',
  'defer.page.subtitle':
    'Optimisation de performance native d’Angular pour un chargement granulaire et différé des composants.',
  'defer.interaction.title': 'Déclencheur : <code>on interaction</code>',
  'defer.interaction.subtitle': 'Chargement différé au clic sur le bouton déclencheur',
  'defer.interaction.placeholder': 'Le contenu attend une interaction de l’utilisateur.',
  'defer.interaction.action': 'Cliquez pour charger le composant',
  'defer.interaction.loading': 'Chargement du chunk JavaScript...',
  'defer.hover.title': 'Déclencheur : <code>on hover</code>',
  'defer.hover.subtitle': 'Chargement déclenché au survol avec le pointeur de la souris',
  'defer.hover.placeholder':
    'Survolez cette zone avec la souris pour déclencher le chargement instantané !',
  'defer.hover.loading': 'Chargement déclenché au survol...',
  'defer.timer.title': 'Déclencheur : <code>on timer(2s)</code>',
  'defer.timer.subtitle': 'Chargement différé automatique après 2 secondes',
  'defer.timer.placeholder': 'Compte à rebours de 2 secondes avant le chargement automatique...',
  'defer.timer.loading': 'Chargement automatique après le délai...',
  'defer.heavy.title': 'Composant chargé à la demande (@defer) !',
  'defer.heavy.description':
    'Ce composant et son code JavaScript n’ont été téléchargés et instanciés qu’une fois la condition du déclencheur remplie.',
};
