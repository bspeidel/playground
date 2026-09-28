import { Injectable, OnDestroy, signal } from '@angular/core';
import type { TelemetryLog as WorkerLog } from './telemetry.worker';

export interface TelemetryLog extends Omit<WorkerLog, 'timestamp'> {
  /** Worker transports epoch milliseconds; hydrated back into a `Date` here. */
  timestamp: Date;
}

export interface DatasetResult {
  items: TelemetryLog[];
  durationMs: number;
}

/**
 * Owns the telemetry worker and exposes dataset generation as a cancellable
 * promise. Generating the dataset on the main thread would block the UI for
 * hundreds of milliseconds, defeating the purpose of the virtual scroll demo.
 */
@Injectable({ providedIn: 'root' })
export class TelemetryWorkerService implements OnDestroy {
  private worker: Worker | null = null;
  private seed = 1;

  /**
   * `null` when there is no active generation, otherwise a description of the
   * generation currently running. Used to show a progress state.
   */
  readonly pendingCount = signal<number | null>(null);

  generate(count: number): Promise<DatasetResult> {
    this.worker?.terminate();
    this.pendingCount.set(count);

    // Incrementing the seed keeps successive datasets different.
    this.seed = (this.seed * 1664525 + 1013904223) >>> 0;

    return new Promise<DatasetResult>((resolve, reject) => {
      const worker = new Worker(new URL('./telemetry.worker', import.meta.url), {
        type: 'module',
      });
      this.worker = worker;

      const cleanup = (): void => {
        worker.terminate();
        if (this.worker === worker) {
          this.worker = null;
        }
        this.pendingCount.set(null);
      };

      worker.onmessage = ({ data }: MessageEvent<{ items: WorkerLog[]; durationMs: number }>) => {
        cleanup();
        resolve({
          durationMs: data.durationMs,
          items: data.items.map((log) => ({ ...log, timestamp: new Date(log.timestamp) })),
        });
      };

      worker.onerror = (event: ErrorEvent) => {
        cleanup();
        reject(new Error(event.message || 'Der Telemetrie-Worker konnte nicht gestartet werden.'));
      };

      worker.postMessage({ count, seed: this.seed });
    });
  }

  ngOnDestroy(): void {
    this.worker?.terminate();
    this.worker = null;
  }
}
