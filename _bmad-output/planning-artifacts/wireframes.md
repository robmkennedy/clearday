# Wireframes & UI Specifications

## Clearday Application

**Version:** 1.1  
**Date:** March 5, 2026  
**Author:** Sally (UX Designer)  
**Status:** Approved

---

## Overview

This document contains low-fidelity wireframes and UI specifications for Clearday v1.0. These wireframes are designed to fulfill the jobs identified in `jobs-to-be-done.md`, particularly:

- **F1:** Capture tasks instantly (< 10 seconds)
- **F2:** See all tasks at a glance
- **F3:** Mark tasks complete
- **F4:** Delete irrelevant tasks
- **E1-E4:** Feel in control, relieved, accomplished, calm

### Design Principles (from Research)

| Principle | Application |
|-----------|-------------|
| ⚡ **Speed** | Input visible immediately, Enter to submit |
| 🎯 **Focus** | One purpose, minimal UI elements |
| 🧘 **Calm** | Generous whitespace, no aggressive colors |
| 📱 **Responsive** | Works beautifully on mobile and desktop |
| ✨ **Polish** | Subtle animations, satisfying interactions |

---

## Information Architecture

### Screen Inventory

Clearday v1.0 has exactly **one screen** with multiple states:

```
┌─────────────────────────────────────┐
│           Clearday App             │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │      Task Input Area        │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │    Active Tasks Section     │   │
│  │    "Tasks" heading          │   │
│  │  • Loading State            │   │
│  │  • Empty State              │   │
│  │  • Populated State          │   │
│  │  • Error State              │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Completed Tasks Section   │   │
│  │   "Completed" heading       │   │
│  │  • Empty State (or hidden)  │   │
│  │  • Populated State          │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

---

## Wireframe 1: Desktop — Empty State

The first thing a new user sees. Must communicate purpose instantly.

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│                                                                            │
│                                                                            │
│                              ╭──────────────────────────────────────╮      │
│                              │                                      │      │
│                              │            📝 Clearday              │      │
│                              │                                      │      │
│                              ╰──────────────────────────────────────╯      │
│                                                                            │
│                                                                            │
│         ┌────────────────────────────────────────────────────────┐        │
│         │  ○  What needs to be done?                         [+] │        │
│         └────────────────────────────────────────────────────────┘        │
│                                                                            │
│                                                                            │
│                                                                            │
│                         ┌─────────────────────────┐                        │
│                         │                         │                        │
│                         │    ✨ No tasks yet!     │                        │
│                         │                         │                        │
│                         │   Add your first task   │                        │
│                         │   above to get started  │                        │
│                         │                         │                        │
│                         └─────────────────────────┘                        │
│                                                                            │
│                                                                            │
│                                                                            │
│                                                                            │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Specifications

| Element | Specification |
|---------|---------------|
| **Header** | App name centered, subtle, not dominant |
| **Input Field** | Prominent, centered, placeholder text |
| **Add Button** | `[+]` icon, secondary to Enter key |
| **Empty State** | Friendly, encouraging, not sad |
| **Overall** | Generous whitespace, calm feeling |

### Interaction Notes

- Input field has focus on page load
- Pressing Enter adds task (primary action)
- Clicking `[+]` also adds task (secondary)
- Empty state disappears when first task added

---

## Wireframe 2: Desktop — Populated State

The primary view users will see during daily use. Tasks are organized into two sections.

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│                                                                            │
│                              ╭──────────────────────────────────────╮      │
│                              │            📝 Clearday              │      │
│                              ╰──────────────────────────────────────╯      │
│                                                                            │
│         ┌────────────────────────────────────────────────────────┐        │
│         │  ○  What needs to be done?                         [+] │        │
│         └────────────────────────────────────────────────────────┘        │
│                                                                            │
│         ┌────────────────────────────────────────────────────────┐        │
│         │  Tasks                                                 │        │
│         ├────────────────────────────────────────────────────────┤        │
│         │                                                        │        │
│         │  ┌────────────────────────────────────────────────┐   │        │
│         │  │  ○  Follow up with client about Q2 proposal  ✕ │   │        │
│         │  └────────────────────────────────────────────────┘   │        │
│         │                                                        │        │
│         │  ┌────────────────────────────────────────────────┐   │        │
│         │  │  ○  Review PR #234                            ✕ │   │        │
│         │  └────────────────────────────────────────────────┘   │        │
│         │                                                        │        │
│         │  ┌────────────────────────────────────────────────┐   │        │
│         │  │  ○  Book dentist appointment                  ✕ │   │        │
│         │  └────────────────────────────────────────────────┘   │        │
│         │                                                        │        │
│         └────────────────────────────────────────────────────────┘        │
│                                                                            │
│         ┌────────────────────────────────────────────────────────┐        │
│         │  Completed                                             │        │
│         ├────────────────────────────────────────────────────────┤        │
│         │                                                        │        │
│         │  ┌────────────────────────────────────────────────┐   │        │
│         │  │  ●  Send deck to Sarah ─────────────────────  ✕ │   │        │
│         │  └────────────────────────────────────────────────┘   │        │
│         │                                                        │        │
│         │  ┌────────────────────────────────────────────────┐   │        │
│         │  │  ●  Call mom ───────────────────────────────  ✕ │   │        │
│         │  └────────────────────────────────────────────────┘   │        │
│         │                                                        │        │
│         └────────────────────────────────────────────────────────┘        │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Specifications

| Element | Specification |
|---------|---------------|
| **Section Header** | "Tasks" and "Completed" labels, subtle but clear |
| **Task Row** | Clear container, consistent height |
| **Checkbox** | `○` unchecked, `●` checked, left-aligned |
| **Task Text** | Primary content, good readability |
| **Delete Button** | `✕` right-aligned, subtle until hover |
| **Completed Task** | Strikethrough text, muted color |
| **Task Order** | Newest first within each section (per PRD) |
| **Section Behavior** | Completing a task moves it to Completed section |

### Visual Hierarchy

```
PROMINENCE LEVELS:

[HIGH]     ┌──────────────────┐
           │  Active Section  │  ← Full contrast, prominent, displayed first
           │  (Tasks)         │
           └──────────────────┘
             
[MEDIUM]   ┌──────────────────┐
           │  Input Field      │  ← Ready for action
           └──────────────────┘

[LOW]      ┌──────────────────┐
           │  Completed Section│  ← Muted header, strikethrough tasks
           └──────────────────┘

[SUBTLE]   ┌──────────────────┐
           │  Delete buttons   │  ← Appear on hover/focus
           │  App Header       │
           └──────────────────┘
```

---

## Wireframe 3: Desktop — Task Hover State

Shows delete affordance on interaction.

```
         ┌────────────────────────────────────────────────────┐
         │  ○  Follow up with client about Q2 proposal  [✕]  │ ← Hover state
         └────────────────────────────────────────────────────┘
                                                          │
                                                          ▼
                                                    Delete button
                                                    becomes visible
                                                    and clickable
```

### Interaction States

| State | Checkbox | Text | Delete |
|-------|----------|------|--------|
| **Default** | `○` visible | Normal | Hidden or subtle |
| **Hover** | `○` visible | Normal | Visible `[✕]` |
| **Checkbox Hover** | `○` highlighted | Normal | Visible |
| **Completed** | `●` filled | Strikethrough, muted | Visible |
| **Delete Hover** | — | — | Highlighted, red tint |

---

## Wireframe 4: Desktop — Loading State

Shown briefly while fetching tasks.

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│                              ╭──────────────────────────────────────╮      │
│                              │            📝 Clearday              │      │
│                              ╰──────────────────────────────────────╯      │
│                                                                            │
│         ┌────────────────────────────────────────────────────────┐        │
│         │  ○  What needs to be done?                         [+] │        │
│         └────────────────────────────────────────────────────────┘        │
│                                                                            │
│                                                                            │
│                                                                            │
│                              ┌─────────────┐                               │
│                              │             │                               │
│                              │   Loading   │                               │
│                              │     ···     │                               │
│                              │             │                               │
│                              └─────────────┘                               │
│                                                                            │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Specifications

| Element | Specification |
|---------|---------------|
| **Spinner** | Subtle, not aggressive |
| **Duration** | Should display < 2 seconds |
| **Input** | Still visible and functional during load |

**Note:** Users can add tasks even while previous tasks are loading. Optimistic UI.

---

## Wireframe 5: Desktop — Error State

Shown when API fails to load tasks.

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│                              ╭──────────────────────────────────────╮      │
│                              │            📝 Clearday              │      │
│                              ╰──────────────────────────────────────╯      │
│                                                                            │
│         ┌────────────────────────────────────────────────────────┐        │
│         │  ○  What needs to be done?                         [+] │        │
│         └────────────────────────────────────────────────────────┘        │
│                                                                            │
│                                                                            │
│                       ┌───────────────────────────┐                        │
│                       │                           │                        │
│                       │   ⚠️  Couldn't load tasks  │                        │
│                       │                           │                        │
│                       │   Something went wrong.   │                        │
│                       │                           │                        │
│                       │      [ Try Again ]        │                        │
│                       │                           │                        │
│                       └───────────────────────────┘                        │
│                                                                            │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Specifications

| Element | Specification |
|---------|---------------|
| **Icon** | Warning, but not alarming (yellow, not red) |
| **Message** | Friendly, not technical |
| **Action** | Clear "Try Again" button |
| **Tone** | Calm, not panic-inducing |

---

## Wireframe 6: Mobile — Empty State

Responsive design for phones (< 768px).

```
┌─────────────────────────────┐
│                             │
│       📝 Clearday          │
│                             │
├─────────────────────────────┤
│                             │
│ ┌─────────────────────────┐ │
│ │ ○ What needs to be done?│ │
│ │                     [+] │ │
│ └─────────────────────────┘ │
│                             │
│                             │
│                             │
│   ┌─────────────────────┐   │
│   │                     │   │
│   │   ✨ No tasks yet!  │   │
│   │                     │   │
│   │  Add your first     │   │
│   │  task above         │   │
│   │                     │   │
│   └─────────────────────┘   │
│                             │
│                             │
│                             │
│                             │
│                             │
└─────────────────────────────┘
```

### Mobile Specifications

| Element | Specification |
|---------|---------------|
| **Layout** | Single column, full-width |
| **Input** | Full width minus padding |
| **Touch Targets** | Minimum 44x44px |
| **Typography** | 16px minimum (prevent iOS zoom) |
| **Padding** | 16px horizontal |

---

## Wireframe 7: Mobile — Populated State

```
┌─────────────────────────────┐
│       📝 Clearday          │
├─────────────────────────────┤
│                             │
│ ┌─────────────────────────┐ │
│ │ ○ What needs to be done?│ │
│ │                     [+] │ │
│ └─────────────────────────┘ │
│                             │
│  Tasks                      │
│ ┌─────────────────────────┐ │
│ │ ○ Follow up with client │ │
│ │   about Q2 proposal   ✕ │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ ○ Review PR #234      ✕ │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ ○ Book dentist        ✕ │ │
│ └─────────────────────────┘ │
│                             │
│  Completed                  │
│ ┌─────────────────────────┐ │
│ │ ● Send deck to Sarah  ✕ │ │
│ │   ─────────────────     │ │
│ └─────────────────────────┘ │
│                             │
└─────────────────────────────┘
```

### Mobile Interaction Notes

- Tap checkbox to toggle complete
- Completing a task moves it from Tasks section to Completed section
- Uncompleting a task moves it back to Tasks section
- Delete button always visible (no hover on mobile)
- Task text can wrap to multiple lines
- Swipe-to-delete NOT in v1.0 (keep simple)
- Section headers are subtle but visible

---

## Wireframe 8: Mobile — Input Focused

Shows keyboard state with input at top for thumb access.

```
┌─────────────────────────────┐
│       📝 Clearday          │
├─────────────────────────────┤
│                             │
│ ┌─────────────────────────┐ │
│ │ Buy groceries      [+]  │ │  ← User typing
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ ○ Follow up with client │ │
│ │   about Q2 proposal   ✕ │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ ○ Review PR #234      ✕ │ │
│ └─────────────────────────┘ │
│                             │
├─────────────────────────────┤
│┌───────────────────────────┐│
││ Q W E R T Y U I O P       ││
││ A S D F G H J K L         ││
││ Z X C V B N M ⌫          ││
││ 123  🌐   [  space  ]  ⏎  ││
│└───────────────────────────┘│
└─────────────────────────────┘
```

### Mobile Input Behavior

| Behavior | Specification |
|----------|---------------|
| **Keyboard** | Appears when input focused |
| **Submit** | Return/Enter key adds task |
| **Add Button** | Also works as submit |
| **After Submit** | Keyboard stays open, input clears |

---

## Component Specifications

### 1. Task Input Component

```
┌──────────────────────────────────────────────────────────────┐
│  ○  What needs to be done?                               [+] │
└──────────────────────────────────────────────────────────────┘
     │                                                      │
     │                                                      │
     ▼                                                      ▼
Decorative                                            Submit Button
checkbox icon                                         (secondary action)
(not functional)

STATES:
┌──────────────────────────────────────────────────────────────┐
│ Default:  ○  What needs to be done?                     [+]  │
├──────────────────────────────────────────────────────────────┤
│ Focused:  ○  |                                          [+]  │  ← cursor
├──────────────────────────────────────────────────────────────┤
│ Typing:   ○  Buy groceries|                             [+]  │
├──────────────────────────────────────────────────────────────┤
│ Error:    ○  |                                          [+]  │
│           └── "Please enter a task"                          │
└──────────────────────────────────────────────────────────────┘
```

**Specifications:**

| Property | Value |
|----------|-------|
| Height | 48px (touch-friendly) |
| Border | 1px solid #949494 |
| Border Radius | 8px |
| Background | White |
| Font Size | 16px |
| Placeholder Color | #999999 |
| Focus Border | 2px solid #4A90D9 |
| Padding | 12px 16px |

---

### 2. Task Item Component

```
┌────────────────────────────────────────────────────────────┐
│  ○  Task description text goes here                    ✕   │
└────────────────────────────────────────────────────────────┘
  │                    │                                  │
  │                    │                                  │
  ▼                    ▼                                  ▼
Checkbox            Task Text                        Delete Button
(interactive)       (primary content)                (destructive)
```

**States:**

```
INCOMPLETE (default):
┌────────────────────────────────────────────────────────────┐
│  ○  Follow up with client about Q2 proposal            ✕   │
└────────────────────────────────────────────────────────────┘
    │
    └── Empty circle, full opacity text

INCOMPLETE (hover):
┌────────────────────────────────────────────────────────────┐
│  ◉  Follow up with client about Q2 proposal           [✕]  │
└────────────────────────────────────────────────────────────┘
    │                                                     │
    └── Checkbox highlight                                └── Delete visible

COMPLETED:
┌────────────────────────────────────────────────────────────┐
│  ●  Follow up with client about Q2 proposal            ✕   │
│     ─────────────────────────────────────                  │
└────────────────────────────────────────────────────────────┘
    │            │
    │            └── Strikethrough, muted opacity (50%)
    └── Filled circle
```

**Specifications:**

| Property | Incomplete | Completed |
|----------|------------|-----------|
| Text Color | #333333 | #999999 |
| Text Decoration | None | Line-through |
| Checkbox | `○` | `●` |
| Background | White | White |
| Opacity | 100% | 70% |

| Property | Value |
|----------|-------|
| Height | Min 48px (grows with content) |
| Padding | 12px 16px |
| Border | 1px solid #949494 |
| Border Radius | 6px |
| Margin Bottom | 8px |
| Checkbox Size | 24x24px visual, 44x44px touch target |
| Delete Icon | 20x20px visual, 44x44px touch target |

> **Accessibility Note:** Touch targets use padding to achieve 44x44px minimum while keeping visual elements smaller.

---

### 3. Section Header Component

```
         ┌────────────────────────────────────────────────────────┐
         │  Tasks                                                 │
         ├────────────────────────────────────────────────────────┤

         ┌────────────────────────────────────────────────────────┐
         │  Completed                                             │
         ├────────────────────────────────────────────────────────┤
```

**Specifications:**

| Property | Active Section | Completed Section |
|----------|----------------|-------------------|
| Text | "Tasks" | "Completed" |
| Font Size | 14px | 14px |
| Font Weight | 600 | 500 |
| Text Color | #333333 | #666666 |
| Border Bottom | 1px solid #E0E0E0 | 1px solid #E0E0E0 |
| Padding | 8px 0 | 8px 0 |
| Margin Top | 16px | 24px |

**Behavior:**

| Scenario | Active Section | Completed Section |
|----------|----------------|-------------------|
| **Both have tasks** | Visible with tasks | Visible with tasks |
| **No active tasks** | Show empty state inside | Visible if has completed tasks |
| **No completed tasks** | Visible with tasks | Hidden entirely |
| **No tasks at all** | Global empty state shown | Hidden |

---

### 4. Empty State Component

```
         ┌─────────────────────────┐
         │                         │
         │    ✨ No tasks yet!     │
         │                         │
         │   Add your first task   │
         │   above to get started  │
         │                         │
         └─────────────────────────┘
```

**Specifications:**

| Property | Value |
|----------|-------|
| Icon | ✨ or similar friendly emoji |
| Title | "No tasks yet!" — 18px, #666666 |
| Subtitle | Secondary text — 14px, #999999 |
| Alignment | Center |
| Margin Top | 48px |

**Tone:** Encouraging, not sad or empty.

---

### 5. Loading State Component

```
              ┌─────────────┐
              │             │
              │   Loading   │
              │     ···     │
              │             │
              └─────────────┘
```

**Specifications:**

| Property | Value |
|----------|-------|
| Spinner | Subtle, not aggressive |
| Text | "Loading..." — 14px, #999999 |
| Animation | Gentle pulse or dots |
| Alignment | Center |

---

### 6. Error State Component

```
         ┌───────────────────────────┐
         │                           │
         │   ⚠️  Couldn't load tasks  │
         │                           │
         │   Something went wrong.   │
         │                           │
         │      [ Try Again ]        │
         │                           │
         └───────────────────────────┘
```

**Specifications:**

| Property | Value |
|----------|-------|
| Icon | ⚠️ Warning (yellow/amber) |
| Title | "Couldn't load tasks" — 18px, #666666 |
| Subtitle | Friendly error — 14px, #999999 |
| Button | "Try Again" — Primary action |
| Button Style | Solid, brand color |

---

## Color Palette

### Primary Colors

| Name | Hex | Usage | Contrast |
|------|-----|-------|----------|
| **Background** | `#FFFFFF` | Page background | — |
| **Surface** | `#FAFAFA` | Task list container | — |
| **Primary Text** | `#333333` | Task text, headings | 12.6:1 ✅ |
| **Secondary Text** | `#666666` | Subtitles, labels | 5.7:1 ✅ |
| **Muted Text** | `#767676` | Completed tasks, placeholders | 4.5:1 ✅ |
| **Border** | `#949494` | Input borders | 3:1 ✅ |
| **Border Light** | `#949494` | Task item borders | 3:1 ✅ |

> **Note:** Colors updated per accessibility audit to meet WCAG 2.1 AA contrast requirements.

### Accent Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Focus Blue** | `#4A90D9` | Focus states, primary buttons |
| **Success Green** | `#5CB85C` | Checkbox checked (optional) |
| **Delete Red** | `#D9534F` | Delete hover state |
| **Warning Yellow** | `#F0AD4E` | Error state icon |

### Color Philosophy

> **Calm over urgency.** No aggressive reds for incomplete tasks. No anxiety-inducing colors. The palette is neutral with subtle accents.

---

## Theme Toggle Component

### Visual Design

```
LIGHT MODE HEADER:
┌────────────────────────────────────────────────────────────────────────────┐
│                        📝 Clearday                          [☀️]          │
└────────────────────────────────────────────────────────────────────────────┘
                                                                │
                                                                └── Theme toggle

DARK MODE HEADER:
┌────────────────────────────────────────────────────────────────────────────┐
│                        📝 Clearday                          [🌙]          │
└────────────────────────────────────────────────────────────────────────────┘
                                                                │
                                                                └── Theme toggle
```

### Specifications

| Property | Value |
|----------|-------|
| Position | Header, right-aligned |
| Size | 44x44px touch target |
| Icon (Light) | Sun icon (☀️ or SVG) |
| Icon (Dark) | Moon icon (🌙 or SVG) |
| Transition | 200ms ease-in-out |
| Accessibility | `aria-label="Switch to dark mode"` / `"Switch to light mode"` |

### Behavior

| Scenario | Behavior |
|----------|----------|
| **First visit, no preference** | Detect system preference (`prefers-color-scheme`) |
| **First visit, saved preference** | Apply saved preference from localStorage |
| **Toggle clicked** | Instant theme switch, save to localStorage |
| **System preference changes** | Update if no user preference saved |
| **Animation** | Smooth transition, no flash of wrong theme |

### Implementation Notes

```javascript
// Theme detection priority:
// 1. User preference (localStorage)
// 2. System preference (prefers-color-scheme)
// 3. Default to light mode

const getInitialTheme = () => {
  const saved = localStorage.getItem('theme');
  if (saved) return saved;
  
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
};
```

---

## Wireframe 9: Desktop — Dark Mode

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ██████████████████████████████████████████████████████████████████████████ │
│ █                                                              [🌙]      █ │
│ █                         📝 Clearday                                   █ │
│ █                                                                        █ │
│ █      ┌────────────────────────────────────────────────────────┐       █ │
│ █      │  ○  What needs to be done?                         [+] │       █ │
│ █      └────────────────────────────────────────────────────────┘       █ │
│ █                                                                        █ │
│ █      ┌────────────────────────────────────────────────────────┐       █ │
│ █      │  Tasks                                                 │       █ │
│ █      ├────────────────────────────────────────────────────────┤       █ │
│ █      │                                                        │       █ │
│ █      │  ┌────────────────────────────────────────────────┐   │       █ │
│ █      │  │  ○  Follow up with client about Q2 proposal  ✕ │   │       █ │
│ █      │  └────────────────────────────────────────────────┘   │       █ │
│ █      │                                                        │       █ │
│ █      │  ┌────────────────────────────────────────────────┐   │       █ │
│ █      │  │  ○  Review PR #234                            ✕ │   │       █ │
│ █      │  └────────────────────────────────────────────────┘   │       █ │
│ █      │                                                        │       █ │
│ █      └────────────────────────────────────────────────────────┘       █ │
│ █                                                                        █ │
│ █      ┌────────────────────────────────────────────────────────┐       █ │
│ █      │  Completed                                             │       █ │
│ █      ├────────────────────────────────────────────────────────┤       █ │
│ █      │                                                        │       █ │
│ █      │  ┌────────────────────────────────────────────────┐   │       █ │
│ █      │  │  ●  Send deck to Sarah ─────────────────────  ✕ │   │       █ │
│ █      │  └────────────────────────────────────────────────┘   │       █ │
│ █      │                                                        │       █ │
│ █      └────────────────────────────────────────────────────────┘       █ │
│ █                                                                        █ │
│ ██████████████████████████████████████████████████████████████████████████ │
└────────────────────────────────────────────────────────────────────────────┘

Legend: ████ = Dark background (#1A1A1A)
```

### Dark Mode Specifications

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Page background | `#FFFFFF` | `#1A1A1A` |
| Task container | `#FAFAFA` | `#242424` |
| Task item background | `#FFFFFF` | `#2A2A2A` |
| Input background | `#FFFFFF` | `#2A2A2A` |
| Task text | `#333333` | `#E8E8E8` |
| Completed text | `#767676` | `#8A8A8A` |
| Border color | `#949494` | `#4A4A4A` |
| Focus ring | `#4A90D9` | `#5BA0E9` |

### Font Stack

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
             Oxygen, Ubuntu, Cantarell, sans-serif;
```

### Type Scale

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| App Title | 24px | 600 | 1.2 |
| Task Text | 16px | 400 | 1.5 |
| Input Text | 16px | 400 | 1.5 |
| Placeholder | 16px | 400 | 1.5 |
| Empty State Title | 18px | 500 | 1.3 |
| Empty State Subtitle | 14px | 400 | 1.5 |
| Button Text | 14px | 500 | 1 |

---

## Spacing System

### Base Unit: 4px

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Minimal spacing |
| `space-2` | 8px | Between task items |
| `space-3` | 12px | Component padding |
| `space-4` | 16px | Section spacing, mobile padding |
| `space-6` | 24px | Large spacing |
| `space-8` | 32px | Section separation |
| `space-12` | 48px | Empty state margin |

---

## Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| **Mobile** | < 768px | Single column, full width |
| **Desktop** | ≥ 768px | Centered container, max-width |

### Container Widths

| Breakpoint | Container | Padding |
|------------|-----------|---------|
| Mobile | 100% | 16px |
| Desktop | 600px max | 24px |

---

## Animation Specifications

### Task Addition

```
NEW TASK APPEARS:

1. Task inserted at top of list
2. Fade in + slide down
3. Duration: 200ms
4. Easing: ease-out

         ↓ New task slides in
┌────────────────────────────┐
│  ○  New task               │  ← opacity 0 → 1
└────────────────────────────┘     transform: translateY(-10px) → 0
┌────────────────────────────┐
│  ○  Existing task          │  ← pushes down smoothly
└────────────────────────────┘
```

### Task Completion

```
CHECKBOX TOGGLE:

1. Checkbox fills with color
2. Text gets strikethrough (animated)
3. Row fades to muted
4. Task animates from Active section to Completed section
5. Duration: 150ms (state change) + 200ms (section transition)
6. Easing: ease-in-out

○ → ●  (scale: 1 → 1.1 → 1, fill animates)
Text → S̶t̶r̶i̶k̶e̶t̶h̶r̶o̶u̶g̶h̶ (line draws across)

SECTION MOVEMENT:
┌─ Tasks ────────────────────┐
│  ○  Task being completed   │  ← Fades out, slides down
└────────────────────────────┘
         ↓
┌─ Completed ────────────────┐
│  ●  Task being completed   │  ← Appears at top of Completed
└────────────────────────────┘
```

### Task Deletion

```
TASK REMOVED:

1. Row fades out
2. Row collapses (height → 0)
3. Items below slide up
4. Duration: 200ms
5. Easing: ease-in-out

┌────────────────────────────┐
│  ○  Task to delete         │  ← opacity 1 → 0, height → 0
└────────────────────────────┘
┌────────────────────────────┐
│  ○  Task below             │  ← slides up smoothly
└────────────────────────────┘
```

---

## Accessibility Specifications

### WCAG 2.1 AA Compliance

| Requirement | Implementation |
|-------------|----------------|
| **Color Contrast** | 4.5:1 minimum for text |
| **Focus Indicators** | Visible focus ring on all interactive elements |
| **Touch Targets** | Minimum 44x44px |
| **Keyboard Navigation** | Full functionality via keyboard |
| **Screen Reader** | Semantic HTML, ARIA labels |

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Move between input, tasks, buttons |
| `Enter` | Submit new task (in input), toggle complete (on task) |
| `Space` | Toggle checkbox |
| `Delete` / `Backspace` | Delete task (when focused) |
| `Escape` | Clear input |

### ARIA Labels

```html
<!-- Input -->
<input 
  type="text" 
  aria-label="Add a new task"
  placeholder="What needs to be done?"
/>

<!-- Task item -->
<li role="listitem" aria-label="Task: Follow up with client">
  <input 
    type="checkbox" 
    aria-label="Mark as complete"
  />
  <span>Follow up with client</span>
  <button aria-label="Delete task">✕</button>
</li>

<!-- Task list -->
<ul role="list" aria-label="Todo list">
  ...
</ul>
```

---

## User Flow Diagram

### Primary Flow: Add Task

```
┌─────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Open   │────▶│   See       │────▶│   Type      │────▶│   Press     │
│  App    │     │   Input     │     │   Task      │     │   Enter     │
└─────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                      │                                        │
                      │                                        │
                      │  Auto-focused                          ▼
                      │                               ┌─────────────┐
                      │                               │   Task      │
                      │                               │   Appears   │
                      │                               │   Instantly │
                      │                               └─────────────┘
                      │                                        │
                      │                                        │
                      ▼                                        ▼
               TIME: 0 seconds                         TIME: < 5 seconds
                                                       
                                    ✅ Job F1 Fulfilled
```

### Secondary Flow: Complete Task

```
┌─────────┐     ┌─────────────┐     ┌─────────────┐
│  See    │────▶│   Click     │────▶│   Task      │
│  Task   │     │   Checkbox  │     │   Marked    │
│  List   │     │             │     │   Complete  │
└─────────┘     └─────────────┘     └─────────────┘
                      │                    │
                      │                    │
                      ▼                    ▼
                 1 action             Instant feedback
                                     (strikethrough)
                                           
                           ✅ Job F3 Fulfilled
```

### Tertiary Flow: Delete Task

```
┌─────────┐     ┌─────────────┐     ┌─────────────┐
│  Hover  │────▶│   Click     │────▶│   Task      │
│  Task   │     │   Delete    │     │   Removed   │
│         │     │   Button    │     │             │
└─────────┘     └─────────────┘     └─────────────┘
                      │                    │
                      │                    │
                      ▼                    ▼
               Delete visible         No confirmation
               on hover               (instant removal)
                                           
                           ✅ Job F4 Fulfilled
```

---

## Implementation Notes

### For Developers

1. **Input Auto-focus:** On page load, input field must be focused automatically.

2. **Optimistic UI:** When adding/completing/deleting tasks:
   - Update UI immediately
   - Send API request in background
   - Rollback only on error

3. **Enter Key:** Primary submit action. Don't require click.

4. **Mobile Keyboard:** Keep keyboard open after submitting a task (for rapid entry).

5. **Empty Validation:** Don't allow empty or whitespace-only tasks.

6. **Loading State:** Show only if API takes > 200ms.

### CSS Structure Suggestion

```
components/
├── TaskInput/
│   ├── TaskInput.tsx
│   └── TaskInput.css
├── TaskItem/
│   ├── TaskItem.tsx
│   └── TaskItem.css
├── TaskList/
│   ├── TaskList.tsx
│   └── TaskList.css
├── TaskSection/
│   ├── TaskSection.tsx
│   └── TaskSection.css
├── SectionHeader/
│   ├── SectionHeader.tsx
│   └── SectionHeader.css
├── EmptyState/
│   ├── EmptyState.tsx
│   └── EmptyState.css
├── LoadingState/
│   ├── LoadingState.tsx
│   └── LoadingState.css
└── ErrorState/
    ├── ErrorState.tsx
    └── ErrorState.css
```

---

## Validation Checklist

Before shipping, validate against personas and jobs:

### Maya (Busy Professional) ✓

| Criteria | Met? |
|----------|------|
| Can add task in < 10 seconds | ☐ |
| Works on mobile | ☐ |
| No account required | ☐ |
| Clean, professional look | ☐ |

### David (Focused Minimalist) ✓

| Criteria | Met? |
|----------|------|
| Minimal UI elements | ☐ |
| No unnecessary features | ☐ |
| Calm color palette | ☐ |
| Quality feel | ☐ |

### Jordan (Student Juggler) ✓

| Criteria | Met? |
|----------|------|
| Fast rapid-fire entry | ☐ |
| Works on phone one-handed | ☐ |
| Batch completion satisfying | ☐ |
| Modern aesthetic | ☐ |

---

## Next Steps

1. **Review** — Share with stakeholders for feedback
2. **Prototype** — Build interactive prototype for usability testing
3. **Test** — Validate with 3-5 users per persona
4. **Refine** — Iterate based on feedback
5. **Handoff** — Provide specs to development team

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | March 5, 2026 | Sally (UX Designer) | Initial wireframes |
| 1.1 | March 5, 2026 | Sally (UX Designer) | Added Active/Completed section separation per PRD v1.1; added TaskSection, SectionHeader, EmptyState, LoadingState, ErrorState components; approved status |
| 1.2 | March 5, 2026 | Sally (UX Designer) | Added dark mode support per PRD v1.2: dark mode color palette, ThemeToggle component, dark mode wireframe, theme detection/persistence behavior, updated validation checklists |




