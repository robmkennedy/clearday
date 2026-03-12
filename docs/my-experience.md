# My Experience Building Clearday

**Author:** Rob  
**Date:** March 2026

---

## Overview

Clearday was built entirely through human–AI collaboration using the BMAD method. These are my notes and observations from directing AI agents through discovery, design, implementation, and testing of a full-stack todo application.

---

## Phase 1 — Discovery & Design

### Product Manager (John)

- Created a solid, well-formatted PRD on the first pass.
- I prompted the PM to add a **dark mode** feature to the PRD after the initial version.

### Architect (Winston)

- Generated a good architecture document from the PRD.
- I prompted the Architect to update the doc after the PRD changed (to include dark mode).
- I prompted the Architect to use **CSS modules instead of Tailwind** — accepted and updated.

### UX Designer (Sally)

- Did a good job generating **personas**, **user flows**, and **interview scripts**.
- I asked UX to split the task list into **todo / completed panels** — a design decision that cascaded through the pipeline:
  - UX produced updated wireframes incorporating the two-panel layout.
  - Generated a useful **UX → Architecture handoff** document.
  - I then prompted the **PM to update the PRD** to include separate panels.
  - I then prompted the **Architect to update the architecture doc** based on the new PRD and UX handoff.

> **Lesson learned:** A single design decision can trigger a chain of updates across multiple agents and artifacts. The BMAD workflow handles this well — each agent picks up the updated inputs cleanly.

---

## Phase 2 — Sprint Planning & Execution

### Sprint 1 — Project Foundation & Core Task Capture

- **PM** generated the Sprint 1 backlog.
- **QA** generated the Sprint 1 test plan.
- **DEV** implemented Sprint 1, prioritising high-priority actions first. It's also possible to implement stories in parallel.
- **TEA** generated the Sprint 1 test review — score **92/100**, 0 critical, 0 high, 0 medium issues. TEA recommended that we didn't need a separate test plan for Sprint 2, since the Sprint 1 test plan already contained forward-looking recommendations. See [`sprint-1-test-review.md`](../_bmad-output/test-artifacts/sprint-1-test-review.md).

> **Lesson learned:** A thorough test plan in Sprint 1 can serve as a living document for the whole project. TEA's forward-looking recommendations eliminated the overhead of creating a new test plan each sprint — review and update beats rewrite.

### Sprint 2 — Task Management & Polish

- DEV implemented stories based on the recommended order in the Sprint 2 backlog.
- DEV created a **separate file per story** (this wasn't done in Sprint 1).
- Full test suite executed after each story.
- I performed **code reviews** after DEV completed each story.
- Some errors were found — typically 1–2 medium issues per story, roughly 3–4 major errors across the entire sprint.

**TEA Sprint 2 Review** — score **94/100**, 0 critical, 1 high (React `act()` warnings), 2 medium (missing priority markers, hardcoded test data). All fixed. See [`sprint-2-test-review.md`](../_bmad-output/test-artifacts/sprint-2-test-review.md).

> **Lesson learned:** Code reviews after every story caught small issues early before they compounded. 1–2 medium issues per story is manageable; skipping reviews lets them snowball into sprint-level rework.

### Sprint 3 — UI States & Feedback

- None of the individual story files were created upfront.
- All three stories implemented at the same time, with tests generated together.
- I performed a code review after all stories were complete:
  - Suggested extracting **common mock handling**.
  - Suggested adding `data-testid` for improved pattern matching.
  - Test code is now **~15% shorter** and significantly more readable.

**TEA Sprint 3 Review** — score **97/100**, 0 critical, 1 high (no E2E for UI states), 2 medium (missing test IDs, missing priority tags), 1 low (`prefers-reduced-motion` untested). All fixed. See [`sprint-3-test-review.md`](../_bmad-output/test-artifacts/sprint-3-test-review.md).

> **Lesson learned:** Implementing related stories together can produce duplicated patterns. A single code review pass across the batch is a good opportunity to extract shared utilities — the ~15% reduction in test code here came from spotting repetition that wouldn't have been visible story-by-story.

### Sprint 4 — Dark Mode & Theme Support

- DEV prompted for story order — used the recommended sequence.
- Individual story files created.
- Full test suite executed after each story.
- I performed a code review after all stories were complete.
- **1 major error** regarding theming — fixed.

**TEA Sprint 4 Review** — score **92/100**, 0 critical, 0 high, 2 medium (hard wait without named constant, missing test IDs). All fixed. See [`sprint-4-test-review.md`](../_bmad-output/test-artifacts/sprint-4-test-review.md).

### Sprint 5 — Production Readiness

- **SM was skipped** — DEV operated directly from the sprint backlog.
- DEV executed all stories sequentially.
- I performed a code review at the end of the sprint: **2 High**, **4 Medium**, **2 Low** issues found.

**Story file naming conflict:**
- DEV had been creating stories with a `SPRINT-NUMBER` filename format.
- SM created story files with an `EPIC-NUMBER` format.
- Sprint 1 stories were implemented before the Create Story workflow was adopted, so story files were missing.
- Sprint 5 story files were also missing since SM was skipped.
- For completeness, I prompted SM to generate the missing story files retroactively.

**TEA Sprint 5 Review** — score **93/100**, 1 critical (missing unhealthy health check test), 2 high (logger smoke-only tests, missing test IDs). All fixed. See [`sprint-5-test-review.md`](../_bmad-output/test-artifacts/sprint-5-test-review.md).

> **Lesson learned:** Skipping the SM step saved time but created gaps — missing story files and a naming convention mismatch that had to be cleaned up retroactively. The ceremony exists for a reason; when you skip it, budget time to backfill.

> **Lesson learned:** Agree on a single file naming convention early. DEV and SM independently chose different formats (`SPRINT-NUMBER` vs `EPIC-NUMBER`), and the inconsistency wasn't caught until Sprint 5 when it was expensive to reconcile.

---

## Phase 3 — Quality Audits

### Performance Testing

- I didn't use Postman MCP to check the API — used **curl** instead.
- I prompted TEA to use Chrome MCP for performance testing — it didn't.
- The actual approach: **Playwright CDP sessions**. Playwright gives direct access to Chrome DevTools Protocol via `page.context().newCDPSession()`. This is the same data Chrome MCP exposes, but wired directly into the test harness — no extra servers, no context overhead. We get raw Chrome perf metrics: Web Vitals, JS heap, layout shifts, long tasks, and network timing.

TEA generated performance tests covering:

1. **Initial load** — FCP/LCP for a simple SPA
2. **Interaction responsiveness** — adding/toggling/deleting tasks shouldn't block the main thread
3. **Animation jank** — CSS transitions on delete and theme switch
4. **Memory** — no leaks from React Query cache or animation timers

**Result:** App is fast. FCP ~120ms, zero CLS, zero TBT, 3.3MB heap. No action items.

See [`ui-performance-report.md`](../_bmad-output/test-artifacts/ui-performance-report.md).

> **Lesson learned:** Don't over-prescribe the tooling. I suggested Chrome MCP; the agent chose Playwright CDP sessions instead — a better fit because it runs inside the existing test harness with no extra infrastructure. Let the agent pick the approach; steer on outcomes, not implementation.

### Security Review

TEA generated a security report. Findings and fixes:

See [`security-review-report.md`](../_bmad-output/test-artifacts/security-review-report.md).

> **Lesson learned:** A dedicated security review pass found 7 issues that none of the implementation sprints caught — rate limiting, source maps in production, CORS fallback, missing error handler. Baking security into the sprint work helps, but a focused audit at the end still finds things that slip through when the focus is on features.

### Test Coverage Review

**Bottom line:** The frontend is rock solid. The backend had 2 threshold violations — both caused by `src/index.ts` (a bootstrap-only file with 0% coverage) dragging down functions and branches. Excluding that one file puts effective backend coverage well over 80%.

Two biggest gaps worth closing:
- No E2E for delete flow — P0 functionality only covered at unit level
- No E2E for toggle flow — core user path missing cross-browser verification

TEA fixed all coverage gaps.

See [`test-coverage-report.md`](../_bmad-output/test-artifacts/test-coverage-report.md).

> **Lesson learned:** A single bootstrap file with 0% coverage can drag an entire workspace below the threshold. Coverage exclusions for entry-point files are legitimate — the important thing is knowing *why* coverage is low, not just hitting a number.

### Accessibility Audit

TEA generated an accessibility report against WCAG 2.1 AA.

- Required fixes — one issue found: **checkbox size too large in desktop mode**.
- Prompted TEA to fix — resolved.

See [`accessibility-report.md`](../_bmad-output/test-artifacts/accessibility-report.md).

> **Lesson learned:** Accessibility-first component design during implementation (ARIA attributes, keyboard navigation, screen reader support) meant the final audit only found one issue. Front-loading accessibility into story acceptance criteria pays off — retrofitting it later is far more expensive.

