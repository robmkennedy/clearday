import { CDPSession, Page } from '@playwright/test';
import { test as baseFixtures, expect, createTodoViaApi } from './base';

/**
 * Chrome CDP Performance Fixtures
 *
 * Provides access to Chrome DevTools Protocol metrics for UI performance testing.
 * Uses CDP sessions to capture Web Vitals, JS heap, long tasks, and layout shifts.
 *
 * NOTE: These fixtures only work with Chromium-based browsers.
 */

// ── Types ─────────────────────────────────────────────────────────────

export interface PerformanceMetrics {
  /** First Contentful Paint (ms) */
  fcp: number | null;
  /** Largest Contentful Paint (ms) */
  lcp: number | null;
  /** Cumulative Layout Shift score */
  cls: number;
  /** Total Blocking Time — sum of long-task overages (ms) */
  tbt: number;
  /** DOMContentLoaded timing (ms) */
  domContentLoaded: number | null;
  /** Full page load timing (ms) */
  load: number | null;
  /** JS heap used (bytes) */
  jsHeapUsedSize: number;
  /** JS heap total (bytes) */
  jsHeapTotalSize: number;
  /** Number of DOM nodes */
  domNodes: number;
  /** Number of network requests observed */
  networkRequestCount: number;
  /** Total bytes transferred */
  networkTransferSize: number;
}

export interface LongTask {
  startTime: number;
  duration: number;
}

export interface PerformanceHelper {
  /** Start collecting performance data (call before navigation) */
  startTracing: (page: Page) => Promise<void>;
  /** Stop collecting and return aggregated metrics */
  collectMetrics: (page: Page) => Promise<PerformanceMetrics>;
  /** Get Chrome runtime metrics via CDP Performance.getMetrics */
  getCDPMetrics: (page: Page) => Promise<Record<string, number>>;
  /** Measure a specific user interaction and return its duration (ms) */
  measureInteraction: (page: Page, action: () => Promise<void>) => Promise<number>;
  /** Take a JS heap snapshot size reading */
  getHeapSize: (page: Page) => Promise<{ used: number; total: number }>;
}

// ── Thresholds (calibrated for a simple todo SPA) ─────────────────────

export const PERF_THRESHOLDS = {
  /** FCP should be under 1.5s for a lightweight SPA */
  FCP_MS: 1500,
  /** LCP should be under 2.5s (Google "good" threshold) */
  LCP_MS: 2500,
  /** CLS should be under 0.1 (Google "good" threshold) */
  CLS: 0.1,
  /** TBT should be under 200ms for a simple app */
  TBT_MS: 200,
  /** Page load under 3s */
  LOAD_MS: 3000,
  /** DOM nodes — a todo app shouldn't need many */
  DOM_NODES: 500,
  /** JS heap should stay under 20MB for this app */
  JS_HEAP_MB: 20,
  /** Single UI-only interaction (no API wait) should respond within 100ms */
  INTERACTION_MS: 100,
  /**
   * Network requests on initial load.
   * In dev mode, Vite HMR injects many module requests (~40-50).
   * In production builds this would be ~10-15.
   */
  INITIAL_REQUESTS_DEV: 60,
  INITIAL_REQUESTS_PROD: 15,
} as const;

// ── Helpers ───────────────────────────────────────────────────────────

async function getCDPSession(page: Page): Promise<CDPSession> {
  return page.context().newCDPSession(page);
}

// ── Fixture ───────────────────────────────────────────────────────────

type PerfFixtures = {
  perf: PerformanceHelper;
};

export const test = baseFixtures.extend<PerfFixtures>({
  perf: async ({}, use) => {
    // State tracked across start → collect
    let longTasks: LongTask[] = [];
    let networkRequests: { url: string; transferSize: number }[] = [];
    let cdpSession: CDPSession | null = null;

    const helper: PerformanceHelper = {
      startTracing: async (page: Page) => {
        longTasks = [];
        networkRequests = [];

        // Open CDP session and enable domains
        cdpSession = await getCDPSession(page);
        await cdpSession.send('Performance.enable');

        // Listen for long tasks (> 50ms on main thread)
        await cdpSession.send('PerformanceTimeline.enable', {
          eventTypes: ['longtask'],
        }).catch(() => {
          // PerformanceTimeline may not be available in all Chrome versions;
          // fall back to JS-based collection in collectMetrics
        });

        cdpSession.on('PerformanceTimeline.timelineEventAdded', (event) => {
          if (event.event?.type === 'longtask') {
            longTasks.push({
              startTime: event.event.time,
              duration: event.event.duration,
            });
          }
        });

        // Track network requests for transfer size
        page.on('response', async (response) => {
          try {
            const headers = await response.allHeaders();
            const contentLength = parseInt(headers['content-length'] || '0', 10);
            networkRequests.push({
              url: response.url(),
              transferSize: contentLength,
            });
          } catch {
            networkRequests.push({ url: response.url(), transferSize: 0 });
          }
        });
      },

      collectMetrics: async (page: Page) => {
        // ── Web Vitals via PerformanceObserver ──
        const webVitals = await page.evaluate(() => {
          return new Promise<{
            fcp: number | null;
            lcp: number | null;
            cls: number;
            domContentLoaded: number | null;
            load: number | null;
          }>((resolve) => {
            let fcp: number | null = null;
            let lcp: number | null = null;
            let cls = 0;

            // FCP
            const fcpEntries = performance.getEntriesByName('first-contentful-paint');
            if (fcpEntries.length > 0) {
              fcp = fcpEntries[0].startTime;
            }

            // Navigation timing
            const navEntries = performance.getEntriesByType(
              'navigation'
            ) as PerformanceNavigationTiming[];
            const nav = navEntries[0] ?? null;
            const domContentLoaded = nav
              ? nav.domContentLoadedEventEnd - nav.startTime
              : null;
            const load = nav ? nav.loadEventEnd - nav.startTime : null;

            // LCP — observe briefly in case the last entry hasn't fired yet
            const lcpObserver = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              if (entries.length > 0) {
                lcp = entries[entries.length - 1].startTime;
              }
            });
            try {
              lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
            } catch {
              /* not supported */
            }

            // CLS
            const clsObserver = new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (!(entry as any).hadRecentInput) {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  cls += (entry as any).value ?? 0;
                }
              }
            });
            try {
              clsObserver.observe({ type: 'layout-shift', buffered: true });
            } catch {
              /* not supported */
            }

            // Give observers 200ms to flush buffered entries
            setTimeout(() => {
              lcpObserver.disconnect();
              clsObserver.disconnect();
              resolve({ fcp, lcp, cls, domContentLoaded, load });
            }, 200);
          });
        });

        // ── Long-task TBT fallback via JS (if CDP didn't capture) ──
        const jsTbt = await page.evaluate(() => {
          const entries = performance.getEntriesByType('longtask') as PerformanceEntry[];
          return entries.reduce((sum, e) => sum + Math.max(0, e.duration - 50), 0);
        }).catch(() => 0);

        const tbt =
          longTasks.length > 0
            ? longTasks.reduce((sum, t) => sum + Math.max(0, t.duration - 50), 0)
            : jsTbt;

        // ── DOM node count ──
        const domNodes = await page.evaluate(
          () => document.querySelectorAll('*').length
        );

        // ── JS Heap from CDP ──
        let jsHeapUsedSize = 0;
        let jsHeapTotalSize = 0;
        if (cdpSession) {
          const metrics = await cdpSession.send('Performance.getMetrics');
          for (const m of metrics.metrics) {
            if (m.name === 'JSHeapUsedSize') jsHeapUsedSize = m.value;
            if (m.name === 'JSHeapTotalSize') jsHeapTotalSize = m.value;
          }
        }

        return {
          fcp: webVitals.fcp,
          lcp: webVitals.lcp,
          cls: webVitals.cls,
          tbt,
          domContentLoaded: webVitals.domContentLoaded,
          load: webVitals.load,
          jsHeapUsedSize,
          jsHeapTotalSize,
          domNodes,
          networkRequestCount: networkRequests.length,
          networkTransferSize: networkRequests.reduce(
            (sum, r) => sum + r.transferSize,
            0
          ),
        };
      },

      getCDPMetrics: async (page: Page) => {
        let session: CDPSession;
        if (cdpSession) {
          session = cdpSession;
        } else {
          session = await getCDPSession(page);
          await session.send('Performance.enable');
        }
        const result = await session.send('Performance.getMetrics');
        const map: Record<string, number> = {};
        for (const m of result.metrics) {
          map[m.name] = m.value;
        }
        return map;
      },

      measureInteraction: async (page: Page, action: () => Promise<void>) => {
        const start = await page.evaluate(() => performance.now());
        await action();
        const end = await page.evaluate(() => performance.now());
        return end - start;
      },

      getHeapSize: async (page: Page) => {
        let session: CDPSession;
        if (cdpSession) {
          session = cdpSession;
        } else {
          session = await getCDPSession(page);
          await session.send('Performance.enable');
        }
        const result = await session.send('Performance.getMetrics');
        let used = 0;
        let total = 0;
        for (const m of result.metrics) {
          if (m.name === 'JSHeapUsedSize') used = m.value;
          if (m.name === 'JSHeapTotalSize') total = m.value;
        }
        return { used, total };
      },
    };

    await use(helper);

    // Cleanup
    if (cdpSession) {
      await cdpSession.detach().catch(() => {});
    }
  },
});

export { expect, createTodoViaApi };



