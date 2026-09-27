import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'overview',
  },
  {
    path: 'overview',
    loadComponent: () => import('./pages/overview/overview').then((m) => m.OverviewPage),
    title: "Vue d'ensemble | Playground",
  },
  {
    path: 'signals',
    loadComponent: () => import('./pages/signals-demo/signals-demo').then((m) => m.SignalsDemoPage),
    title: 'Signals & Zoneless | Playground',
  },
  {
    path: 'material',
    loadComponent: () =>
      import('./pages/material-demo/material-demo').then((m) => m.MaterialDemoPage),
    title: 'Angular Material 3 | Playground',
  },
  {
    path: 'defer',
    loadComponent: () => import('./pages/defer-demo/defer-demo').then((m) => m.DeferDemoPage),
    title: 'Deferrable Views (@defer) | Playground',
  },
  {
    path: 'api-explorer',
    loadComponent: () => import('./pages/api-explorer/api-explorer').then((m) => m.ApiExplorerPage),
    title: 'API & Réseau (GitHub) | Playground',
  },
  {
    path: 'table',
    loadComponent: () => import('./pages/table-demo/table-demo').then((m) => m.TableDemo),
    title: 'Data Table & KPIs | Playground',
  },
  {
    path: 'kanban',
    loadComponent: () => import('./pages/kanban-demo/kanban-demo').then((m) => m.KanbanDemoPage),
    title: 'Kanban Drag & Drop | Playground',
  },
  {
    path: 'forms',
    loadComponent: () => import('./pages/forms-demo/forms-demo').then((m) => m.FormsDemoPage),
    title: 'Formulaires Réactifs | Playground',
  },
  {
    path: 'virtual-scroll',
    loadComponent: () =>
      import('./pages/virtual-scroll-demo/virtual-scroll-demo').then(
        (m) => m.VirtualScrollDemoPage,
      ),
    title: 'Virtual Scrolling & Benchmark | Playground',
  },
  {
    path: 'charts',
    loadComponent: () => import('./pages/charts-demo/charts-demo').then((m) => m.ChartsDemoPage),
    title: 'Visualisation SVG & Analytics | Playground',
  },
  {
    path: 'stepper',
    loadComponent: () => import('./pages/stepper-demo/stepper-demo').then((m) => m.StepperDemoPage),
    title: 'Assistant Déploiement Cloud (Stepper) | Playground',
  },
  {
    path: '**',
    redirectTo: 'overview',
  },
];
