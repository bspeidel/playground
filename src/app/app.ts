import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { ThemeService } from './services/theme.service';

export interface NavItem {
  path: string;
  label: string;
  icon: string;
}

export interface NavCategory {
  name: string;
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
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly breakpointObserver = inject(BreakpointObserver);
  readonly themeService = inject(ThemeService);
  readonly title = signal('playground');

  readonly isMobile = signal(false);
  readonly isSidenavOpen = signal(true);

  readonly navCategories: readonly NavCategory[] = [
    {
      name: 'Général',
      items: [{ path: '/overview', label: "Vue d'ensemble", icon: 'dashboard' }],
    },
    {
      name: 'Fonctionnalités Angular & Perf',
      items: [
        { path: '/signals', label: 'Signals & Zoneless', icon: 'bolt' },
        { path: '/defer', label: 'Defer (@defer)', icon: 'hourglass_empty' },
        { path: '/api-explorer', label: 'API & Réseau', icon: 'public' },
        { path: '/virtual-scroll', label: 'Virtual Scroll & Perf', icon: 'speed' },
      ],
    },
    {
      name: 'Composants & Démos UI',
      items: [
        { path: '/material', label: 'Material 3', icon: 'palette' },
        { path: '/forms', label: 'Formulaires Typés', icon: 'dynamic_form' },
        { path: '/table', label: 'Data Table & KPIs', icon: 'table_chart' },
        { path: '/kanban', label: 'Kanban Board', icon: 'view_kanban' },
        { path: '/charts', label: 'Analytics & Graphiques', icon: 'insights' },
        { path: '/stepper', label: 'Assistant Déploiement', icon: 'rocket_launch' },
        { path: '/tree', label: 'Explorateur Fichiers', icon: 'folder_open' },
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
  }

  onNavLinkClick(sidenav: MatSidenav): void {
    if (this.isMobile()) {
      void sidenav.close();
    }
  }
}
