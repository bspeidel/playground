import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'overview',
  },
  {
    path: 'overview',
    loadComponent: () => import('./pages/overview/overview').then(m => m.OverviewPage),
    title: 'Vue d\'ensemble | Playground',
  },
  {
    path: 'signals',
    loadComponent: () => import('./pages/signals-demo/signals-demo').then(m => m.SignalsDemoPage),
    title: 'Signals & Zoneless | Playground',
  },
  {
    path: 'material',
    loadComponent: () => import('./pages/material-demo/material-demo').then(m => m.MaterialDemoPage),
    title: 'Angular Material 3 | Playground',
  },
  {
    path: 'defer',
    loadComponent: () => import('./pages/defer-demo/defer-demo').then(m => m.DeferDemoPage),
    title: 'Deferrable Views (@defer) | Playground',
  },
  {
    path: '**',
    redirectTo: 'overview',
  },
];
