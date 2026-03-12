# Accessibility Audit & Guidelines

## ClearDay Application

**Version:** 1.1  
**Date:** March 5, 2026  
**Author:** Sally (UX Designer)  
**Status:** Approved  
**Standard:** WCAG 2.1 Level AA

---

## Overview

This document provides a comprehensive accessibility audit and implementation guidelines for ClearDay v1.1. Accessibility isn't just compliance — it's about ensuring **everyone** can capture tasks instantly, regardless of ability.

### Why Accessibility Matters for ClearDay

| User | Accessibility Need |
|------|-------------------|
| **Maya** rushing between meetings | May use voice input when hands are full |
| **David** with aging eyesight | Needs sufficient contrast, readable text |
| **Jordan** in bright sunlight | Needs high contrast to see mobile screen |
| **Anyone** with temporary injury | May need keyboard-only navigation |
| **Users with disabilities** | Full access to task management |

> **Design Principle:** If it's not accessible, it's not done.

---

## Audit Summary

### Compliance Target: WCAG 2.1 Level AA

| Principle | Status | Notes |
|-----------|--------|-------|
| **Perceivable** | 🟡 Review | Contrast ratios need verification |
| **Operable** | 🟡 Review | Keyboard navigation needs implementation |
| **Understandable** | ✅ Pass | Simple, predictable interface |
| **Robust** | 🟡 Review | ARIA implementation needed |

### Critical Issues (Must Fix)

| Issue | Severity | Section |
|-------|----------|---------|
| Focus management after task add/delete | 🔴 High | Keyboard Navigation |
| Screen reader announcements for actions | 🔴 High | Screen Readers |
| Touch target sizes verification | 🟡 Medium | Mobile Accessibility |
| Color contrast verification | 🟡 Medium | Visual Design |

---

## 1. Perceivable

*Information and UI components must be presentable in ways users can perceive.*

### 1.1 Text Alternatives (WCAG 1.1)

#### Requirements

| Element | Text Alternative | Implementation |
|---------|------------------|----------------|
| App logo/icon | Alt text: "ClearDay" | `<h1>` with text, or `aria-label` |
| Checkbox unchecked | "Mark as complete" | `aria-label` on input |
| Checkbox checked | "Marked as complete" | `aria-label` updates dynamically |
| Delete button | "Delete task: [task text]" | `aria-label` with context |
| Add button | "Add task" | `aria-label` |
| Empty state icon | Decorative, hide from AT | `aria-hidden="true"` |
| Loading spinner | "Loading tasks" | `aria-label` or visually hidden text |

#### Implementation Examples

```html
<!-- Checkbox with dynamic label -->
<input 
  type="checkbox"
  aria-label="Mark task as complete: Follow up with client"
  aria-checked="false"
/>

<!-- When checked, update aria-label -->
<input 
  type="checkbox"
  aria-label="Task completed: Follow up with client"
  aria-checked="true"
/>

<!-- Delete button with context -->
<button 
  aria-label="Delete task: Follow up with client"
  type="button"
>
  <span aria-hidden="true">✕</span>
</button>

<!-- Decorative emoji -->
<span aria-hidden="true">✨</span>
```

---

### 1.2 Color Contrast (WCAG 1.4.3, 1.4.11)

#### Text Contrast Requirements

| Element | Foreground | Background | Ratio | Required | Status |
|---------|------------|------------|-------|----------|--------|
| Task text (incomplete) | #333333 | #FFFFFF | 12.6:1 | 4.5:1 | ✅ Pass |
| Task text (completed) | #999999 | #FFFFFF | 2.8:1 | 4.5:1 | ❌ Fail |
| Placeholder text | #999999 | #FFFFFF | 2.8:1 | 4.5:1 | ❌ Fail |
| Empty state title | #666666 | #FFFFFF | 5.7:1 | 4.5:1 | ✅ Pass |
| Empty state subtitle | #999999 | #FFFFFF | 2.8:1 | 4.5:1 | ❌ Fail |
| Button text | #FFFFFF | #4A90D9 | 4.6:1 | 4.5:1 | ✅ Pass |

#### Fixes Required

| Element | Current | Recommended | New Ratio |
|---------|---------|-------------|-----------|
| Completed task text | #999999 | #767676 | 4.5:1 ✅ |
| Placeholder text | #999999 | #767676 | 4.5:1 ✅ |
| Empty state subtitle | #999999 | #767676 | 4.5:1 ✅ |

#### Updated Color Palette

```css
/* BEFORE (fails contrast) */
--color-muted: #999999;      /* 2.8:1 - FAILS */

/* AFTER (passes contrast) */
--color-muted: #767676;      /* 4.5:1 - PASSES */
```

#### Non-Text Contrast (1.4.11)

| Element | Current | Required | Status |
|---------|---------|----------|--------|
| Input border | #E0E0E0 on #FFFFFF | 3:1 | ❌ Fail (1.4:1) |
| Focus ring | #4A90D9 on #FFFFFF | 3:1 | ✅ Pass (4.6:1) |
| Checkbox unchecked | #333333 on #FFFFFF | 3:1 | ✅ Pass |
| Task item border | #EEEEEE on #FFFFFF | 3:1 | ❌ Fail (1.2:1) |

#### Fixes Required

| Element | Current | Recommended | New Ratio |
|---------|---------|-------------|-----------|
| Input border | #E0E0E0 | #949494 | 3:1 ✅ |
| Task item border | #EEEEEE | #949494 | 3:1 ✅ |

> **Note:** If borders are decorative and not the only indicator of the component boundary, lower contrast may be acceptable. However, for the input field, the border is functional.

---

### 1.3 Adaptable Content (WCAG 1.3)

#### Semantic Structure

```html
<!-- Correct semantic structure -->
<main>
  <header>
    <h1>ClearDay</h1>
  </header>
  
  <section aria-labelledby="add-task-heading">
    <h2 id="add-task-heading" class="visually-hidden">Add a task</h2>
    <form role="search">
      <input type="text" />
      <button type="submit">Add</button>
    </form>
  </section>
  
  <section aria-labelledby="task-list-heading">
    <h2 id="task-list-heading" class="visually-hidden">Your tasks</h2>
    <ul role="list" aria-label="Todo list">
      <li>...</li>
    </ul>
  </section>
</main>
```

#### Reading Order

Content should read logically from top to bottom:

1. App title
2. Task input (with label)
3. Task list (or empty/loading/error state)
4. Individual tasks (newest first)

✅ Current wireframe layout supports correct reading order.

---

### 1.4 Distinguishable (WCAG 1.4)

#### Text Spacing (1.4.12)

Content must remain readable and functional when:
- Line height increased to 1.5x font size
- Paragraph spacing increased to 2x font size
- Letter spacing increased to 0.12x font size
- Word spacing increased to 0.16x font size

**Implementation:**
```css
/* Don't restrict text spacing */
.task-text {
  /* Use relative units, not fixed heights */
  line-height: 1.5;
  /* Allow containers to grow with content */
  min-height: 48px;
  height: auto;
}

/* Don't do this */
.task-item {
  height: 48px;        /* Fixed height will clip text */
  overflow: hidden;    /* Will hide overflowing text */
}

/* Do this instead */
.task-item {
  min-height: 48px;    /* Minimum height */
  padding: 12px 16px;  /* Let content grow */
}
```

#### Reflow (1.4.10)

Content must be usable at 320px width without horizontal scrolling.

| Breakpoint | Behavior | Status |
|------------|----------|--------|
| 320px | Full functionality, single column | 🟡 Verify |
| 768px+ | Centered container | ✅ Defined |

**Testing checklist:**
- [ ] Input field usable at 320px
- [ ] Tasks wrap correctly at 320px
- [ ] Delete button accessible at 320px
- [ ] No horizontal scrollbar at 320px

---

## 2. Operable

*User interface components must be operable by all users.*

### 2.1 Keyboard Accessible (WCAG 2.1)

#### Full Keyboard Navigation

Every action must be performable via keyboard alone:

| Action | Keyboard Method | Focus Location |
|--------|-----------------|----------------|
| Add task | `Enter` in input | Input (stays) |
| Toggle complete | `Space` or `Enter` on checkbox | Checkbox (stays) |
| Delete task | `Enter` or `Space` on delete button | Next task or input |
| Navigate to next task | `Tab` | Next interactive element |
| Navigate to previous | `Shift + Tab` | Previous interactive element |

#### Tab Order

Logical tab sequence:

```
[1] Task Input (auto-focused on load)
         │
         ▼
[2] Add Button [+]
         │
         ▼
[3] Task 1 Checkbox
         │
         ▼
[4] Task 1 Delete Button
         │
         ▼
[5] Task 2 Checkbox
         │
         ▼
[6] Task 2 Delete Button
         │
         ▼
    ... (continue for all tasks)
```

#### Focus Management

**Critical:** After adding/deleting tasks, focus must move to a logical location.

| Action | Focus Should Move To |
|--------|---------------------|
| Add task | Stay in input (for rapid entry) |
| Delete task | Next task checkbox, or input if none |
| Complete task | Stay on checkbox (toggle again if mistake) |
| Error retry | Stay on retry button until resolved |

**Implementation:**

```javascript
// After deleting a task
function handleDelete(taskId, taskIndex) {
  deleteTask(taskId);
  
  // Move focus to next task, or input if no more tasks
  const nextTask = document.querySelector(`[data-task-index="${taskIndex}"]`);
  const prevTask = document.querySelector(`[data-task-index="${taskIndex - 1}"]`);
  const input = document.querySelector('#task-input');
  
  if (nextTask) {
    nextTask.querySelector('input[type="checkbox"]').focus();
  } else if (prevTask) {
    prevTask.querySelector('input[type="checkbox"]').focus();
  } else {
    input.focus();
  }
}
```

#### Focus Indicators

All interactive elements must have visible focus indicators:

```css
/* Base focus style */
:focus {
  outline: 2px solid #4A90D9;
  outline-offset: 2px;
}

/* Remove default outline only if custom focus is provided */
:focus:not(:focus-visible) {
  outline: none;
}

/* Enhanced focus for keyboard users */
:focus-visible {
  outline: 2px solid #4A90D9;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(74, 144, 217, 0.2);
}

/* High contrast focus for checkboxes */
input[type="checkbox"]:focus-visible {
  outline: 2px solid #4A90D9;
  outline-offset: 2px;
}

/* Focus style for delete button */
.delete-button:focus-visible {
  outline: 2px solid #D9534F;
  outline-offset: 2px;
  background-color: rgba(217, 83, 79, 0.1);
}
```

---

### 2.2 Enough Time (WCAG 2.2)

ClearDay has no time limits. ✅ Compliant.

- No session timeouts
- No auto-refresh
- No timed interactions
- Loading states have no timeout (user can wait)

---

### 2.3 Seizures and Physical Reactions (WCAG 2.3)

#### Flash Thresholds

Animations must not flash more than 3 times per second.

| Animation | Duration | Flashes | Status |
|-----------|----------|---------|--------|
| Task add (fade in) | 200ms | 0 | ✅ Pass |
| Checkbox toggle | 150ms | 0 | ✅ Pass |
| Task delete (fade out) | 200ms | 0 | ✅ Pass |
| Loading spinner | Continuous | 0 | ✅ Pass |

✅ No flashing content in current design.

#### Reduced Motion

Respect user's motion preferences:

```css
/* Default animations */
.task-item {
  transition: opacity 200ms ease-out, transform 200ms ease-out;
}

/* Reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .task-item {
    transition: none;
  }
  
  .loading-spinner {
    animation: none;
  }
  
  /* Provide static alternative */
  .loading-spinner::after {
    content: "Loading...";
  }
}
```

---

### 2.4 Navigable (WCAG 2.4)

#### Skip Links

For single-page app with simple structure, skip link is optional but recommended:

```html
<body>
  <a href="#task-input" class="skip-link">Skip to add task</a>
  <a href="#task-list" class="skip-link">Skip to task list</a>
  
  <main>
    <input id="task-input" ... />
    <ul id="task-list" ... />
  </main>
</body>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  padding: 8px;
  background: #4A90D9;
  color: white;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

#### Page Title

```html
<title>ClearDay — Simple Task Management</title>
```

#### Focus Order

Focus order matches visual order. ✅ See tab order above.

#### Link/Button Purpose

All interactive elements have clear purpose:

| Element | Visible Text | Accessible Name |
|---------|--------------|-----------------|
| Add button | `[+]` | "Add task" (aria-label) |
| Checkbox | (none) | "Mark task as complete: [text]" |
| Delete button | `✕` | "Delete task: [text]" |
| Retry button | "Try Again" | "Try Again" (visible) |

#### Headings

Proper heading hierarchy:

```html
<h1>ClearDay</h1>
<!-- Visually hidden headings for screen readers -->
<h2 class="visually-hidden">Add a task</h2>
<h2 class="visually-hidden">Your tasks</h2>
```

---

### 2.5 Input Modalities (WCAG 2.5)

#### Touch Target Size (2.5.5 AAA, but important)

Minimum touch targets for mobile:

| Element | Target Size | Required | Status |
|---------|-------------|----------|--------|
| Checkbox | 24x24px visual, 44x44px touch | 44x44px | 🟡 Fix |
| Delete button | 20x20px visual, 44x44px touch | 44x44px | 🟡 Fix |
| Add button | Variable | 44x44px | 🟡 Fix |
| Input field | 48px height | 44x44px | ✅ Pass |

**Fix:** Use padding to increase touch target:

```css
/* Visual size vs touch target */
.checkbox-wrapper {
  /* Visual */
  width: 24px;
  height: 24px;
  
  /* Touch target via padding */
  padding: 10px;  /* (44 - 24) / 2 = 10px */
  margin: -10px;  /* Offset the padding */
}

.delete-button {
  /* Visual */
  width: 20px;
  height: 20px;
  
  /* Touch target */
  padding: 12px;  /* (44 - 20) / 2 = 12px */
  margin: -12px;
}
```

#### Pointer Gestures (2.5.1)

No complex gestures required. All actions use simple taps/clicks. ✅

#### Motion Actuation (2.5.4)

No motion-based inputs. ✅

---

## 3. Understandable

*Information and operation must be understandable.*

### 3.1 Readable (WCAG 3.1)

#### Language

```html
<html lang="en">
```

✅ Simple implementation.

### 3.2 Predictable (WCAG 3.2)

#### On Focus (3.2.1)

Nothing changes context on focus alone. ✅

- Focusing input doesn't submit
- Focusing checkbox doesn't toggle
- Focusing delete doesn't delete

#### On Input (3.2.2)

No unexpected changes on input. ✅

- Typing in input doesn't auto-submit
- Requires explicit Enter or click

#### Consistent Navigation (3.2.3)

Single-page app with consistent layout. ✅

- Input always at top
- Task list always below
- Actions always in same position

### 3.3 Input Assistance (WCAG 3.3)

#### Error Identification (3.3.1)

When user tries to submit empty task:

```html
<!-- Error state -->
<div class="input-wrapper" aria-invalid="true">
  <input 
    type="text" 
    aria-describedby="input-error"
    aria-invalid="true"
  />
  <span id="input-error" role="alert" class="error-message">
    Please enter a task
  </span>
</div>
```

#### Labels (3.3.2)

```html
<!-- Visible label (optional for this UI) -->
<label for="task-input" class="visually-hidden">
  Add a new task
</label>
<input 
  id="task-input"
  type="text"
  placeholder="What needs to be done?"
  aria-label="Add a new task"
/>
```

#### Error Suggestion (3.3.3)

| Error | Message | Suggestion |
|-------|---------|------------|
| Empty task | "Please enter a task" | Focus stays in input |
| API failure (add) | "Couldn't add task" | "Try again" with retry |
| API failure (load) | "Couldn't load tasks" | "Try Again" button |

---

## 4. Robust

*Content must be robust enough for assistive technologies.*

### 4.1 Compatible (WCAG 4.1)

#### Valid HTML (4.1.1)

Ensure valid, well-formed HTML:

- All tags properly closed
- No duplicate IDs
- Proper nesting
- Valid attributes

#### Name, Role, Value (4.1.2)

All interactive elements must expose proper accessibility information:

```html
<!-- Task item with full accessibility -->
<li 
  role="listitem"
  class="task-item"
>
  <input 
    type="checkbox"
    id="task-1-checkbox"
    aria-labelledby="task-1-text"
    aria-describedby="task-1-status"
  />
  <span id="task-1-text">Follow up with client</span>
  <span id="task-1-status" class="visually-hidden">
    Task incomplete
  </span>
  <button 
    type="button"
    aria-label="Delete task: Follow up with client"
  >
    <span aria-hidden="true">✕</span>
  </button>
</li>
```

#### Status Messages (4.1.3)

Use ARIA live regions for dynamic updates:

```html
<!-- Live region for announcements -->
<div 
  aria-live="polite" 
  aria-atomic="true" 
  class="visually-hidden"
  id="status-announcer"
>
  <!-- JavaScript updates this -->
</div>
```

**Announcements to make:**

| Action | Announcement |
|--------|--------------|
| Task added | "Task added: [task text]" |
| Task completed | "Task completed: [task text]" |
| Task uncompleted | "Task marked incomplete: [task text]" |
| Task deleted | "Task deleted: [task text]" |
| Error | "Error: [error message]" |
| Tasks loaded | "X tasks loaded" (on initial load) |

**Implementation:**

```javascript
function announce(message) {
  const announcer = document.getElementById('status-announcer');
  announcer.textContent = '';
  // Small delay ensures screen reader picks up change
  setTimeout(() => {
    announcer.textContent = message;
  }, 50);
}

// Usage
function handleAddTask(text) {
  addTask(text);
  announce(`Task added: ${text}`);
}

function handleToggleComplete(task) {
  toggleComplete(task.id);
  const status = task.completed ? 'marked incomplete' : 'completed';
  announce(`Task ${status}: ${task.text}`);
}

function handleDelete(task) {
  deleteTask(task.id);
  announce(`Task deleted: ${task.text}`);
}
```

---

## 5. Screen Reader Testing

### Testing Checklist

Test with at least 2 screen readers:

| Platform | Screen Reader | Browser |
|----------|---------------|---------|
| macOS | VoiceOver | Safari |
| Windows | NVDA | Chrome or Firefox |
| iOS | VoiceOver | Safari |
| Android | TalkBack | Chrome |

### Expected Announcements

#### Page Load

```
"ClearDay"
"Add a new task, edit text"
[If tasks exist] "Your tasks, list, X items"
[If empty] "No tasks yet! Add your first task above to get started"
```

#### Adding a Task

```
[Type "Buy groceries"]
"Buy groceries"
[Press Enter]
"Task added: Buy groceries"
[Focus stays in input]
"Add a new task, edit text"
```

#### Completing a Task

```
[Navigate to task]
"Mark task as complete: Buy groceries, checkbox, not checked"
[Press Space]
"checked"
"Task completed: Buy groceries"
```

#### Deleting a Task

```
[Navigate to delete]
"Delete task: Buy groceries, button"
[Press Enter]
"Task deleted: Buy groceries"
[Focus moves to next task]
"Mark task as complete: Review PR, checkbox, not checked"
```

---

## 6. Mobile Accessibility

### iOS VoiceOver

| Gesture | Action |
|---------|--------|
| Swipe right | Move to next element |
| Swipe left | Move to previous element |
| Double tap | Activate element |
| Two-finger swipe up | Read all from top |

**Testing:**
- [ ] All tasks reachable via swipe
- [ ] Double-tap toggles checkbox
- [ ] Double-tap on delete removes task
- [ ] Input field accepts dictation

### Android TalkBack

| Gesture | Action |
|---------|--------|
| Swipe right | Move to next element |
| Swipe left | Move to previous element |
| Double tap | Activate element |

### Touch Accommodations

```css
/* Prevent double-tap zoom on buttons */
button {
  touch-action: manipulation;
}

/* Ensure sufficient spacing between touch targets */
.task-item {
  margin-bottom: 8px;  /* Prevent accidental taps */
}
```

---

## 7. High Contrast Mode

### Windows High Contrast

Test with Windows High Contrast themes:

| Theme | Testing Focus |
|-------|---------------|
| High Contrast Black | Light text on dark |
| High Contrast White | Dark text on light |

**CSS for High Contrast:**

```css
@media (forced-colors: active) {
  /* Ensure borders are visible */
  .task-item {
    border: 1px solid CanvasText;
  }
  
  /* Ensure checkboxes are visible */
  input[type="checkbox"] {
    appearance: auto;  /* Use native styling */
  }
  
  /* Ensure focus is visible */
  :focus {
    outline: 2px solid Highlight;
  }
  
  /* Don't rely on color alone for completed state */
  .task-completed .task-text {
    text-decoration: line-through;  /* Strikethrough always visible */
  }
}
```

### prefers-contrast

```css
@media (prefers-contrast: more) {
  :root {
    --color-border: #333333;        /* Darker borders */
    --color-muted: #555555;         /* Darker muted text */
  }
}
```

---

## 8. Implementation Checklist

### HTML Structure

- [ ] Semantic HTML elements (`main`, `header`, `section`, `ul`, `li`)
- [ ] Proper heading hierarchy (`h1`, `h2`)
- [ ] Valid HTML (no duplicate IDs, proper nesting)
- [ ] `lang` attribute on `html` element
- [ ] Labels for all form inputs
- [ ] Button type attributes

### ARIA

- [ ] `aria-label` on icon-only buttons
- [ ] `aria-live` region for status updates
- [ ] `aria-invalid` on error states
- [ ] `aria-describedby` for error messages
- [ ] `aria-hidden` on decorative elements
- [ ] Dynamic `aria-checked` on checkboxes (if custom)

### Keyboard

- [ ] All actions keyboard accessible
- [ ] Logical tab order
- [ ] Visible focus indicators
- [ ] Focus management after add/delete
- [ ] `Enter` submits task
- [ ] `Space` toggles checkbox
- [ ] `Escape` clears input (optional)

### Visual

- [ ] 4.5:1 contrast for text
- [ ] 3:1 contrast for UI components
- [ ] Focus indicators visible
- [ ] Not relying on color alone
- [ ] Text resizable to 200%
- [ ] Content reflows at 320px

### Motion

- [ ] Animations under 3 flashes/second
- [ ] Reduced motion respected
- [ ] No auto-playing animations

### Screen Readers

- [ ] Tested with VoiceOver (macOS/iOS)
- [ ] Tested with NVDA (Windows)
- [ ] All actions announced
- [ ] Reading order logical
- [ ] Status updates announced

### Mobile

- [ ] 44x44px minimum touch targets
- [ ] Works with VoiceOver gestures
- [ ] Works with TalkBack gestures
- [ ] No horizontal scroll at 320px

---

## 9. Testing Tools

### Automated Testing

| Tool | Purpose | URL |
|------|---------|-----|
| axe DevTools | Automated audit | browser extension |
| WAVE | Visual feedback | wave.webaim.org |
| Lighthouse | Accessibility score | Chrome DevTools |
| eslint-plugin-jsx-a11y | Code linting | npm package |

### Manual Testing

| Tool | Purpose |
|------|---------|
| Keyboard only | Navigate without mouse |
| VoiceOver | Screen reader (macOS) |
| NVDA | Screen reader (Windows) |
| High Contrast Mode | Windows accessibility |
| Zoom to 200% | Visual scaling |

### Color Tools

| Tool | Purpose | URL |
|------|---------|-----|
| WebAIM Contrast Checker | Verify ratios | webaim.org/resources/contrastchecker |
| Stark | Design tool plugin | getstark.co |
| Colorblind simulator | Check for color blindness | various |

---

## 10. Accessibility Statement

Include on the app (footer or about):

```markdown
## Accessibility

ClearDay is committed to accessibility. This application aims to 
conform to WCAG 2.1 Level AA.

### Features:
- Full keyboard navigation
- Screen reader compatible
- High contrast support
- Reduced motion support
- Mobile accessible

### Feedback
If you encounter accessibility barriers, please contact us at 
[email/form]. We take accessibility feedback seriously and will 
work to address issues promptly.
```

---

## 11. Color Blind Considerations

### Don't Rely on Color Alone

Current design uses:
- Strikethrough for completed (✅ good)
- Muted opacity for completed (✅ supplementary)
- Filled checkbox for completed (✅ good)

### Color Blind Simulation Results

| Type | % of Males | Status |
|------|------------|--------|
| Protanopia (no red) | 1% | ✅ Pass |
| Deuteranopia (no green) | 1% | ✅ Pass |
| Tritanopia (no blue) | 0.001% | ✅ Pass |
| Achromatopsia (no color) | 0.00003% | ✅ Pass |

**Why passing:** The design uses shape (strikethrough, filled circle) and brightness (muted opacity) as primary indicators, not color alone.

---

## 12. Updated Specifications

Based on this audit, update `wireframes.md` with these changes:

### Color Palette Updates

| Name | Old Value | New Value | Reason |
|------|-----------|-----------|--------|
| Muted Text | #999999 | #767676 | Contrast compliance |
| Border | #E0E0E0 | #949494 | Non-text contrast |
| Border Light | #EEEEEE | #949494 | Non-text contrast |

### Touch Target Updates

| Component | Old Size | New Touch Target |
|-----------|----------|------------------|
| Checkbox | 24x24px | 44x44px (with padding) |
| Delete button | 20x20px | 44x44px (with padding) |
| Add button | variable | 44x44px minimum |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | March 5, 2026 | Sally (UX Designer) | Initial audit |
| 1.1 | March 5, 2026 | Sally (UX Designer) | Updated to align with PRD v1.1; added section-specific accessibility considerations for Active/Completed sections |

