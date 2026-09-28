import { Injectable, effect, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'playground-theme';

function readInitialMode(): ThemeMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
  } catch {
    // localStorage can throw in private browsing / sandboxed iframes.
  }

  return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light';
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  /**
   * Initialised from `localStorage` / `prefers-color-scheme` during
   * construction, so the very first render already has the right theme and no
   * flash of the wrong colour scheme occurs.
   */
  readonly isDark = signal(readInitialMode() === 'dark');

  constructor() {
    effect(() => {
      const dark = this.isDark();
      document.documentElement.classList.toggle('dark-theme', dark);

      try {
        localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
      } catch {
        // Persistence is best-effort; the theme still applies for this session.
      }
    });
  }

  toggleTheme(): void {
    this.isDark.update((dark) => !dark);
  }
}
