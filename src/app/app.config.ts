import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeFr from '@angular/common/locales/fr';

import { routes } from './app.routes';
import { LOCALE_TAGS, STORAGE_KEY, isLocaleId } from './i18n/locales';

// Registering the locale data once, at bootstrap, keeps `DatePipe`,
// `DecimalPipe` and `CurrencyPipe` working for every tag the app can switch to.
registerLocaleData(localeDe);
registerLocaleData(localeFr);

/**
 * Locale for the initial render. `LOCALE_ID` is resolved once and cannot
 * follow later switches — that is what the reactive pipes in
 * `i18n/locale.pipes.ts` are for. This only avoids a French number formatting
 * flash on the very first paint.
 */
function initialLocaleTag(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isLocaleId(stored)) {
      return LOCALE_TAGS[stored];
    }
  } catch {
    // storage unavailable
  }
  return typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('fr')
    ? LOCALE_TAGS.fr
    : LOCALE_TAGS.de;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    { provide: LOCALE_ID, useFactory: initialLocaleTag },
    provideRouter(
      routes,
      // Restore the scroll position on back/forward navigation.
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
    ),
  ],
};
