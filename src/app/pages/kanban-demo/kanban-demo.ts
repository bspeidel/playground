import { Component, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { KanbanDialog, KanbanTask } from './kanban-dialog';

export interface KanbanColumn {
  id: string;
  title: string;
  icon: string;
  color: string;
  tasks: KanbanTask[];
}

const INITIAL_COLUMNS: KanbanColumn[] = [
  {
    id: 'backlog',
    title: 'Backlog Idées',
    icon: 'lightbulb',
    color: '#64748b',
    tasks: [
      {
        id: 'TSK-101',
        title: 'Étudier les WebGPU Shaders en Canvas',
        description: 'Évaluer la compatibilité des navigateurs et le gain de rendu 3D.',
        priority: 'Basse',
        assignee: { name: 'Benjamin S.', initials: 'BS', color: '#2563eb' },
        tags: ['R&D', 'Graphisme'],
        createdAt: new Date('2026-09-20'),
      },
      {
        id: 'TSK-102',
        title: 'Audit des Core Web Vitals (INP)',
        description: 'Vérifier la réactivité aux interactions utilisateur sur mobile.',
        priority: 'Moyenne',
        assignee: { name: 'Sophie Martin', initials: 'SM', color: '#7c3aed' },
        tags: ['Audit', 'Perf'],
        createdAt: new Date('2026-09-21'),
      },
    ],
  },
  {
    id: 'todo',
    title: 'À Faire',
    icon: 'assignment',
    color: '#2563eb',
    tasks: [
      {
        id: 'TSK-103',
        title: 'Migration des formulaires vers Typed Forms',
        description: 'Remplacer les anciens UntypedFormGroup par la version typée stricte.',
        priority: 'Haute',
        assignee: { name: 'Alexandre Roy', initials: 'AR', color: '#059669' },
        tags: ['Refacto', 'Forms'],
        createdAt: new Date('2026-09-22'),
      },
      {
        id: 'TSK-104',
        title: 'Tests de non-régression Playwright',
        description: 'Ajouter des tests bout-en-bout automatisés pour le pipeline CI/CD.',
        priority: 'Moyenne',
        assignee: { name: 'Camille Leroy', initials: 'CL', color: '#ea580c' },
        tags: ['QA', 'Testing'],
        createdAt: new Date('2026-09-23'),
      },
    ],
  },
  {
    id: 'in_progress',
    title: 'En Cours',
    icon: 'pending',
    color: '#ea580c',
    tasks: [
      {
        id: 'TSK-105',
        title: 'Intégration Drag & Drop CDK fluide',
        description: 'Mettre en place cdkDropListConnectedTo avec animations Material 3.',
        priority: 'Critique',
        assignee: { name: 'Benjamin S.', initials: 'BS', color: '#2563eb' },
        tags: ['CDK', 'UI/UX'],
        createdAt: new Date('2026-09-24'),
      },
      {
        id: 'TSK-106',
        title: 'Optimisation du bundle Vite / esbuild',
        description: 'Analyser les chunks de styles et compresser les ressources.',
        priority: 'Haute',
        assignee: { name: 'Alexandre Roy', initials: 'AR', color: '#059669' },
        tags: ['Build', 'Optimisation'],
        createdAt: new Date('2026-09-25'),
      },
    ],
  },
  {
    id: 'done',
    title: 'Terminé',
    icon: 'task_alt',
    color: '#059669',
    tasks: [
      {
        id: 'TSK-107',
        title: 'Architecture Zoneless Angular 22',
        description: 'Activation de provideZonelessChangeDetection et suppression de Zone.js.',
        priority: 'Critique',
        assignee: { name: 'Benjamin S.', initials: 'BS', color: '#2563eb' },
        tags: ['Core', 'Zoneless'],
        createdAt: new Date('2026-09-18'),
      },
      {
        id: 'TSK-108',
        title: 'Dark / Light mode thématique Material 3',
        description: 'Gestion des variables CSS et persistance dans le localStorage.',
        priority: 'Haute',
        assignee: { name: 'Sophie Martin', initials: 'SM', color: '#7c3aed' },
        tags: ['M3', 'Theme'],
        createdAt: new Date('2026-09-19'),
      },
      {
        id: 'TSK-109',
        title: 'Déploiement GitHub Actions CI/CD',
        description: 'Automatisation des tests Jest et publication GitHub Pages.',
        priority: 'Haute',
        assignee: { name: 'Camille Leroy', initials: 'CL', color: '#ea580c' },
        tags: ['DevOps', 'CI/CD'],
        createdAt: new Date('2026-09-20'),
      },
    ],
  },
];

@Component({
  selector: 'app-kanban-demo',
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    DragDropModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatBadgeModule,
    MatDividerModule,
  ],
  templateUrl: './kanban-demo.html',
  styleUrl: './kanban-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanDemoPage {
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  // Board state signals
  readonly columns = signal<KanbanColumn[]>(INITIAL_COLUMNS);
  readonly searchQuery = signal<string>('');
  readonly priorityFilter = signal<string>('all');

  // Computed KPIs
  readonly totalTasksCount = computed(() =>
    this.columns().reduce((acc, col) => acc + col.tasks.length, 0),
  );

  readonly inProgressCount = computed(
    () => this.columns().find((c) => c.id === 'in_progress')?.tasks.length ?? 0,
  );

  readonly completedTasksCount = computed(
    () => this.columns().find((c) => c.id === 'done')?.tasks.length ?? 0,
  );

  readonly completionRate = computed(() => {
    const total = this.totalTasksCount();
    if (total === 0) return 0;
    return Math.round((this.completedTasksCount() / total) * 100);
  });

  readonly allColumnIds = computed(() => this.columns().map((c) => c.id));

  // Drag and Drop Handler
  drop(event: CdkDragDrop<KanbanTask[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    // Trigger immutable signal update so zoneless change detection propagates seamlessly
    this.columns.update((cols) => cols.map((col) => ({ ...col, tasks: [...col.tasks] })));
    this.snackBar.open('Tâche déplacée avec succès !', 'OK', { duration: 2000 });
  }

  // Filter check helper
  isTaskDimmed(task: KanbanTask): boolean {
    const query = this.searchQuery().trim().toLowerCase();
    const priority = this.priorityFilter();

    const matchesQuery =
      !query ||
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query) ||
      task.tags.some((t) => t.toLowerCase().includes(query)) ||
      task.id.toLowerCase().includes(query);

    const matchesPriority = priority === 'all' || task.priority === priority;

    return !(matchesQuery && matchesPriority);
  }

  // Task Dialog Actions
  openCreateTaskDialog(columnId = 'todo'): void {
    const dialogRef = this.dialog.open(KanbanDialog, {
      width: '460px',
      data: { columnId },
    });

    dialogRef.afterClosed().subscribe((result: KanbanTask | undefined) => {
      if (result) {
        this.columns.update((cols) =>
          cols.map((col) =>
            col.id === columnId ? { ...col, tasks: [result, ...col.tasks] } : col,
          ),
        );
        this.snackBar.open(`Tâche "${result.title}" créée`, 'Fermer', { duration: 3000 });
      }
    });
  }

  openEditTaskDialog(task: KanbanTask, columnId: string): void {
    const dialogRef = this.dialog.open(KanbanDialog, {
      width: '460px',
      data: { task, columnId },
    });

    dialogRef.afterClosed().subscribe((result: KanbanTask | undefined) => {
      if (result) {
        this.columns.update((cols) =>
          cols.map((col) =>
            col.id === columnId
              ? { ...col, tasks: col.tasks.map((t) => (t.id === result.id ? result : t)) }
              : col,
          ),
        );
        this.snackBar.open(`Tâche "${result.title}" mise à jour`, 'Fermer', { duration: 3000 });
      }
    });
  }

  deleteTask(taskId: string, columnId: string): void {
    this.columns.update((cols) =>
      cols.map((col) =>
        col.id === columnId ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) } : col,
      ),
    );
    this.snackBar.open('Tâche supprimée', 'Fermer', { duration: 2500 });
  }

  moveTaskToColumn(task: KanbanTask, sourceColId: string, targetColId: string): void {
    if (sourceColId === targetColId) return;

    this.columns.update((cols) => {
      let movedTask: KanbanTask | undefined;
      const updatedCols = cols.map((col) => {
        if (col.id === sourceColId) {
          movedTask = col.tasks.find((t) => t.id === task.id);
          return { ...col, tasks: col.tasks.filter((t) => t.id !== task.id) };
        }
        return col;
      });

      if (movedTask) {
        return updatedCols.map((col) =>
          col.id === targetColId ? { ...col, tasks: [...col.tasks, movedTask!] } : col,
        );
      }
      return updatedCols;
    });

    const targetTitle = this.columns().find((c) => c.id === targetColId)?.title ?? targetColId;
    this.snackBar.open(`Tâche déplacée vers "${targetTitle}"`, 'Fermer', { duration: 2500 });
  }

  resetBoard(): void {
    this.columns.set(
      JSON.parse(JSON.stringify(INITIAL_COLUMNS)).map((col: KanbanColumn) => ({
        ...col,
        tasks: col.tasks.map((t) => ({ ...t, createdAt: new Date(t.createdAt) })),
      })),
    );
    this.searchQuery.set('');
    this.priorityFilter.set('all');
    this.snackBar.open('Tableau réinitialisé à son état initial', 'OK', { duration: 2500 });
  }

  getPriorityClass(priority: KanbanTask['priority']): string {
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
}
