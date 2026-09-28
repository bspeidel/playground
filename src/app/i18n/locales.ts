/**
 * Runtime i18n for the playground.
 *
 * The app ships two locales. Translations are plain objects so the bundle stays
 * small and the language can be switched without a page reload, which the
 * compile-time `$localize` pipeline cannot do.
 */
export const DE = 'de';
export const FR = 'fr';

export const AVAILABLE_LOCALES = [DE, FR] as const;
export type LocaleId = (typeof AVAILABLE_LOCALES)[number];

/** Locale tags used by Angular's `LOCALE_ID`, pipes and `Intl`. */
export const LOCALE_TAGS: Record<LocaleId, string> = {
  [DE]: 'de-DE',
  [FR]: 'fr-FR',
};

export const LOCALE_NAMES: Record<LocaleId, string> = {
  [DE]: 'Deutsch',
  [FR]: 'Français',
};

export const STORAGE_KEY = 'playground-locale';

export function isLocaleId(value: unknown): value is LocaleId {
  return typeof value === 'string' && (AVAILABLE_LOCALES as readonly string[]).includes(value);
}

/** Replaces `{name}` placeholders with the supplied parameters. */
export function interpolate(template: string, params?: Record<string, unknown>): string {
  if (!params) {
    return template;
  }
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in params ? String(params[key]) : match,
  );
}
