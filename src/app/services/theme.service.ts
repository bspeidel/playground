import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  readonly isDark = signal(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('playground-theme') as ThemeMode | null;
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false;
      const initialDark = savedTheme ? savedTheme === 'dark' : prefersDark;
      this.isDark.set(initialDark);

      effect(() => {
        const dark = this.isDark();
        const root = document.documentElement;
        if (dark) {
          root.classList.add('dark-theme');
          localStorage.setItem('playground-theme', 'dark');
        } else {
          root.classList.remove('dark-theme');
          localStorage.setItem('playground-theme', 'light');
        }
      });
    }
  }

  toggleTheme() {
    this.isDark.update((d) => !d);
  }
}
