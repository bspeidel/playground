import {
  Component,
  signal,
  computed,
  inject,
  viewChild,
  TemplateRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { UpperCasePipe } from '@angular/common';
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
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MAT_DATE_LOCALE, provideNativeDateAdapter, DateAdapter } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AppDatePipe, TranslateHtmlPipe, TranslatePipe, TranslateService } from '../../i18n';
import type { TranslationKey } from '../../i18n/translations';

export interface TaskItem {
  /** Sub-task names are display-only, so the template holds keys. */
  nameKey: TranslationKey;
  completed: boolean;
}

@Component({
  selector: 'app-material-demo',
  imports: [
    AppDatePipe,
    UpperCasePipe,
    TranslatePipe,
    TranslateHtmlPipe,
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
    MatTimepickerModule,
    MatAutocompleteModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    // Derived from the app locale rather than hardcoded: a fixed 'de-DE' here
    // made `activeLocale` advertise one locale while the adapter actually
    // formatted in another. `setLocale()` still overrides it, which is the
    // point of the DateAdapter demo.
    {
      provide: MAT_DATE_LOCALE,
      useFactory: (translate: TranslateService) => translate.localeTag(),
      deps: [TranslateService],
    },
  ],
  templateUrl: './material-demo.html',
  styleUrl: './material-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialDemoPage {
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly translate = inject(TranslateService);
  readonly dateAdapter = inject<DateAdapter<Date>>(DateAdapter);

  // Queries
  readonly demoDialog = viewChild<TemplateRef<unknown>>('demoDialog');

  /**
   * Datepicker locale for the `DateAdapter.setLocale()` demo.
   *
   * Seeded from the app locale instead of a hardcoded `de-DE`: locale data is
   * registered once in `app.config.ts`, so `translate.localeTag()` is a valid
   * tag. The user can still flip it from the toolbar to demo the adapter.
   */
  readonly activeLocale = signal<string>(this.translate.localeTag());

  // Reactive state signals
  readonly sliderValue = signal(65);
  readonly toggleActive = signal(true);
  readonly selectedThemeColor = signal('azure');
  readonly badgeCount = signal(5);
  readonly viewMode = signal<'grid' | 'list' | 'table'>('grid');
  readonly selectedSpeed = signal<'eco' | 'normal' | 'turbo'>('turbo');
  readonly spinnerMode = signal<'determinate' | 'indeterminate'>('determinate');
  readonly selectedDate = signal<Date | null>(new Date());
  readonly selectedTime = signal<Date | null>(new Date());
  readonly selectedRangeStart = signal<Date | null>(new Date());
  readonly selectedRangeEnd = signal<Date | null>(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000));
  readonly timeInterval = signal<'15m' | '30m' | '1h'>('15m');
  /**
   * Free-text demo value the user could edit, so it is seeded from the active
   * locale once rather than re-translated on every language switch.
   */
  readonly eventTitle = signal(this.translate.text('material.datetime.defaultTitle'));
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
    { nameKey: 'material.task.standalone', completed: true },
    { nameKey: 'material.task.palettes', completed: true },
    { nameKey: 'material.task.jest', completed: false },
    { nameKey: 'material.task.docs', completed: false },
  ]);

  /**
   * `DatePipe` format for the long event date. Angular's own format strings
   * (`d. MMMM`) are German-specific, so the `de-DE` branch keeps the original
   * wording and the other locales get a neutral pattern.
   */
  readonly longDateFormat = computed(() =>
    this.activeLocale() === 'de-DE' ? 'EEEE, d. MMMM y' : 'EEEE, d MMMM y',
  );

  /** Short numeric pattern for the sprint range chips. */
  readonly rangeDateFormat = computed(() =>
    this.activeLocale() === 'de-DE' ? 'dd.MM.yyyy' : 'dd/MM/yyyy',
  );

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

  /**
   * SnackBar helper. `messageKey` and `actionKey` are resolved in the active
   * locale, so callers (including the template) pass keys, never literal text.
   */
  showSnackBar(
    messageKey: TranslationKey,
    actionKey: TranslationKey = 'material.action.ok',
    params?: Record<string, unknown>,
  ): void {
    this.snackBar.open(this.translate.text(messageKey, params), this.translate.text(actionKey), {
      duration: 3500,
    });
  }

  setTimePreset(hours: number, minutes: number): void {
    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    this.selectedTime.set(d);
    const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    this.showSnackBar('material.snack.timeSet', 'material.action.ok', { time });
  }

  setDatePreset(daysOffset: number): void {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    this.selectedDate.set(d);
    if (daysOffset === 0) {
      this.showSnackBar('material.snack.dateToday');
    } else {
      this.showSnackBar('material.snack.dateOffset', 'material.action.ok', { days: daysOffset });
    }
  }

  setLocale(locale: string): void {
    this.activeLocale.set(locale);
    this.dateAdapter.setLocale(locale);
    this.showSnackBar(
      locale === 'de-DE' ? 'material.snack.localeDe' : 'material.snack.localeOther',
      'material.action.ok',
      { locale },
    );
  }

  copyScheduleSummary(): void {
    const loc = this.activeLocale();
    const dateStr = this.selectedDate()?.toLocaleDateString(loc, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const timeStr = this.selectedTime()?.toLocaleTimeString(loc, {
      hour: '2-digit',
      minute: '2-digit',
    });
    const summary = this.translate.text('material.copy.summary', {
      title: this.eventTitle(),
      date: dateStr,
      time: timeStr,
    });
    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      this.showSnackBar('material.snack.copied');
    }
  }
}
