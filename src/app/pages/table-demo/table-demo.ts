import {
  Component,
  signal,
  computed,
  effect,
  inject,
  viewChild,
  ChangeDetectionStrategy,
  AfterViewInit,
} from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { ProjectDialog, ProjectItem } from './project-dialog';

const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'PRJ-1024',
    name: 'Refonte E-commerce NextGen',
    client: 'OmniStore Retail',
    category: 'Web App',
    status: 'Actif',
    priority: 'Haute',
    budget: 68000,
    progress: 75,
    dueDate: new Date('2026-11-15'),
  },
  {
    id: 'PRJ-1025',
    name: 'Application Mobile Compagnon',
    client: 'FitLife Global',
    category: 'Mobile App',
    status: 'Actif',
    priority: 'Moyenne',
    budget: 42000,
    progress: 40,
    dueDate: new Date('2026-12-01'),
  },
  {
    id: 'PRJ-1026',
    name: 'Pipeline CI/CD & Migration K8s',
    client: 'FinTech Solution SAS',
    category: 'Cloud / DevOps',
    status: 'Terminé',
    priority: 'Critique',
    budget: 85000,
    progress: 100,
    dueDate: new Date('2026-08-30'),
  },
  {
    id: 'PRJ-1027',
    name: 'Design System Material 3 Unifié',
    client: 'DesignCorp Worldwide',
    category: 'Design System',
    status: 'Actif',
    priority: 'Haute',
    budget: 34000,
    progress: 90,
    dueDate: new Date('2026-10-10'),
  },
  {
    id: 'PRJ-1028',
    name: 'Audit de Conformité LLM & IA',
    client: 'AeroSpace Horizon',
    category: 'Audit AI',
    status: 'Bloqué',
    priority: 'Critique',
    budget: 95000,
    progress: 20,
    dueDate: new Date('2026-11-30'),
  },
  {
    id: 'PRJ-1029',
    name: 'Portail Partenaires & B2B API',
    client: 'LogisTech Express',
    category: 'Web App',
    status: 'En attente',
    priority: 'Moyenne',
    budget: 52000,
    progress: 10,
    dueDate: new Date('2027-01-20'),
  },
  {
    id: 'PRJ-1030',
    name: 'Dashboard Analytics Temps Réel',
    client: 'DataStream Media',
    category: 'Web App',
    status: 'Actif',
    priority: 'Critique',
    budget: 72000,
    progress: 60,
    dueDate: new Date('2026-10-31'),
  },
  {
    id: 'PRJ-1031',
    name: 'Optimisation Edge & CDN Globale',
    client: 'StreamWave Network',
    category: 'Cloud / DevOps',
    status: 'Terminé',
    priority: 'Basse',
    budget: 28000,
    progress: 100,
    dueDate: new Date('2026-09-05'),
  },
  {
    id: 'PRJ-1032',
    name: 'Assistant Vocal Intégré iOS/Android',
    client: 'AutoDrive Systems',
    category: 'Mobile App',
    status: 'En attente',
    priority: 'Haute',
    budget: 110000,
    progress: 15,
    dueDate: new Date('2027-03-15'),
  },
  {
    id: 'PRJ-1033',
    name: 'Benchmark Modèles Génératifs Multimodaux',
    client: 'VisionAI Labs',
    category: 'Audit AI',
    status: 'Actif',
    priority: 'Haute',
    budget: 64000,
    progress: 85,
    dueDate: new Date('2026-10-25'),
  },
  {
    id: 'PRJ-1034',
    name: 'Kit de Composants Accessibles WCAG',
    client: 'Public Services Connect',
    category: 'Design System',
    status: 'Terminé',
    priority: 'Moyenne',
    budget: 39000,
    progress: 100,
    dueDate: new Date('2026-07-15'),
  },
  {
    id: 'PRJ-1035',
    name: 'Sécurisation Zero-Trust & Vault',
    client: 'BankSecure Global',
    category: 'Cloud / DevOps',
    status: 'Bloqué',
    priority: 'Critique',
    budget: 125000,
    progress: 35,
    dueDate: new Date('2026-12-20'),
  },
];

@Component({
  selector: 'app-table-demo',
  imports: [
    CommonModule,
    FormsModule,
    CurrencyPipe,
    DatePipe,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressBarModule,
    MatCardModule,
    MatTooltipModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  templateUrl: './table-demo.html',
  styleUrl: './table-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableDemo implements AfterViewInit {
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  // Queries using modern viewChild() signal queries
  readonly sort = viewChild(MatSort);
  readonly paginator = viewChild(MatPaginator);

  // Reactive state signals
  readonly items = signal<ProjectItem[]>(INITIAL_PROJECTS);
  readonly searchTerm = signal<string>('');
  readonly statusFilter = signal<string>('all');
  readonly categoryFilter = signal<string>('all');
  readonly selectedCount = signal<number>(0);

  // Selection model
  readonly selection = new SelectionModel<ProjectItem>(true, []);

  // Filtered dataset computed automatically via Signals
  readonly filteredItems = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const status = this.statusFilter();
    const category = this.categoryFilter();

    return this.items().filter((p) => {
      const matchesSearch =
        !term ||
        p.name.toLowerCase().includes(term) ||
        p.client.toLowerCase().includes(term) ||
        p.id.toLowerCase().includes(term);

      const matchesStatus = status === 'all' || p.status === status;
      const matchesCategory = category === 'all' || p.category === category;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  });

  // Dynamic KPIs computed from filtered dataset
  readonly totalProjectsCount = computed(() => this.items().length);
  readonly filteredProjectsCount = computed(() => this.filteredItems().length);

  readonly totalBudget = computed(() => this.filteredItems().reduce((acc, p) => acc + p.budget, 0));

  readonly activeProjectsCount = computed(
    () => this.filteredItems().filter((p) => p.status === 'Actif').length,
  );

  readonly avgProgress = computed(() => {
    const list = this.filteredItems();
    if (!list.length) return 0;
    return Math.round(list.reduce((acc, p) => acc + p.progress, 0) / list.length);
  });

  readonly selectedBudget = computed(() => {
    // Read selectedCount signal to establish reactive tracking
    this.selectedCount();
    return this.selection.selected.reduce((acc, p) => acc + p.budget, 0);
  });

  // MatTable DataSource
  readonly dataSource = new MatTableDataSource<ProjectItem>([]);
  readonly displayedColumns: string[] = [
    'select',
    'id',
    'project',
    'category',
    'status',
    'priority',
    'budget',
    'progress',
    'dueDate',
    'actions',
  ];

  constructor() {
    // Automatically keep DataSource synchronized with filtered items
    effect(() => {
      const data = this.filteredItems();
      this.dataSource.data = data;
    });

    // Custom sorting accessor for nested & synthetic values
    this.dataSource.sortingDataAccessor = (item: ProjectItem, property: string) => {
      switch (property) {
        case 'project':
          return item.name.toLowerCase();
        case 'dueDate':
          return item.dueDate.getTime();
        default:
          return (item as unknown as Record<string, unknown>)[property] as string | number;
      }
    };
  }

  ngAfterViewInit(): void {
    const sortInstance = this.sort();
    const paginatorInstance = this.paginator();

    if (sortInstance) {
      this.dataSource.sort = sortInstance;
    }
    if (paginatorInstance) {
      this.dataSource.paginator = paginatorInstance;
    }
  }

  // Selection handlers
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected > 0 && numSelected === numRows;
  }

  isPartiallySelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected > 0 && numSelected < numRows;
  }

  toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach((row) => this.selection.select(row));
    }
    this.selectedCount.set(this.selection.selected.length);
  }

  toggleRow(row: ProjectItem): void {
    this.selection.toggle(row);
    this.selectedCount.set(this.selection.selected.length);
  }

  checkboxLabel(row?: ProjectItem): string {
    if (!row) {
      return `${this.isAllSelected() ? 'Désélectionner' : 'Sélectionner'} tous les projets`;
    }
    return `${this.selection.isSelected(row) ? 'Désélectionner' : 'Sélectionner'} le projet ${row.name}`;
  }

  // Filters reset
  resetFilters(): void {
    this.searchTerm.set('');
    this.statusFilter.set('all');
    this.categoryFilter.set('all');
    this.snackBar.open('Filtres réinitialisés', 'OK', { duration: 2500 });
  }

  // CRUD Operations
  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ProjectDialog, {
      width: '480px',
    });

    dialogRef.afterClosed().subscribe((result: ProjectItem | undefined) => {
      if (result) {
        this.items.update((current) => [result, ...current]);
        this.snackBar.open(`Projet "${result.name}" ajouté avec succès`, 'Fermer', {
          duration: 3500,
        });
      }
    });
  }

  openEditDialog(project: ProjectItem): void {
    const dialogRef = this.dialog.open(ProjectDialog, {
      width: '480px',
      data: { ...project },
    });

    dialogRef.afterClosed().subscribe((result: ProjectItem | undefined) => {
      if (result) {
        this.items.update((current) =>
          current.map((item) => (item.id === result.id ? result : item)),
        );
        this.snackBar.open(`Projet "${result.name}" mis à jour`, 'Fermer', {
          duration: 3500,
        });
      }
    });
  }

  deleteProject(project: ProjectItem): void {
    this.items.update((current) => current.filter((p) => p.id !== project.id));
    this.selection.deselect(project);
    this.selectedCount.set(this.selection.selected.length);
    this.snackBar.open(`Projet "${project.name}" supprimé`, 'Fermer', { duration: 3000 });
  }

  // Batch actions
  deleteSelected(): void {
    const count = this.selection.selected.length;
    const selectedIds = new Set(this.selection.selected.map((p) => p.id));
    this.items.update((current) => current.filter((p) => !selectedIds.has(p.id)));
    this.selection.clear();
    this.selectedCount.set(0);
    this.snackBar.open(`${count} projet(s) supprimé(s)`, 'Fermer', { duration: 3500 });
  }

  updateSelectedStatus(newStatus: ProjectItem['status']): void {
    const count = this.selection.selected.length;
    const selectedIds = new Set(this.selection.selected.map((p) => p.id));
    this.items.update((current) =>
      current.map((p) => (selectedIds.has(p.id) ? { ...p, status: newStatus } : p)),
    );
    this.selection.clear();
    this.selectedCount.set(0);
    this.snackBar.open(`Statut mis à jour pour ${count} projet(s)`, 'Fermer', { duration: 3500 });
  }

  // Export features
  exportFilteredCsv(): void {
    const data = this.filteredItems();
    if (!data.length) {
      this.snackBar.open('Aucune donnée à exporter', 'Fermer', { duration: 2500 });
      return;
    }

    const headers = [
      'ID',
      'Projet',
      'Client',
      'Categorie',
      'Statut',
      'Priorite',
      'Budget',
      'Progression',
      'Echeance',
    ];
    const rows = data.map((p) => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.client.replace(/"/g, '""')}"`,
      p.category,
      p.status,
      p.priority,
      p.budget,
      `${p.progress}%`,
      p.dueDate.toISOString().split('T')[0],
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    this.triggerDownload(csvContent, 'projets-export.csv', 'text/csv;charset=utf-8;');
    this.snackBar.open(`${data.length} projet(s) exporté(s) en CSV`, 'Super', { duration: 3000 });
  }

  exportFilteredJson(): void {
    const data = this.filteredItems();
    if (!data.length) {
      this.snackBar.open('Aucune donnée à exporter', 'Fermer', { duration: 2500 });
      return;
    }

    const jsonContent = JSON.stringify(data, null, 2);
    this.triggerDownload(jsonContent, 'projets-export.json', 'application/json');
    this.snackBar.open(`${data.length} projet(s) exporté(s) en JSON`, 'Super', { duration: 3000 });
  }

  private triggerDownload(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Helpers for template styling
  getStatusClass(status: ProjectItem['status']): string {
    switch (status) {
      case 'Actif':
        return 'status-active';
      case 'Terminé':
        return 'status-done';
      case 'En attente':
        return 'status-pending';
      case 'Bloqué':
        return 'status-blocked';
    }
  }

  getPriorityClass(priority: ProjectItem['priority']): string {
    switch (priority) {
      case 'Critique':
        return 'priority-critical';
      case 'Haute':
        return 'priority-high';
      case 'Moyenne':
        return 'priority-medium';
      case 'Basse':
        return 'priority-low';
    }
  }

  getCategoryIcon(category: ProjectItem['category']): string {
    switch (category) {
      case 'Web App':
        return 'language';
      case 'Mobile App':
        return 'smartphone';
      case 'Cloud / DevOps':
        return 'cloud_queue';
      case 'Design System':
        return 'palette';
      case 'Audit AI':
        return 'smart_toy';
    }
  }
}
