/// <reference lib="webworker" />

/**
 * Telemetry dataset generator, executed off the main thread.
 *
 * Building 50k–100k objects synchronously blocks the UI for hundreds of
 * milliseconds, which is precisely what the virtual scroll demo claims to
 * avoid. Running it here keeps the main thread responsive and lets the page
 * show real generation timings.
 */

export interface TelemetryLog {
  id: number;
  timestamp: number;
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

const INTERVAL_MS = 1500;

function generateDataset(count: number, seed: number): TelemetryLog[] {
  // Deterministic PRNG (mulberry32) so generated data is stable per seed.
  let state = seed;
  const random = (): number => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const baseTime = Date.now() - count * INTERVAL_MS;
  const items: TelemetryLog[] = new Array(count);

  for (let i = 0; i < count; i++) {
    const level = LEVELS[Math.floor(random() * LEVELS.length)];
    const service = SERVICES[Math.floor(random() * SERVICES.length)];
    const message = MESSAGES[Math.floor(random() * MESSAGES.length)];
    const latencyMs =
      level === 'ERROR' ? Math.floor(800 + random() * 1200) : Math.floor(10 + random() * 120);
    const statusCode = level === 'ERROR' ? 500 : level === 'WARN' ? 429 : 200;

    items[i] = {
      id: i + 1,
      // Timestamps are transferred as epoch numbers; `Date` is not structured-cloneable-cheap.
      timestamp: baseTime + i * INTERVAL_MS,
      service,
      level,
      message,
      latencyMs,
      statusCode,
    };
  }

  return items;
}

addEventListener('message', ({ data }: MessageEvent<{ count: number; seed: number }>) => {
  const { count, seed } = data;
  const started = performance.now();
  const items = generateDataset(count, seed);
  const durationMs = performance.now() - started;

  postMessage({ items, durationMs });
});
