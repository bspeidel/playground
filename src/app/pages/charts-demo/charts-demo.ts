import { Component, signal, computed, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
  icon: string;
}

export interface SprintVelocity {
  sprint: string;
  planned: number;
  completed: number;
}

export interface SparklineMetric {
  id: string;
  title: string;
  unit: string;
  values: number[];
  color: string;
}

@Component({
  selector: 'app-charts-demo',
  imports: [
    CommonModule,
    CurrencyPipe,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatTooltipModule,
    MatSnackBarModule,
  ],
  templateUrl: './charts-demo.html',
  styleUrl: './charts-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartsDemoPage {
  private readonly snackBar = inject(MatSnackBar);

  // Donut chart state
  readonly donutData = signal<DonutSegment[]>([
    { label: 'Cloud & Infrastruktur', value: 42000, color: '#2563eb', icon: 'cloud' },
    { label: 'Web- & Mobile-Entwicklung', value: 58000, color: '#7c3aed', icon: 'devices' },
    { label: 'KI-Modelle & LLM', value: 36000, color: '#059669', icon: 'smart_toy' },
    { label: 'Sicherheit & Compliance', value: 24000, color: '#ea580c', icon: 'security' },
    { label: 'Design-System & UX', value: 18000, color: '#0284c7', icon: 'palette' },
  ]);

  readonly activeDonutIndex = signal<number | null>(null);

  // Velocity bar chart state
  readonly velocityData = signal<SprintVelocity[]>([
    { sprint: 'Sprint 21', planned: 45, completed: 42 },
    { sprint: 'Sprint 22', planned: 50, completed: 48 },
    { sprint: 'Sprint 23', planned: 52, completed: 54 },
    { sprint: 'Sprint 24', planned: 48, completed: 46 },
    { sprint: 'Sprint 25', planned: 55, completed: 58 },
    { sprint: 'Sprint 26', planned: 60, completed: 56 },
    { sprint: 'Sprint 27', planned: 58, completed: 62 },
    { sprint: 'Sprint 28', planned: 65, completed: 64 },
  ]);

  readonly activeSprintIndex = signal<number | null>(null);

  // Sparkline state
  readonly selectedMetricId = signal<string>('traffic');

  readonly metricsList = signal<SparklineMetric[]>([
    {
      id: 'traffic',
      title: 'Benutzerdatenverkehr (Req/Sek)',
      unit: 'Req/s',
      values: [240, 290, 310, 450, 420, 560, 680, 640, 720, 850, 910, 890],
      color: '#2563eb',
    },
    {
      id: 'latency',
      title: 'API-Antwortzeit (ms)',
      unit: 'ms',
      values: [48, 52, 45, 59, 62, 54, 49, 43, 41, 38, 36, 35],
      color: '#059669',
    },
    {
      id: 'errors',
      title: '5xx-Fehlerrate (‰)',
      unit: '‰',
      values: [8, 12, 15, 9, 6, 14, 8, 4, 3, 2, 1, 2],
      color: '#ea580c',
    },
  ]);

  // Donut chart computed calculations
  readonly donutTotal = computed(() => this.donutData().reduce((acc, seg) => acc + seg.value, 0));

  readonly donutSegmentsWithAngles = computed(() => {
    const total = this.donutTotal();
    const radius = 80;
    const circumference = 2 * Math.PI * radius; // ~502.65
    let currentOffset = 0;

    return this.donutData().map((seg, idx) => {
      const percentage = total > 0 ? (seg.value / total) * 100 : 0;
      const strokeDasharray = (percentage / 100) * circumference;
      const strokeDashoffset = -currentOffset;
      currentOffset += strokeDasharray;

      return {
        ...seg,
        index: idx,
        percentage: Number(percentage.toFixed(1)),
        strokeDasharray: `${strokeDasharray} ${circumference}`,
        strokeDashoffset,
      };
    });
  });

  readonly activeDonutSegment = computed(() => {
    const idx = this.activeDonutIndex();
    if (idx === null) return null;
    return this.donutSegmentsWithAngles()[idx] ?? null;
  });

  // Velocity bar chart computed calculations
  readonly maxSprintValue = computed(() => {
    return Math.max(...this.velocityData().flatMap((v) => [v.planned, v.completed]), 70);
  });

  readonly avgCompletedStoryPoints = computed(() => {
    const list = this.velocityData();
    if (list.length === 0) return 0;
    return Math.round(list.reduce((acc, v) => acc + v.completed, 0) / list.length);
  });

  // Sparkline computed calculations
  readonly currentMetric = computed(() => {
    const id = this.selectedMetricId();
    return this.metricsList().find((m) => m.id === id) ?? this.metricsList()[0];
  });

  readonly sparklinePoints = computed(() => {
    const vals = this.currentMetric().values;
    if (vals.length === 0) return { path: '', points: [] };

    const min = Math.min(...vals) * 0.9;
    const max = Math.max(...vals) * 1.05;
    const range = max - min || 1;
    const width = 600;
    const height = 180;
    const padding = 20;

    const coords = vals.map((val, idx) => {
      const x = padding + (idx / (vals.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((val - min) / range) * (height - 2 * padding);
      return { x: Number(x.toFixed(1)), y: Number(y.toFixed(1)), value: val };
    });

    // Generate smooth SVG path
    let path = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) {
      const prev = coords[i - 1];
      const curr = coords[i];
      const cpX = (prev.x + curr.x) / 2;
      path += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    // Area closed path for gradient fill
    const areaPath = `${path} L ${coords[coords.length - 1].x} ${height - padding} L ${coords[0].x} ${height - padding} Z`;

    return { path, areaPath, points: coords };
  });

  readonly currentMetricLatest = computed(() => {
    const vals = this.currentMetric().values;
    return vals[vals.length - 1] ?? 0;
  });

  readonly currentMetricMin = computed(() => Math.min(...this.currentMetric().values));
  readonly currentMetricMax = computed(() => Math.max(...this.currentMetric().values));

  // Interactive controls
  setDonutHover(index: number | null): void {
    this.activeDonutIndex.set(index);
  }

  setSprintHover(index: number | null): void {
    this.activeSprintIndex.set(index);
  }

  randomizeData(): void {
    // Generate new values for current metric
    this.metricsList.update((metrics) =>
      metrics.map((m) => {
        const factor = m.id === 'traffic' ? 80 : m.id === 'latency' ? 5 : 2;
        const newVals = m.values.map((v) =>
          Math.max(1, Math.round(v + (Math.random() - 0.45) * factor)),
        );
        return { ...m, values: newVals };
      }),
    );

    // Randomize velocity
    this.velocityData.update((list) =>
      list.map((v) => ({
        ...v,
        planned: Math.floor(40 + Math.random() * 30),
        completed: Math.floor(38 + Math.random() * 32),
      })),
    );

    this.snackBar.open('Datenreihen erfolgreich neu generiert!', 'OK', { duration: 2500 });
  }
}
