import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly themeService = inject(ThemeService);
  readonly title = signal('playground');

  readonly navLinks = [
    { path: '/overview', label: "Vue d'ensemble", icon: 'dashboard' },
    { path: '/signals', label: 'Signals & Zoneless', icon: 'bolt' },
    { path: '/material', label: 'Material 3', icon: 'palette' },
    { path: '/defer', label: 'Defer (@defer)', icon: 'hourglass_empty' },
    { path: '/api-explorer', label: 'API & Réseau', icon: 'public' },
    { path: '/table', label: 'Data Table & KPIs', icon: 'table_chart' },
    { path: '/kanban', label: 'Kanban Board', icon: 'view_kanban' },
  ];
}
