import { test, expect, PERF_THRESHOLDS, createTodoViaApi } from './fixtures/performance';

/**
 * UI Performance Tests — Chrome CDP
 *
 * Uses Chrome DevTools Protocol via Playwright CDP sessions to measure
 * real browser performance metrics. These tests run ONLY on Chromium.
 *
 * Metrics captured:
 *  - Web Vitals: FCP, LCP, CLS
 *  - Total Blocking Time (long tasks)
 *  - JS heap memory
 *  - DOM complexity
 *  - Network request count & transfer size
 *  - Interaction responsiveness (add, toggle, delete, theme switch)
 */

test.describe('UI Performance — Chrome CDP @perf', () => {
  // These tests only make sense on Chromium (CDP requirement)
  test.skip(({ browserName }) => browserName !== 'chromium', 'CDP requires Chromium');

  // ── Page Load Performance ──────────────────────────────────────────

  test.describe('Page Load', () => {
    test('empty state loads within performance budgets @p1', async ({ page, perf, network }) => {
      await perf.startTracing(page);

      const todosLoadPromise = network.waitForTodosLoad(page);
      await page.goto('/');
      await todosLoadPromise;

      // Let the page settle
      await page.waitForLoadState('networkidle');

      const metrics = await perf.collectMetrics(page);

      // Assert Web Vitals
      if (metrics.fcp !== null) {
        expect(metrics.fcp, `FCP ${metrics.fcp}ms exceeds ${PERF_THRESHOLDS.FCP_MS}ms budget`).toBeLessThan(PERF_THRESHOLDS.FCP_MS);
      }
      if (metrics.lcp !== null) {
        expect(metrics.lcp, `LCP ${metrics.lcp}ms exceeds ${PERF_THRESHOLDS.LCP_MS}ms budget`).toBeLessThan(PERF_THRESHOLDS.LCP_MS);
      }
      expect(metrics.cls, `CLS ${metrics.cls} exceeds ${PERF_THRESHOLDS.CLS} budget`).toBeLessThan(PERF_THRESHOLDS.CLS);

      // Assert TBT
      expect(metrics.tbt, `TBT ${metrics.tbt}ms exceeds ${PERF_THRESHOLDS.TBT_MS}ms budget`).toBeLessThan(PERF_THRESHOLDS.TBT_MS);

      // Assert DOM complexity
      expect(metrics.domNodes, `DOM has ${metrics.domNodes} nodes (limit: ${PERF_THRESHOLDS.DOM_NODES})`).toBeLessThan(PERF_THRESHOLDS.DOM_NODES);

      // Assert JS heap
      const heapMB = metrics.jsHeapUsedSize / (1024 * 1024);
      expect(heapMB, `JS heap ${heapMB.toFixed(1)}MB exceeds ${PERF_THRESHOLDS.JS_HEAP_MB}MB budget`).toBeLessThan(PERF_THRESHOLDS.JS_HEAP_MB);

      // Assert network request count (dev mode has more due to Vite HMR)
      const requestBudget = PERF_THRESHOLDS.INITIAL_REQUESTS_DEV;
      expect(metrics.networkRequestCount, `${metrics.networkRequestCount} requests exceed ${requestBudget} budget`).toBeLessThan(requestBudget);

      // Log metrics for CI visibility
      console.log('📊 Empty-state page load metrics:', JSON.stringify(metrics, null, 2));
    });

    test('page with 20 todos loads within performance budgets @p1', async ({ page, perf, network, api }) => {
      // Seed 20 todos
      for (let i = 1; i <= 20; i++) {
        await createTodoViaApi(api, `Performance test task ${i}`);
      }

      await perf.startTracing(page);

      const todosLoadPromise = network.waitForTodosLoad(page);
      await page.goto('/');
      await todosLoadPromise;
      await page.waitForLoadState('networkidle');

      const metrics = await perf.collectMetrics(page);

      // Same budgets — a todo app with 20 items should still be fast
      if (metrics.fcp !== null) {
        expect(metrics.fcp, `FCP ${metrics.fcp}ms`).toBeLessThan(PERF_THRESHOLDS.FCP_MS);
      }
      if (metrics.lcp !== null) {
        expect(metrics.lcp, `LCP ${metrics.lcp}ms`).toBeLessThan(PERF_THRESHOLDS.LCP_MS);
      }
      expect(metrics.cls, `CLS ${metrics.cls}`).toBeLessThan(PERF_THRESHOLDS.CLS);
      expect(metrics.tbt, `TBT ${metrics.tbt}ms`).toBeLessThan(PERF_THRESHOLDS.TBT_MS);

      // DOM should scale linearly — 20 items shouldn't explode the tree
      expect(metrics.domNodes, `DOM nodes: ${metrics.domNodes}`).toBeLessThan(PERF_THRESHOLDS.DOM_NODES);

      console.log('📊 20-todo page load metrics:', JSON.stringify(metrics, null, 2));
    });
  });

  // ── Interaction Responsiveness ─────────────────────────────────────

  test.describe('Interaction Responsiveness', () => {
    test.beforeEach(async ({ page, network }) => {
      const todosLoadPromise = network.waitForTodosLoad(page);
      await page.goto('/');
      await todosLoadPromise;
    });

    test('adding a task responds within budget @p1', async ({ page, perf, network }) => {
      const input = page.getByRole('textbox', { name: /add.*task/i });

      const duration = await perf.measureInteraction(page, async () => {
        const createPromise = network.waitForTodoCreate(page);
        await input.fill('Performance test task');
        await input.press('Enter');
        await createPromise;
      });

      // The full round-trip (including API) is measured; UI should respond optimistically
      // so visual feedback is instant even if the API takes longer
      expect(duration, `Add-task interaction took ${duration.toFixed(0)}ms`).toBeLessThan(500);

      console.log(`⚡ Add task interaction: ${duration.toFixed(0)}ms`);
    });

    test('toggling a task completion responds within budget @p1', async ({ page, perf, network, api }) => {
      // Seed a task
      await createTodoViaApi(api, 'Toggle perf test');
      const reloadPromise = network.waitForTodosLoad(page);
      await page.reload();
      await reloadPromise;

      const checkbox = page.getByRole('checkbox', { name: /toggle perf test/i });

      const duration = await perf.measureInteraction(page, async () => {
        const updatePromise = network.waitForTodoUpdate(page);
        await checkbox.click();
        await updatePromise;
      });

      expect(duration, `Toggle interaction took ${duration.toFixed(0)}ms`).toBeLessThan(1000);

      console.log(`⚡ Toggle task interaction: ${duration.toFixed(0)}ms`);
    });

    test('deleting a task responds within budget @p1', async ({ page, perf, network, api }) => {
      // Seed a task
      await createTodoViaApi(api, 'Delete perf test');
      const reloadPromise = network.waitForTodosLoad(page);
      await page.reload();
      await reloadPromise;

      const deleteBtn = page.getByRole('button', { name: /delete.*delete perf test/i });

      const duration = await perf.measureInteraction(page, async () => {
        const deletePromise = network.waitForTodoDelete(page);
        await deleteBtn.click();
        await deletePromise;
      });

      // Delete has a 200ms animation, so budget accounts for that
      expect(duration, `Delete interaction took ${duration.toFixed(0)}ms`).toBeLessThan(700);

      console.log(`⚡ Delete task interaction: ${duration.toFixed(0)}ms`);
    });

    test('theme toggle responds within budget @p0', async ({ page, perf }) => {
      const themeToggle = page.getByRole('button', { name: /theme|dark|light/i });

      const duration = await perf.measureInteraction(page, async () => {
        await themeToggle.click();
        // Wait for the CSS transition to apply (150ms var(--transition-fast))
        await page.waitForTimeout(200);
      });

      // Budget: 100ms interaction + 200ms CSS transition wait + Playwright overhead
      expect(duration, `Theme toggle took ${duration.toFixed(0)}ms`).toBeLessThan(500);

      // Verify theme actually changed
      const theme = await page.evaluate(() =>
        document.documentElement.getAttribute('data-theme')
      );
      expect(theme).toBe('dark');

      console.log(`⚡ Theme toggle interaction: ${duration.toFixed(0)}ms`);
    });
  });

  // ── Memory & Stability ────────────────────────────────────────────

  test.describe('Memory Stability', () => {
    test('no memory leak after repeated add/delete cycles @p2', async ({ page, perf, network }) => {
      const todosLoadPromise = network.waitForTodosLoad(page);
      await page.goto('/');
      await todosLoadPromise;

      // Baseline heap
      const baseline = await perf.getHeapSize(page);

      // Run 10 add-then-delete cycles
      const input = page.getByRole('textbox', { name: /add.*task/i });
      for (let i = 0; i < 10; i++) {
        // Add
        const createPromise = network.waitForTodoCreate(page);
        await input.fill(`Leak test ${i}`);
        await input.press('Enter');
        await createPromise;

        // Delete
        const deleteBtn = page.getByRole('button', { name: new RegExp(`delete.*leak test ${i}`, 'i') });
        const deletePromise = network.waitForTodoDelete(page);
        await deleteBtn.click();
        await deletePromise;

        // Wait for delete animation
        await page.waitForTimeout(250);
      }

      // Force garbage collection if available
      await page.evaluate(() => {
        if ((window as unknown as { gc?: () => void }).gc) {
          (window as unknown as { gc: () => void }).gc();
        }
      });
      await page.waitForTimeout(500);

      // Post-cycle heap
      const after = await perf.getHeapSize(page);

      const growthMB = (after.used - baseline.used) / (1024 * 1024);
      console.log(
        `🧠 Memory: baseline=${(baseline.used / (1024 * 1024)).toFixed(1)}MB, ` +
        `after=${(after.used / (1024 * 1024)).toFixed(1)}MB, ` +
        `growth=${growthMB.toFixed(2)}MB`
      );

      // Allow up to 5MB growth for 10 cycles — anything more suggests a leak
      expect(growthMB, `Heap grew ${growthMB.toFixed(2)}MB after 10 cycles`).toBeLessThan(5);
    });
  });

  // ── Layout Shift during Interactions ──────────────────────────────

  test.describe('Visual Stability', () => {
    test('no layout shift when adding a task @p1', async ({ page, network, api }) => {
      // Seed some tasks so the list has content
      for (let i = 1; i <= 5; i++) {
        await createTodoViaApi(api, `Existing task ${i}`);
      }

      const todosLoadPromise = network.waitForTodosLoad(page);
      await page.goto('/');
      await todosLoadPromise;
      await page.waitForLoadState('networkidle');

      // Start observing layout shifts
      await page.evaluate(() => {
        (window as unknown as { __clsScore: number }).__clsScore = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (!(entry as any).hadRecentInput) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (window as unknown as { __clsScore: number }).__clsScore += (entry as any).value ?? 0;
            }
          }
        });
        observer.observe({ type: 'layout-shift', buffered: false });
      });

      // Add a task
      const input = page.getByRole('textbox', { name: /add.*task/i });
      const createPromise = network.waitForTodoCreate(page);
      await input.fill('CLS test task');
      await input.press('Enter');
      await createPromise;
      await page.waitForTimeout(300); // let animations settle

      const clsDuringAdd = await page.evaluate(
        () => (window as unknown as { __clsScore: number }).__clsScore
      );

      expect(clsDuringAdd, `CLS during add: ${clsDuringAdd}`).toBeLessThan(PERF_THRESHOLDS.CLS);

      console.log(`📐 CLS during task add: ${clsDuringAdd.toFixed(4)}`);
    });

    test('no layout shift when toggling a task @p1', async ({ page, network }) => {
      // Seed via UI to avoid cross-worker cleanDb race
      const todosLoadPromise = network.waitForTodosLoad(page);
      await page.goto('/');
      await todosLoadPromise;

      const input = page.getByRole('textbox', { name: /add.*task/i });
      const createPromise = network.waitForTodoCreate(page);
      await input.fill('CLS toggle perf test');
      await input.press('Enter');
      await createPromise;

      // Ensure task is rendered before we start observing CLS
      await expect(page.getByText('CLS toggle perf test')).toBeVisible();
      await page.waitForLoadState('networkidle');

      // Start observing
      await page.evaluate(() => {
        (window as unknown as { __clsScore: number }).__clsScore = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (!(entry as any).hadRecentInput) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (window as unknown as { __clsScore: number }).__clsScore += (entry as any).value ?? 0;
            }
          }
        });
        observer.observe({ type: 'layout-shift', buffered: false });
      });

      // Toggle
      const checkbox = page.getByRole('checkbox', { name: /cls toggle perf test/i });
      const updatePromise = network.waitForTodoUpdate(page);
      await checkbox.click();
      await updatePromise;
      await page.waitForTimeout(300);

      const clsDuringToggle = await page.evaluate(
        () => (window as unknown as { __clsScore: number }).__clsScore
      );

      // Toggling moves the item from "To Do" to "Done" section — some shift
      // is expected, but it should be user-initiated (hadRecentInput filters those)
      expect(clsDuringToggle, `CLS during toggle: ${clsDuringToggle}`).toBeLessThan(0.25);

      console.log(`📐 CLS during toggle: ${clsDuringToggle.toFixed(4)}`);
    });
  });

  // ── CDP Runtime Metrics Snapshot ──────────────────────────────────

  test.describe('Chrome Runtime Metrics', () => {
    test('captures full CDP metrics snapshot @p2', async ({ page, perf, network }) => {
      const todosLoadPromise = network.waitForTodosLoad(page);
      await page.goto('/');
      await todosLoadPromise;
      await page.waitForLoadState('networkidle');

      const cdpMetrics = await perf.getCDPMetrics(page);

      // Log all available Chrome metrics for visibility
      console.log('🔬 Chrome CDP Performance Metrics:');
      for (const [name, value] of Object.entries(cdpMetrics)) {
        if (value > 0) {
          console.log(`   ${name}: ${typeof value === 'number' && value > 10000 ? (value / 1024 / 1024).toFixed(2) + ' MB' : value}`);
        }
      }

      // Basic sanity checks on CDP metrics
      expect(Object.keys(cdpMetrics).length, 'CDP should return metrics').toBeGreaterThan(0);

      // JSHeapUsedSize should always be present and positive
      const heapUsed = cdpMetrics['JSHeapUsedSize'];
      expect(heapUsed, 'JSHeapUsedSize should be defined').toBeDefined();
      expect(heapUsed).toBeGreaterThan(0);

      // Documents count
      const docs = cdpMetrics['Documents'];
      expect(docs, 'Documents should be defined').toBeDefined();
      expect(docs).toBeGreaterThan(0);
    });
  });
});


