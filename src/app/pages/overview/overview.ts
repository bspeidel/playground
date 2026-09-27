import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-overview',
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewPage {
  readonly features = [
    {
      title: 'Angular 22 Core & Zoneless',
      icon: 'bolt',
      description:
        'Zoneless change detection (provideZonelessChangeDetection), signal-first architecture, and high performance.',
      link: '/signals',
      tag: 'Performance',
    },
    {
      title: 'Angular Material 3',
      icon: 'palette',
      description:
        'Complete Material Design 3 theming with Azure and Blue palettes, tokens, and modern components.',
      link: '/material',
      tag: 'UI/UX',
    },
    {
      title: 'Deferrable Views (@defer)',
      icon: 'hourglass_empty',
      description:
        'Built-in template lazy-loading with triggers like viewport, hover, interaction, and timer.',
      link: '/defer',
      tag: 'Optimisation',
    },
    {
      title: 'Explorateur API & resource()',
      icon: 'public',
      description:
        "Recherche asynchrone sur l'API publique GitHub avec provideHttpClient, AbortSignal et gestion d'erreurs.",
      link: '/api-explorer',
      tag: 'Réseau',
    },
    {
      title: 'Data Table & Dashboard KPIs',
      icon: 'table_chart',
      description:
        'Tableau interactif MatTable avec tri, pagination, filtres réactifs Signals, sélection multiple et export CSV/JSON.',
      link: '/table',
      tag: 'Données',
    },
    {
      title: 'Kanban Board Drag & Drop',
      icon: 'view_kanban',
      description:
        'Gestion de tâches agile avec @angular/cdk/drag-drop, colonnes connectées, prévisualisation fluide et réactivité Signals.',
      link: '/kanban',
      tag: 'Productivité',
    },
    {
      title: 'Formulaires Réactifs & Typed Forms',
      icon: 'dynamic_form',
      description:
        'Validation asynchrone debouncée, collections FormArray extensibles, validations croisées et jauge de mot de passe.',
      link: '/forms',
      tag: 'Formulaires',
    },
  ];
}
