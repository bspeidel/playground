import {
  Component,
  signal,
  computed,
  viewChild,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
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

export interface TelemetryLog {
  id: number;
  timestamp: Date;
  service: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  latencyMs: number;
  statusCode: number;
}

const SERVICES = [
  'auth-service',
  'payment-gateway',
  'inventory-api',
  'edge-worker',
  'ai-inference',
];
const LEVELS: TelemetryLog['level'][] = ['INFO', 'INFO', 'INFO', 'WARN', 'ERROR', 'DEBUG'];
const MESSAGES = [
  'HTTP-Anfrage erfolgreich verarbeitet',
  'Cache-Treffer auf Redis-Cluster',
  'Antwortzeit überschreitet SLA (p99)',
  'JWT-Token automatisch erneuert',
  'Verbindungsfehler zum sekundären Datenbankknoten',
  'Dauerhafte WebSocket-Synchronisation aktiv',
  'Speicherbereinigung des Objektpools abgeschlossen',
  'Ausführung des asynchronen Workers abgeschlossen',
];

function generateDataset(count: number): TelemetryLog[] {
  const baseTime = Date.now() - count * 1500;
  const items: TelemetryLog[] = new Array(count);

  for (let i = 0; i < count; i++) {
    const level = LEVELS[Math.floor(Math.random() * LEVELS.length)];
    const service = SERVICES[Math.floor(Math.random() * SERVICES.length)];
    const message = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    const latency =
      level === 'ERROR'
        ? Math.floor(800 + Math.random() * 1200)
        : Math.floor(10 + Math.random() * 120);
    const statusCode = level === 'ERROR' ? 500 : level === 'WARN' ? 429 : 200;

    items[i] = {
      id: i + 1,
      timestamp: new Date(baseTime + i * 1500),
      service,
      level,
      message,
      latencyMs: latency,
      statusCode,
    };
  }

  return items;
}

@Component({
  selector: 'app-virtual-scroll-demo',
  imports: [
    CommonModule,
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

  // Viewport signal query
  readonly viewport = viewChild(CdkVirtualScrollViewport);

  // Reactive state signals
  readonly totalItemsCount = signal<number>(50000);
  readonly allLogs = signal<TelemetryLog[]>(generateDataset(50000));
  readonly searchQuery = signal<string>('');
  readonly selectedLevel = signal<string>('all');
  readonly targetIndexInput = signal<number>(15000);
  readonly currentScrollOffset = signal<number>(0);

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
    if (total === 0) return 0;
    const rendered = this.estimatedVirtualDomNodes();
    return ((1 - rendered / total) * 100).toFixed(2);
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
    this.totalItemsCount.set(size);
    const start = performance.now();
    const newItems = generateDataset(size);
    this.allLogs.set(newItems);
    const duration = (performance.now() - start).toFixed(1);

    this.targetIndexInput.set(Math.floor(size / 2));
    this.scrollToTop();
    this.snackBar.open(`${size.toLocaleString()} Logs in ${duration} ms generiert!`, 'OK', {
      duration: 3000,
    });
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
      this.currentScrollOffset.set(mid * 64);
    }
  }

  scrollToBottom(): void {
    const vp = this.viewport();
    if (vp) {
      const last = this.filteredLogs().length - 1;
      vp.scrollToIndex(last, 'smooth');
      this.currentScrollOffset.set(last * 64);
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

  getLevelClass(level: TelemetryLog['level']): string {
    switch (level) {
      case 'ERROR':
        return 'level-error';
      case 'WARN':
        return 'level-warn';
      case 'INFO':
        return 'level-info';
      case 'DEBUG':
        return 'level-debug';
    }
  }
}
