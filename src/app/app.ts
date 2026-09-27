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
      name: 'Allgemein',
      items: [{ path: '/overview', label: 'Übersicht', icon: 'dashboard' }],
    },
    {
      name: 'Angular-Funktionen & Performance',
      items: [
        { path: '/signals', label: 'Signals & Zoneless', icon: 'bolt' },
        { path: '/defer', label: 'Defer (@defer)', icon: 'hourglass_empty' },
        { path: '/api-explorer', label: 'API & Netzwerk', icon: 'public' },
        { path: '/virtual-scroll', label: 'Virtuelles Scrollen & Performance', icon: 'speed' },
      ],
    },
    {
      name: 'UI-Komponenten & Demos',
      items: [
        { path: '/material', label: 'Material 3', icon: 'palette' },
        { path: '/forms', label: 'Typisierte Formulare', icon: 'dynamic_form' },
        { path: '/table', label: 'Datentabelle & KPIs', icon: 'table_chart' },
        { path: '/kanban', label: 'Kanban-Board', icon: 'view_kanban' },
        { path: '/charts', label: 'Analysen & Diagramme', icon: 'insights' },
        { path: '/stepper', label: 'Bereitstellungsassistent', icon: 'rocket_launch' },
        { path: '/tree', label: 'Datei-Explorer', icon: 'folder_open' },
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
