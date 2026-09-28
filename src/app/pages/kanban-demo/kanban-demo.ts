import { Component, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';
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
import { AppDatePipe, TranslateHtmlPipe, TranslatePipe, TranslateService } from '../../i18n';
import type { TranslationKey } from '../../i18n/translations';
import { KanbanDialog, KanbanTask } from './kanban-dialog';

export interface KanbanColumn {
  id: string;
  titleKey: TranslationKey;
  icon: string;
  color: string;
  tasks: KanbanTask[];
}

/**
 * Display-layer translation keys for the raw priority values. The stored
 * values stay untouched because they double as filter keys, so the map is
 * exhaustive and TypeScript rejects a new variant without a translation.
 */
const PRIORITY_LABEL_KEY: Record<KanbanTask['priority'], TranslationKey> = {
  Basse: 'kanban.priority.low',
  Moyenne: 'kanban.priority.medium',
  Haute: 'kanban.priority.high',
  Critique: 'kanban.priority.critical',
};

const INITIAL_COLUMNS: KanbanColumn[] = [
  {
    id: 'backlog',
    titleKey: 'kanban.column.backlog',
    icon: 'lightbulb',
    color: '#64748b',
    tasks: [
      {
        id: 'TSK-101',
        title: 'WebGPU-Shader in Canvas evaluieren',
        description: 'Browser-Kompatibilität und 3D-Rendering-Gewinn prüfen.',
        priority: 'Basse',
        assignee: { name: 'Benjamin S.', initials: 'BS', color: '#2563eb' },
        tags: ['F&E', 'Grafik'],
        createdAt: new Date('2026-09-20'),
      },
      {
        id: 'TSK-102',
        title: 'Core Web Vitals (INP) Audit',
        description: 'Reaktivität auf Benutzerinteraktionen auf Mobilgeräten prüfen.',
        priority: 'Moyenne',
        assignee: { name: 'Sophie Martin', initials: 'SM', color: '#7c3aed' },
        tags: ['Audit', 'Perf'],
        createdAt: new Date('2026-09-21'),
      },
    ],
  },
  {
    id: 'todo',
    titleKey: 'kanban.column.todo',
    icon: 'assignment',
    color: '#2563eb',
    tasks: [
      {
        id: 'TSK-103',
        title: 'Migration der Formulare zu Typed Forms',
        description: 'Alte UntypedFormGroup durch die strikte typisierte Version ersetzen.',
        priority: 'Haute',
        assignee: { name: 'Alexandre Roy', initials: 'AR', color: '#059669' },
        tags: ['Refacto', 'Formulare'],
        createdAt: new Date('2026-09-22'),
      },
      {
        id: 'TSK-104',
        title: 'Playwright Regressionstests',
        description: 'Automatisierte End-to-End-Tests für die CI/CD-Pipeline hinzufügen.',
        priority: 'Moyenne',
        assignee: { name: 'Camille Leroy', initials: 'CL', color: '#ea580c' },
        tags: ['QA', 'Testing'],
        createdAt: new Date('2026-09-23'),
      },
    ],
  },
  {
    id: 'in_progress',
    titleKey: 'kanban.column.inProgress',
    icon: 'pending',
    color: '#ea580c',
    tasks: [
      {
        id: 'TSK-105',
        title: 'Flüssige CDK Drag & Drop Integration',
        description: 'cdkDropListConnectedTo mit Material-3-Animationen implementieren.',
        priority: 'Critique',
        assignee: { name: 'Benjamin S.', initials: 'BS', color: '#2563eb' },
        tags: ['CDK', 'UI/UX'],
        createdAt: new Date('2026-09-24'),
      },
      {
        id: 'TSK-106',
        title: 'Optimierung des Vite / esbuild Bundles',
        description: 'Style-Chunks analysieren und Assets komprimieren.',
        priority: 'Haute',
        assignee: { name: 'Alexandre Roy', initials: 'AR', color: '#059669' },
        tags: ['Build', 'Optimierung'],
        createdAt: new Date('2026-09-25'),
      },
    ],
  },
  {
    id: 'done',
    titleKey: 'kanban.column.done',
    icon: 'task_alt',
    color: '#059669',
    tasks: [
      {
        id: 'TSK-107',
        title: 'Zoneless-Architektur Angular 22',
        description: 'Aktivierung von provideZonelessChangeDetection und Entfernung von Zone.js.',
        priority: 'Critique',
        assignee: { name: 'Benjamin S.', initials: 'BS', color: '#2563eb' },
        tags: ['Core', 'Zoneless'],
        createdAt: new Date('2026-09-18'),
      },
      {
        id: 'TSK-108',
        title: 'Material 3 Dark- / Light-Theme',
        description: 'Verwaltung von CSS-Variablen und Speicherung im localStorage.',
        priority: 'Haute',
        assignee: { name: 'Sophie Martin', initials: 'SM', color: '#7c3aed' },
        tags: ['M3', 'Theme'],
        createdAt: new Date('2026-09-19'),
      },
      {
        id: 'TSK-109',
        title: 'GitHub Actions CI/CD Bereitstellung',
        description: 'Automatisierung von Jest-Tests und GitHub Pages Veröffentlichung.',
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
    NgClass,
    AppDatePipe,
    TranslatePipe,
    TranslateHtmlPipe,
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
  private readonly translate = inject(TranslateService);
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
    this.snackBar.open(
      this.translate.text('kanban.snack.moved'),
      this.translate.text('kanban.action.ok'),
      { duration: 2000 },
    );
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
        this.snackBar.open(
          this.translate.text('kanban.snack.taskCreated', { title: result.title }),
          this.translate.text('kanban.action.close'),
          { duration: 3000 },
        );
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
        this.snackBar.open(
          this.translate.text('kanban.snack.taskUpdated', { title: result.title }),
          this.translate.text('kanban.action.close'),
          {
            duration: 3000,
          },
        );
      }
    });
  }

  deleteTask(taskId: string, columnId: string): void {
    this.columns.update((cols) =>
      cols.map((col) =>
        col.id === columnId ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) } : col,
      ),
    );
    this.snackBar.open(
      this.translate.text('kanban.snack.taskDeleted'),
      this.translate.text('kanban.action.close'),
      { duration: 2500 },
    );
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

    const target = this.columns().find((c) => c.id === targetColId);
    const targetTitle = target ? this.translate.text(target.titleKey) : targetColId;
    this.snackBar.open(
      this.translate.text('kanban.snack.taskMovedTo', { column: targetTitle }),
      this.translate.text('kanban.action.close'),
      { duration: 2500 },
    );
  }

  resetBoard(): void {
    this.columns.set(
      INITIAL_COLUMNS.map((col: KanbanColumn) => ({
        ...col,
        tasks: col.tasks.map((t) => ({ ...t, createdAt: new Date(t.createdAt) })),
      })),
    );
    this.searchQuery.set('');
    this.priorityFilter.set('all');
    this.snackBar.open(
      this.translate.text('kanban.snack.boardReset'),
      this.translate.text('kanban.action.ok'),
      { duration: 2500 },
    );
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

  /** Display-layer translation of the raw priority value (see PRIORITY_LABEL_KEY). */
  getPriorityLabel(priority: KanbanTask['priority']): string {
    return this.translate.text(PRIORITY_LABEL_KEY[priority]);
  }

  /** Display-layer translation of a column title. */
  columnTitle(column: KanbanColumn): string {
    return this.translate.text(column.titleKey);
  }
}
