import {
  Component,
  afterNextRender,
  signal,
  computed,
  viewChild,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DecimalPipe, DatePipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TelemetryWorkerService, type TelemetryLog } from './telemetry-worker.service';

export type { TelemetryLog } from './telemetry-worker.service';

const INITIAL_DATASET_SIZE = 50_000;

/**
 * Row height in pixels. Single source of truth: bound to the viewport via
 * `itemSize` and reused for scroll-offset maths. Keep in sync with
 * `.log-row { height }` in the stylesheet.
 */
const ITEM_SIZE = 64;

const LEVEL_CLASS: Record<TelemetryLog['level'], string> = {
  INFO: 'level-info',
  WARN: 'level-warn',
  ERROR: 'level-error',
  DEBUG: 'level-debug',
};

@Component({
  selector: 'app-virtual-scroll-demo',
  imports: [
    NgClass,
    DecimalPipe,
    DatePipe,
    FormsModule,
    ScrollingModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatSnackBarModule,
  ],
  templateUrl: './virtual-scroll-demo.html',
  styleUrl: './virtual-scroll-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtualScrollDemoPage {
  private readonly snackBar = inject(MatSnackBar);
  private readonly worker = inject(TelemetryWorkerService);

  // Viewport signal query
  readonly viewport = viewChild(CdkVirtualScrollViewport);

  // Reactive state signals
  readonly totalItemsCount = signal<number>(INITIAL_DATASET_SIZE);
  readonly allLogs = signal<TelemetryLog[]>([]);
  readonly searchQuery = signal<string>('');
  readonly selectedLevel = signal<string>('all');
  readonly targetIndexInput = signal<number>(15_000);
  readonly currentScrollOffset = signal<number>(0);

  /** True while the Web Worker is building the dataset. */
  readonly isGenerating = this.worker.pendingCount.asReadonly();

  /** Wall-clock duration of the last generation, in milliseconds. */
  readonly lastGenerationMs = signal<number | null>(null);

  constructor() {
    // Generate the initial dataset off the main thread, once the component is
    // mounted. Building it synchronously froze the UI for ~150 ms.
    afterNextRender(() => {
      void this.regenerate(INITIAL_DATASET_SIZE, { notify: false });
    });
  }

  // Filtered dataset computed automatically
  readonly filteredLogs = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const level = this.selectedLevel();
    const logs = this.allLogs();

    if (!query && level === 'all') {
      return logs;
    }

    return logs.filter((log) => {
      const matchesLevel = level === 'all' || log.level === level;
      const matchesQuery =
        !query ||
        log.message.toLowerCase().includes(query) ||
        log.service.toLowerCase().includes(query) ||
        log.id.toString().includes(query);

      return matchesLevel && matchesQuery;
    });
  });

  // Benchmark metrics
  readonly estimatedVirtualDomNodes = signal<number>(14);

  readonly domReductionPercent = computed(() => {
    const total = this.filteredLogs().length;
    if (total === 0) return '0.00';

    const rendered = this.estimatedVirtualDomNodes();
    // With a very small filtered set the viewport can hold every row, so the
    // "reduction" would compute as a negative number. Clamp it at zero.
    const reduction = ((total - rendered) / total) * 100;
    return Math.max(0, reduction).toFixed(2);
  });

  readonly errorLogsCount = computed(
    () => this.filteredLogs().filter((l) => l.level === 'ERROR').length,
  );

  readonly avgLatency = computed(() => {
    const list = this.filteredLogs();
    if (list.length === 0) return 0;
    const sample = list.slice(0, 1000);
    return Math.round(sample.reduce((acc, l) => acc + l.latencyMs, 0) / sample.length);
  });

  // Scale Change
  setDatasetSize(size: number): void {
    void this.regenerate(size);
  }

  private async regenerate(size: number, options: { notify?: boolean } = {}): Promise<void> {
    const { notify = true } = options;
    const started = performance.now();

    try {
      const { items, durationMs } = await this.worker.generate(size);

      this.allLogs.set(items);
      this.totalItemsCount.set(size);
      this.lastGenerationMs.set(durationMs);
      this.targetIndexInput.set(Math.floor(size / 2));
      this.scrollToTop();

      if (notify) {
        this.snackBar.open(
          `${size.toLocaleString()} Logs in ${durationMs.toFixed(1)} ms im Web Worker generiert` +
            ` (Blockade: ${(performance.now() - started).toFixed(1)} ms)`,
          'OK',
          { duration: 3500 },
        );
      }
    } catch (error) {
      this.snackBar.open(
        error instanceof Error ? error.message : 'Datensatz konnte nicht erzeugt werden.',
        'Schließen',
        { duration: 4000 },
      );
    }
  }

  // Scroll Actions
  scrollToTop(): void {
    const vp = this.viewport();
    if (vp) {
      vp.scrollToIndex(0, 'smooth');
      this.currentScrollOffset.set(0);
    }
  }

  scrollToMiddle(): void {
    const vp = this.viewport();
    if (vp) {
      const mid = Math.floor(this.filteredLogs().length / 2);
      vp.scrollToIndex(mid, 'smooth');
      this.currentScrollOffset.set(mid * this.itemSize);
    }
  }

  scrollToBottom(): void {
    const vp = this.viewport();
    if (vp) {
      const last = this.filteredLogs().length - 1;
      vp.scrollToIndex(last, 'smooth');
      this.currentScrollOffset.set(last * this.itemSize);
    }
  }

  scrollToCustomIndex(): void {
    const vp = this.viewport();
    const idx = this.targetIndexInput();
    const maxIdx = this.filteredLogs().length - 1;

    if (vp && idx >= 0 && idx <= maxIdx) {
      vp.scrollToIndex(idx, 'smooth');
      this.snackBar.open(`Sofortige Navigation zu Index #${idx.toLocaleString()}`, 'OK', {
        duration: 2000,
      });
    } else {
      this.snackBar.open(
        `Bitte geben Sie einen Index zwischen 0 und ${maxIdx.toLocaleString()} ein`,
        'Schließen',
        {
          duration: 3000,
        },
      );
    }
  }

  onViewportScroll(): void {
    const vp = this.viewport();
    if (vp) {
      this.currentScrollOffset.set(Math.round(vp.measureScrollOffset()));
    }
  }

  /**
   * Row height in pixels, also bound to the viewport's `itemSize` input so the
   * simulated scroll offsets can never drift from the real layout.
   */
  readonly itemSize = ITEM_SIZE;

  getLevelClass(level: TelemetryLog['level']): string {
    return LEVEL_CLASS[level];
  }

  trackById = (_index: number, log: TelemetryLog): number => log.id;
}
