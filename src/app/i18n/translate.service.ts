import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  AVAILABLE_LOCALES,
  DE,
  FR,
  LOCALE_TAGS,
  STORAGE_KEY,
  interpolate,
  isLocaleId,
  type LocaleId,
} from './locales';
import { TRANSLATIONS } from './translations';

@Injectable({ providedIn: 'root' })
export class TranslateService {
  private readonly document = inject(DOCUMENT);

  private readonly _locale = signal<LocaleId>(readInitialLocale());

  /** Current locale, e.g. `de`. */
  readonly locale = this._locale.asReadonly();

  /** Current locale as an Angular/Intl tag, e.g. `de-DE`. */
  readonly localeTag = computed(() => LOCALE_TAGS[this._locale()]);

  readonly available = AVAILABLE_LOCALES;

  constructor() {
    effect(() => {
      const locale = this._locale();

      // Keep the document in sync: drives `:lang()` CSS selectors, screen
      // readers and the browser's own translation prompt.
      this.document.documentElement.lang = locale;

      try {
        localStorage.setItem(STORAGE_KEY, locale);
      } catch {
        // Persistence is best-effort (private mode, sandboxed iframes).
      }
    });
  }

  setLocale(locale: LocaleId): void {
    this._locale.set(locale);
  }

  toggleLocale(): void {
    this._locale.update((current) => (current === DE ? FR : DE));
  }

  /**
   * Looks a key up in the active locale and interpolates `{placeholders}`.
   *
   * Falls back to German, then to the key itself, so a missing translation
   * degrades to a visible marker rather than an empty string.
   */
  text(key: string, params?: Record<string, unknown>): string {
    const table = TRANSLATIONS[this._locale()];
    const message = table[key] ?? TRANSLATIONS[DE][key] ?? key;
    return interpolate(message, params);
  }

  /**
   * Same as {@link text} but marks the result as trusted HTML.
   *
   * Reserved for the handful of phrases that embed `<code>`, `<strong>` or
   * `<br>`. Dictionaries are bundled with the app, never user input, so there
   * is no injection risk — but keep it that way.
   */
  html(key: string, params?: Record<string, unknown>): string {
    return this.text(key, params);
  }

  /** Whether the active locale actually has a translation for `key`. */
  has(key: string): boolean {
    return key in TRANSLATIONS[this._locale()];
  }
}

function readInitialLocale(): LocaleId {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isLocaleId(stored)) {
      return stored;
    }
  } catch {
    // fall through to the browser preference
  }

  return typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('fr')
    ? 'fr'
    : 'de';
}
