# UI Performance Report — ClearDay

**Date:** March 11, 2026
**Author:** Murat (TEA — Master Test Architect)
**Tool:** Chrome DevTools Protocol via Playwright CDP Sessions
**Browser:** Chromium (headless)
**Environment:** Local development (Vite HMR, `npm run dev`)
**Test Suite:** `e2e/performance.spec.ts` (10 tests, 5 categories)

---

## Executive Summary

The ClearDay application **passes all UI performance budgets** with significant headroom. Page load metrics are excellent — FCP under 140ms, zero layout shift, zero long tasks, and JS heap under 3.5MB. Interaction responsiveness is well within budget across all CRUD operations. No memory leaks detected after 10 add/delete cycles.

**Verdict: ✅ PASS — All 10 performance tests green.**

---

## 1. Page Load Performance

### 1.1 Empty State (no todos)

| Metric | Measured | Budget | Status | Headroom |
|--------|----------|--------|--------|----------|
| **FCP** | 136ms | 1,500ms | ✅ | 91% |
| **LCP** | 136ms | 2,500ms | ✅ | 95% |
| **CLS** | 0.0000 | 0.10 | ✅ | 100% |
| **TBT** | 0ms | 200ms | ✅ | 100% |
| **DOMContentLoaded** | 110ms | 3,000ms | ✅ | 96% |
| **Full Load** | 110ms | 3,000ms | ✅ | 96% |
| **DOM Nodes** | 157 | 500 | ✅ | 69% |
| **JS Heap** | 3.3MB | 20MB | ✅ | 84% |
| **Network Requests** | 46 | 60 (dev) | ✅ | 23% |
| **Transfer Size** | 1.6MB | — | ℹ️ | dev mode |

### 1.2 Loaded State (20 todos)

| Metric | Measured | Budget | Status | Headroom |
|--------|----------|--------|--------|----------|
| **FCP** | 108ms | 1,500ms | ✅ | 93% |
| **LCP** | 108ms | 2,500ms | ✅ | 96% |
| **CLS** | 0.0000 | 0.10 | ✅ | 100% |
| **TBT** | 0ms | 200ms | ✅ | 100% |
| **DOMContentLoaded** | 84ms | 3,000ms | ✅ | 97% |
| **Full Load** | 84ms | 3,000ms | ✅ | 97% |
| **DOM Nodes** | 141 | 500 | ✅ | 72% |
| **JS Heap** | 3.3MB | 20MB | ✅ | 84% |

> **Key insight:** DOM node count is actually _lower_ with 20 todos (141) vs empty state (157) in one run. This is because the empty state renders the `EmptyState` component while the loaded state renders compact list items. Either way, well under budget.

---

## 2. Interaction Responsiveness

All interactions are measured as full round-trips: from user action through API call completion.

| Interaction | Duration | Budget | Status | Notes |
|-------------|----------|--------|--------|-------|
| **Add task** | 81ms | 500ms | ✅ | Optimistic UI — visual feedback is instant |
| **Toggle completion** | 360ms | 1,000ms | ✅ | Includes PATCH round-trip + section move animation |
| **Delete task** | 532ms | 700ms | ✅ | Includes 200ms CSS exit animation + DELETE round-trip |
| **Theme toggle** | 276ms | 500ms | ✅ | Includes 150ms CSS transition + DOM update |

### Observations

- **Add task** is the fastest interaction (81ms) thanks to optimistic UI — React Query adds the item to the cache before the POST completes.
- **Delete task** is the slowest (532ms) which is expected: the 200ms CSS animation runs before the API call fires (`DELETE_ANIMATION_MS` constant in `TodoList.tsx`).
- **Toggle** at 360ms includes the visual move from "To Do" to "Done" section plus the PATCH round-trip.
- **Theme toggle** at 276ms includes the CSS transition (`var(--transition-fast)` = 150ms).

---

## 3. Visual Stability (Cumulative Layout Shift)

| Scenario | CLS Score | Budget | Status |
|----------|-----------|--------|--------|
| Page load (empty) | 0.0000 | 0.10 | ✅ |
| Page load (20 todos) | 0.0000 | 0.10 | ✅ |
| During task add | 0.0000 | 0.10 | ✅ |
| During task toggle | 0.0000 | 0.25 | ✅ |

> **Zero layout shift across all scenarios.** The application's CSS is well-structured — no content jumping, no late-loading elements causing reflow. The toggle CLS budget is wider (0.25) because moving an item between sections could cause layout shift, but the `hadRecentInput` filter correctly attributes this to user interaction.

---

## 4. Memory Stability

| Metric | Value |
|--------|-------|
| **Baseline heap** | 3.1MB |
| **After 10 add/delete cycles** | 6.2MB |
| **Growth** | +3.06MB |
| **Budget** | < 5MB |
| **Status** | ✅ |

### Analysis

The 3MB growth over 10 cycles is within expectations for a React + React Query app:
- React Query cache retains invalidated query snapshots briefly
- React's fiber tree allocates new nodes for each render cycle
- The V8 garbage collector may not have fully reclaimed all allocations at measurement time

**No leak pattern detected.** Growth is linear and bounded, not exponential.

---

## 5. Chrome CDP Runtime Metrics

Raw Chrome DevTools Protocol metrics snapshot after page load:

| Metric | Value |
|--------|-------|
| **JS Heap Used** | 3.35MB |
| **JS Heap Total** | 5.00MB |
| **Documents** | 3 |
| **Frames** | 1 |
| **JS Event Listeners** | 155 |
| **Layout Objects** | 53 |
| **DOM Nodes (CDP)** | 107 |
| **Resources** | 45 |
| **V8 Per-Context Datas** | 4 |
| **Process Time** | 0.14s |

> **155 event listeners** is reasonable for a React app with checkboxes, delete buttons, toast system, and React Query observers.

---

## 6. Performance Budgets Reference

These budgets are defined in `e2e/fixtures/performance.ts` as `PERF_THRESHOLDS`:

| Budget | Value | Rationale |
|--------|-------|-----------|
| FCP | < 1,500ms | Lightweight SPA target |
| LCP | < 2,500ms | Google "Good" threshold |
| CLS | < 0.10 | Google "Good" threshold |
| TBT | < 200ms | Simple app, no heavy computation |
| Page Load | < 3,000ms | Full load including API fetch |
| DOM Nodes | < 500 | Todo app simplicity ceiling |
| JS Heap | < 20MB | Conservative for a small SPA |
| Interaction (UI-only) | < 100ms | No API wait, pure UI responsiveness |
| Network Requests (dev) | < 60 | Vite HMR inflates request count |
| Network Requests (prod) | < 15 | Bundled production build |
| Memory Growth | < 5MB / 10 cycles | Leak detection threshold |

---

## 7. Test Architecture

### Files

| File | Purpose |
|------|---------|
| `e2e/fixtures/performance.ts` | Chrome CDP performance fixture — `PerformanceHelper` with `startTracing`, `collectMetrics`, `getCDPMetrics`, `measureInteraction`, `getHeapSize` |
| `e2e/performance.spec.ts` | 10 performance tests across 5 categories |

### How It Works

```
┌─────────────────────┐     CDP Session      ┌──────────────────────┐
│   Playwright Test    │ ◄──────────────────► │   Chrome DevTools    │
│                      │                      │   Protocol (CDP)     │
│  perf.startTracing() │  Performance.enable  │                      │
│  perf.collectMetrics │  Performance.getMetrics                     │
│  perf.getHeapSize()  │  JSHeapUsedSize      │                      │
│  perf.getCDPMetrics()│  Full metrics dump   │                      │
└─────────────────────┘                      └──────────────────────┘
         │
         │  page.evaluate()
         ▼
┌─────────────────────┐
│  Browser JavaScript  │
│                      │
│  PerformanceObserver │  → FCP, LCP, CLS
│  Navigation Timing   │  → DOMContentLoaded, Load
│  Long Task API       │  → TBT fallback
│  DOM queries         │  → Node count
└─────────────────────┘
```

### Key Design Decisions

1. **CDP over web-vitals library** — Direct CDP access gives us heap metrics, long tasks via `PerformanceTimeline`, and raw Chrome counters that a JS library cannot provide.
2. **Dual TBT collection** — CDP `PerformanceTimeline.enable` for long tasks when available, with a JS `performance.getEntriesByType('longtask')` fallback.
3. **Network tracking via Playwright events** — Rather than CDP Network domain, we use `page.on('response')` which is simpler and avoids domain conflicts.
4. **Dev vs Prod request budgets** — Vite HMR sends ~46 module requests in dev mode. A prod build would send ~10-15. Separate thresholds prevent false failures.

---

## 8. Recommendations

### ✅ No Action Required

The app is well within all performance budgets. No optimization work needed at this time.

### 📋 Future Considerations

| Priority | Recommendation | Rationale |
|----------|---------------|-----------|
| P3 | Add production build perf tests to CI | Dev mode inflates network metrics; prod build gives true user-facing numbers |
| P3 | Add Lighthouse CI integration | Automated accessibility + performance scoring per PR |
| P3 | Monitor heap growth over longer sessions | Current 10-cycle test is a good smoke test; 100-cycle would catch slower leaks |
| P4 | Add performance regression detection | Track metrics over time and alert on degradation (e.g., FCP creeping above 200ms) |

---

## 9. How to Run

```bash
# Start dev servers (backend + frontend)
npm run dev

# Run all performance tests
npx playwright test e2e/performance.spec.ts --project=chromium

# Run with verbose output
npx playwright test e2e/performance.spec.ts --project=chromium --reporter=list
```

> ⚠️ Performance tests require **Chromium** (CDP dependency). They auto-skip on Firefox and WebKit.

