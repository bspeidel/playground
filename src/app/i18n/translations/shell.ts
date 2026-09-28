/**
 * shell demo / shell strings.
 *
 * `de` is the source of truth for this namespace. `en` and `fr` are typed
 * as `Record<NamespaceKey, string>` against it, so adding a key without
 * translating it is a compile error rather than a silent fallback.
 */
export const de = {
  'shell.a11y.toggleNav': 'Navigationsmenü umschalten',
  'shell.a11y.switchToLight': 'Zu hellem Modus wechseln',
  'shell.a11y.switchToDark': 'Zu dunklem Modus wechseln',
  'shell.a11y.language': 'Sprache wechseln',
  'shell.footer':
    'Interaktiver Angular 22 Playground • Zoneless-Änderungserkennung • Angular Material 3',
} as const;

export type NamespaceKey = keyof typeof de;

export const en: Record<NamespaceKey, string> = {
  'shell.a11y.toggleNav': 'Toggle navigation menu',
  'shell.a11y.switchToLight': 'Switch to light mode',
  'shell.a11y.switchToDark': 'Switch to dark mode',
  'shell.a11y.language': 'Change language',
  'shell.footer':
    'Interactive Angular 22 Playground • Zoneless change detection • Angular Material 3',
};

export const fr: Record<NamespaceKey, string> = {
  'shell.a11y.toggleNav': 'Afficher ou masquer le menu de navigation',
  'shell.a11y.switchToLight': 'Passer en mode clair',
  'shell.a11y.switchToDark': 'Passer en mode sombre',
  'shell.a11y.language': 'Changer de langue',
  'shell.footer':
    'Playground Angular 22 interactif • Détection de changement zoneless • Angular Material 3',
};
