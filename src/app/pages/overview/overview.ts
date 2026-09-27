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
        'Zoneless-Änderungserkennung (provideZonelessChangeDetection), Signal-First-Architektur und maximale Performance.',
      link: '/signals',
      tag: 'Performance',
    },
    {
      title: 'Angular Material 3',
      icon: 'palette',
      description:
        'Vollständiges Material Design 3 Theming mit Azure- und Blue-Paletten, Tokens und modernen Komponenten.',
      link: '/material',
      tag: 'UI/UX',
    },
    {
      title: 'Deferrable Views (@defer)',
      icon: 'hourglass_empty',
      description:
        'Integriertes Template-Lazy-Loading mit Triggern wie Viewport, Hover, Interaction und Timer.',
      link: '/defer',
      tag: 'Optimierung',
    },
    {
      title: 'API-Explorer & resource()',
      icon: 'public',
      description:
        'Asynchrone Suche über die öffentliche GitHub-API mit provideHttpClient, AbortSignal und Fehlerbehandlung.',
      link: '/api-explorer',
      tag: 'Netzwerk',
    },
    {
      title: 'Datentabelle & Dashboard-KPIs',
      icon: 'table_chart',
      description:
        'Interaktive MatTable mit Sortierung, Paginierung, reaktiven Signal-Filtern, Mehrfachauswahl und CSV/JSON-Export.',
      link: '/table',
      tag: 'Daten',
    },
    {
      title: 'Kanban-Board Drag & Drop',
      icon: 'view_kanban',
      description:
        'Agiles Aufgabenmanagement mit @angular/cdk/drag-drop, verbundenen Spalten, flüssiger Vorschau und Signal-Reaktivität.',
      link: '/kanban',
      tag: 'Produktivität',
    },
    {
      title: 'Reaktive & typisierte Formulare',
      icon: 'dynamic_form',
      description:
        'Asynchrone debouncte Validierung, erweiterbare FormArray-Sammlungen, Kreuzvalidierung und Passwortstärke-Anzeige.',
      link: '/forms',
      tag: 'Formulare',
    },
    {
      title: 'Virtuelles Scrollen & Benchmark',
      icon: 'speed',
      description:
        'Sofortiges Rendern von 50.000+ Logs mit @angular/cdk/scrolling, 99,9 % DOM-Reduzierung und 60 FPS in Zoneless.',
      link: '/virtual-scroll',
      tag: 'Performance',
    },
    {
      title: 'SVG-Visualisierung & Analysen',
      icon: 'insights',
      description:
        'Interaktives Donut-Diagramm, Geschwindigkeits-Balkendiagramm und Sparklines in nativem, reaktivem SVG ohne externe Bibliotheken.',
      link: '/charts',
      tag: 'Visualisierung',
    },
    {
      title: 'Cloud-Bereitstellungsassistent (Stepper)',
      icon: 'rocket_launch',
      description:
        'Mehrstufiger MatStepper M3 Workflow: Dimensionierung, reaktive Live-Kostenberechnung, Secret-Verwaltung und CI/CD-Logs.',
      link: '/stepper',
      tag: 'Workflow',
    },
    {
      title: 'Datei-Explorer (MatTree)',
      icon: 'folder_open',
      description:
        'Projekt-Baumstruktur mit MatTree M3 und childrenAccessor: Sofortfilter, Breadcrumbs, Knotenverwaltung und Code-Viewer.',
      link: '/tree',
      tag: 'Hierarchie',
    },
  ];
}
