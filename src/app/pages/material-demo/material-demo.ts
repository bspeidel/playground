import {
  Component,
  signal,
  computed,
  inject,
  viewChild,
  TemplateRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

export interface TaskItem {
  name: string;
  completed: boolean;
}

@Component({
  selector: 'app-material-demo',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatDividerModule,
    MatTabsModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatAutocompleteModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './material-demo.html',
  styleUrl: './material-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialDemoPage {
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  // Queries
  readonly demoDialog = viewChild<TemplateRef<unknown>>('demoDialog');

  // Reactive state signals
  readonly sliderValue = signal(65);
  readonly toggleActive = signal(true);
  readonly selectedThemeColor = signal('azure');
  readonly badgeCount = signal(5);
  readonly viewMode = signal<'grid' | 'list' | 'table'>('grid');
  readonly selectedSpeed = signal<'eco' | 'normal' | 'turbo'>('turbo');
  readonly spinnerMode = signal<'determinate' | 'indeterminate'>('determinate');
  readonly selectedDate = signal<Date | null>(new Date());
  readonly frameworkSearch = signal('');

  // Autocomplete data
  readonly allFrameworks = [
    'Angular 22',
    'React 19',
    'Vue.js 3',
    'Svelte 5',
    'SolidJS',
    'Qwik',
    'Astro',
    'Next.js',
    'Nuxt 3',
  ];

  readonly filteredFrameworks = computed(() => {
    const term = this.frameworkSearch().toLowerCase().trim();
    if (!term) return this.allFrameworks;
    return this.allFrameworks.filter((f) => f.toLowerCase().includes(term));
  });

  // Checkbox parent / children state
  readonly subTasks = signal<TaskItem[]>([
    { name: 'Architecture Standalone & Zoneless', completed: true },
    { name: 'Palette Material 3 Azure & Blue', completed: true },
    { name: 'Validation Tests Jest & E2E', completed: false },
    { name: 'Documentation Interactive & Guide', completed: false },
  ]);

  readonly allComplete = computed(() => this.subTasks().every((t) => t.completed));
  readonly someComplete = computed(
    () => this.subTasks().some((t) => t.completed) && !this.allComplete(),
  );

  incrementBadge(): void {
    this.badgeCount.update((c) => c + 1);
  }

  setAllTasks(completed: boolean): void {
    this.subTasks.update((tasks) => tasks.map((t) => ({ ...t, completed })));
  }

  updateTask(index: number, completed: boolean): void {
    this.subTasks.update((tasks) => tasks.map((t, i) => (i === index ? { ...t, completed } : t)));
  }

  toggleSpinnerMode(): void {
    this.spinnerMode.update((mode) => (mode === 'determinate' ? 'indeterminate' : 'determinate'));
  }

  openDemoDialog(): void {
    const template = this.demoDialog();
    if (template) {
      this.dialog.open(template, {
        width: '450px',
      });
    }
  }

  showSnackBar(message: string, action = 'OK'): void {
    this.snackBar.open(message, action, {
      duration: 3500,
    });
  }
}
