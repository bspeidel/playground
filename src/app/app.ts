import {
  Component,
  ElementRef,
  signal,
  inject,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from './services/theme.service';
import { TranslatePipe, TranslateService, LOCALE_NAMES, type LocaleId } from './i18n';
import type { TranslationKey } from './i18n/translations';

export interface NavItem {
  path: string;
  /** Translation key for the label, resolved by the `t` pipe. */
  labelKey: TranslationKey;
  icon: string;
}

export interface NavCategory {
  nameKey: TranslationKey;
  items: NavItem[];
}

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
    MatButtonToggleModule,
    MatTooltipModule,
    TranslatePipe,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly router = inject(Router);
  readonly themeService = inject(ThemeService);
  readonly translate = inject(TranslateService);
  readonly title = signal('playground');

  readonly localeNames = LOCALE_NAMES;

  readonly mainContent = viewChild<ElementRef<HTMLElement>>('mainContent');

  setLocale(locale: LocaleId): void {
    this.translate.setLocale(locale);
  }

  readonly isMobile = signal(false);
  readonly isSidenavOpen = signal(true);

  readonly navCategories: readonly NavCategory[] = [
    {
      nameKey: 'nav.category.general',
      items: [{ path: '/overview', labelKey: 'nav.overview', icon: 'dashboard' }],
    },
    {
      nameKey: 'nav.category.angular',
      items: [
        { path: '/signals', labelKey: 'nav.signals', icon: 'bolt' },
        { path: '/defer', labelKey: 'nav.defer', icon: 'hourglass_empty' },
        { path: '/api-explorer', labelKey: 'nav.api', icon: 'public' },
        { path: '/virtual-scroll', labelKey: 'nav.virtualScroll', icon: 'speed' },
      ],
    },
    {
      nameKey: 'nav.category.ui',
      items: [
        { path: '/material', labelKey: 'nav.material', icon: 'palette' },
        { path: '/forms', labelKey: 'nav.forms', icon: 'dynamic_form' },
        { path: '/table', labelKey: 'nav.table', icon: 'table_chart' },
        { path: '/kanban', labelKey: 'nav.kanban', icon: 'view_kanban' },
        { path: '/charts', labelKey: 'nav.charts', icon: 'insights' },
        { path: '/stepper', labelKey: 'nav.stepper', icon: 'rocket_launch' },
        { path: '/tree', labelKey: 'nav.tree', icon: 'folder_open' },
      ],
    },
  ];

  /** Flat list for backward compatibility and testing */
  get navLinks(): readonly NavItem[] {
    return this.navCategories.flatMap((category) => category.items);
  }

  constructor() {
    this.breakpointObserver
      .observe(['(max-width: 960px)'])
      .pipe(takeUntilDestroyed())
      .subscribe((result) => {
        const mobile = result.matches;
        this.isMobile.set(mobile);
        this.isSidenavOpen.set(!mobile);
      });

    // Move focus into the freshly rendered page after each navigation so
    // keyboard and screen-reader users are not stranded on the nav link.
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        queueMicrotask(() => this.mainContent()?.nativeElement.focus());
      });
  }

  onNavLinkClick(sidenav: MatSidenav): void {
    if (this.isMobile()) {
      void sidenav.close();
    }
  }
}
