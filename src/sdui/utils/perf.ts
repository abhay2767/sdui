export interface PerfMetric {
  name: string;
  parseTimeMs: number;
  renderTimeMs: number;
  totalTimeMs: number;
  nodeCount: number;
  timestamp: string;
}

export function getCurrentTimeMs(): number {
  if (typeof globalThis !== 'undefined' && (globalThis as any).performance && (globalThis as any).performance.now) {
    return (globalThis as any).performance.now();
  }
  return Date.now();
}

class PerformanceTracker {
  private metrics: Record<string, PerfMetric> = {};

  public recordMetric(metric: PerfMetric) {
    this.metrics[metric.name] = metric;
    if (__DEV__) {
      console.log(`⚡ [PERF][${metric.name}] Parse: ${metric.parseTimeMs.toFixed(2)}ms | Render: ${metric.renderTimeMs.toFixed(2)}ms | Total: ${metric.totalTimeMs.toFixed(2)}ms | Nodes: ${metric.nodeCount}`);
    }
  }

  public getMetric(name: string): PerfMetric | undefined {
    return this.metrics[name];
  }

  public getAllMetrics(): Record<string, PerfMetric> {
    return { ...this.metrics };
  }
}

export const perfTracker = new PerformanceTracker();

export function measureExecution<T>(fn: () => T): { result: T; durationMs: number } {
  const start = getCurrentTimeMs();
  const result = fn();
  const end = getCurrentTimeMs();
  return { result, durationMs: end - start };
}
