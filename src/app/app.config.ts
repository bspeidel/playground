import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeEn from '@angular/common/locales/en';
import localeFr from '@angular/common/locales/fr';

import { routes } from './app.routes';
import { EN, LOCALE_TAGS, STORAGE_KEY, isLocaleId } from './i18n/locales';

// Registering the locale data once, at bootstrap, keeps `DatePipe`,
// `DecimalPipe` and `CurrencyPipe` working for every tag the app can switch to.
registerLocaleData(localeDe);
registerLocaleData(localeEn);
registerLocaleData(localeFr);

/**
 * Locale for the initial render. `LOCALE_ID` is resolved once and cannot
 * follow later switches — that is what the reactive pipes in
 * `i18n/locale.pipes.ts` are for. This only avoids a number formatting flash
 * on the very first paint.
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

  if (typeof navigator !== 'undefined') {
    for (const candidate of [navigator.language, ...(navigator.languages ?? [])]) {
      const primary = candidate?.toLowerCase().split('-')[0];
      if (isLocaleId(primary)) {
        return LOCALE_TAGS[primary];
      }
    }
  }

  return LOCALE_TAGS[EN];
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
