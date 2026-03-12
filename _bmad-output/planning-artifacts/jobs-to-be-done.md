# Jobs-to-be-Done Framework

## ClearDay Application

**Version:** 1.1  
**Date:** March 5, 2026  
**Author:** Sally (UX Designer)  
**Status:** Approved

---

## Overview

This document defines the Jobs-to-be-Done (JTBD) for ClearDay users. JTBD focuses on the underlying goals users are trying to accomplish, independent of specific solutions. Understanding these jobs helps ensure we build features that truly serve user needs.

### What is JTBD?

> "People don't want a quarter-inch drill. They want a quarter-inch hole."
> — Theodore Levitt

Jobs-to-be-Done describes the progress users are trying to make in their lives. Users "hire" products to do jobs for them. Our goal is to understand these jobs deeply so ClearDay gets hired — and keeps getting hired.

### Related Documents
- `user-personas.md` — Persona definitions
- `user-journey-maps.md` — Journey maps
- `user-interview-scripts.md` — Research scripts to validate

---

## Core Job Statement

### The Primary Job

```
When I [SITUATION]
I want to [MOTIVATION]  
So I can [EXPECTED OUTCOME]
```

**ClearDay's Primary Job:**

> **When I** have something I need to remember to do,  
> **I want to** capture it instantly without friction,  
> **So I can** free my mind and trust I won't forget.

This is the foundational job. Everything else supports this.

---

## Job Categories

We've identified three categories of jobs for ClearDay:

| Category | Description | Priority |
|----------|-------------|----------|
| 🎯 **Functional Jobs** | The practical tasks users need to accomplish | Primary |
| 😊 **Emotional Jobs** | How users want to feel during and after use | Critical |
| 👥 **Social Jobs** | How users want to be perceived by others | Secondary |

---

## Functional Jobs

### Job F1: Capture Tasks Instantly

| Element | Description |
|---------|-------------|
| **Job Statement** | When a task pops into my head, I want to capture it in under 10 seconds, so I don't lose the thought or get distracted from what I'm doing. |
| **Situation** | Between meetings, walking, mid-conversation, coding, reading email |
| **Current Solutions** | Sticky notes, text to self, Apple Reminders, mental notes |
| **Pain with Current** | Too slow, scattered across places, often forgotten |
| **Success Criteria** | Task captured in < 10 seconds, minimal context switch |

**Importance:** 🔴 Critical  
**Satisfaction with alternatives:** ⭐⭐ Low

**Personas:** All (Maya, David, Jordan)

**Design Implications:**
- Input field must be visible immediately on load
- Single-field entry (no required metadata)
- Enter key submits instantly
- No loading spinners during creation

---

### Job F2: See All Tasks at a Glance

| Element | Description |
|---------|-------------|
| **Job Statement** | When I need to plan my time, I want to see all my tasks at once, so I can quickly decide what to focus on. |
| **Situation** | Morning planning, between activities, end of day review |
| **Current Solutions** | Scrolling through apps, checking multiple places |
| **Pain with Current** | Tasks scattered, requires navigation, overwhelming lists |
| **Success Criteria** | Full list visible in < 2 seconds of scanning |

**Importance:** 🔴 Critical  
**Satisfaction with alternatives:** ⭐⭐⭐ Medium

**Personas:** Maya (morning scan), David (ritual), Jordan (brain dump review)

**Design Implications:**
- Clean visual hierarchy
- Minimal UI chrome
- Clear distinction between complete/incomplete
- No pagination for typical list sizes (< 50 items)

---

### Job F3: Mark Tasks Complete

| Element | Description |
|---------|-------------|
| **Job Statement** | When I finish a task, I want to mark it done with a single action, so I can feel the progress and keep my list accurate. |
| **Situation** | After completing work, during batch review sessions |
| **Current Solutions** | Checkboxes, swipe actions, crossing off paper |
| **Pain with Current** | Some apps require multiple taps, animations too slow |
| **Success Criteria** | Single tap/click, instant visual feedback |

**Importance:** 🟡 High  
**Satisfaction with alternatives:** ⭐⭐⭐⭐ Good

**Personas:** All

**Design Implications:**
- Large, easy-to-tap checkbox
- Immediate visual state change
- Satisfying but not distracting feedback
- Task stays visible (doesn't auto-hide)

---

### Job F4: Remove Irrelevant Tasks

| Element | Description |
|---------|-------------|
| **Job Statement** | When a task is no longer relevant, I want to delete it quickly, so my list stays clean and focused. |
| **Situation** | Weekly cleanup, changed plans, duplicate entries |
| **Current Solutions** | Delete button, swipe to delete |
| **Pain with Current** | Confirmation dialogs slow things down |
| **Success Criteria** | Delete in 1-2 actions, no confirmation for individual items |

**Importance:** 🟡 High  
**Satisfaction with alternatives:** ⭐⭐⭐ Medium

**Personas:** David (weekly cleanup), Maya (list maintenance)

**Design Implications:**
- Clear delete affordance
- No confirmation modal (v1.0)
- Immediate removal from list
- Consider "undo" toast instead of confirmation (future)

---

### Job F5: Access Tasks from Any Device

| Element | Description |
|---------|-------------|
| **Job Statement** | When I switch devices, I want my tasks to be there, so I can capture or review regardless of which device I have. |
| **Situation** | Phone on the go, laptop at desk, tablet at home |
| **Current Solutions** | Cloud-synced apps, browser-based tools |
| **Pain with Current** | Sync delays, offline issues, inconsistent mobile experience |
| **Success Criteria** | Same data on all devices, responsive design |

**Importance:** 🟡 High  
**Satisfaction with alternatives:** ⭐⭐⭐ Medium

**Personas:** Maya (device switching), Jordan (phone + laptop)

**Design Implications:**
- Server-persisted data (not just local storage)
- Fully responsive design
- Touch-friendly on mobile
- Fast load times on mobile networks

---

### Job F6: Trust Data Won't Be Lost

| Element | Description |
|---------|-------------|
| **Job Statement** | When I close the app or refresh the page, I need my tasks to still be there, so I can trust the system with important things. |
| **Situation** | Every session, accidental refresh, device restart |
| **Current Solutions** | Cloud apps, local apps with sync |
| **Pain with Current** | Local-only apps lose data, sync conflicts |
| **Success Criteria** | Data persists 100% of the time |

**Importance:** 🔴 Critical  
**Satisfaction with alternatives:** ⭐⭐⭐⭐ Good (with good apps)

**Personas:** All

**Design Implications:**
- Server-side persistence (database)
- Optimistic UI with eventual consistency
- Error states for failed saves
- Visual confirmation that save succeeded

---

## Emotional Jobs

### Job E1: Feel In Control

| Element | Description |
|---------|-------------|
| **Job Statement** | When I look at my task list, I want to feel in control of my commitments, not overwhelmed by them. |
| **Underlying Need** | Autonomy, mastery, confidence |
| **Signs of Success** | "I've got this", "I know what to do" |
| **Signs of Failure** | Anxiety, avoidance, dread opening the app |

**Importance:** 🔴 Critical

**Personas:** Maya (juggling stress), David (intentional control), Jordan (overwhelm recovery)

**Design Implications:**
- Clean, calm visual design
- No aggressive colors or urgency indicators
- Progress visibility (done vs. remaining)
- Don't add guilt-inducing features (streaks, overdue styling)

---

### Job E2: Feel Relieved After Capture

| Element | Description |
|---------|-------------|
| **Job Statement** | When I capture a task, I want to feel immediate relief that it's safely stored, so I can let go mentally. |
| **Underlying Need** | Mental offloading, cognitive freedom |
| **Signs of Success** | Sigh of relief, return to focus, "Got it" |
| **Signs of Failure** | Anxiety persists, need to re-check |

**Importance:** 🔴 Critical

**Personas:** All (especially Jordan during brain dumps)

**Design Implications:**
- Instant visual feedback (task appears immediately)
- No uncertainty ("Did it save?")
- Smooth animation signaling success
- Input clears, ready for next task

---

### Job E3: Feel Accomplished

| Element | Description |
|---------|-------------|
| **Job Statement** | When I complete tasks, I want to feel a sense of accomplishment, so I stay motivated to keep going. |
| **Underlying Need** | Progress, achievement, momentum |
| **Signs of Success** | Satisfaction, motivation, "I'm crushing it" |
| **Signs of Failure** | "Why bother", burnout, abandonment |

**Importance:** 🟡 High

**Personas:** Jordan (batch completion), Maya (end of day review)

**Design Implications:**
- Satisfying checkbox interaction
- Visual distinction for completed tasks
- Completed tasks remain visible (proof of progress)
- Subtle, tasteful completion feedback (not gamified)

---

### Job E4: Feel Calm, Not Anxious

| Element | Description |
|---------|-------------|
| **Job Statement** | When I open the app, I want to feel calm and focused, not stressed by aggressive UI or feature overload. |
| **Underlying Need** | Peace, simplicity, focus |
| **Signs of Success** | Relaxed, clear-headed, "This is simple" |
| **Signs of Failure** | Overwhelmed, frustrated, "Too much going on" |

**Importance:** 🟡 High (Critical for David)

**Personas:** David (primary), Maya, Jordan

**Design Implications:**
- Minimal UI elements
- Generous whitespace
- Calm color palette (no red urgency)
- No feature creep

---

## Social Jobs

### Job S1: Appear Organized

| Element | Description |
|---------|-------------|
| **Job Statement** | When others see me using a task manager, I want to appear organized and in control of my responsibilities. |
| **Context** | Open on screen during calls, visible on phone |
| **Desired Perception** | "They have their act together" |

**Importance:** 🟢 Low (v1.0 is personal, no sharing)

**Personas:** Maya (professional image)

**Design Implications:**
- Clean, professional aesthetic
- Not embarrassing if seen on screen
- (Future) Shareable views for team contexts

---

### Job S2: Recommend Confidently

| Element | Description |
|---------|-------------|
| **Job Statement** | When a friend asks for app recommendations, I want to confidently recommend this tool, so I can help them and look knowledgeable. |
| **Context** | Casual conversation, online recommendations |
| **Desired Perception** | "Good taste in tools" |

**Importance:** 🟢 Low (but drives organic growth)

**Personas:** Jordan (tech-savvy sharer), David (curated recommendations)

**Design Implications:**
- Polish and craft (David will only recommend quality)
- Simple to explain ("It's just a todo list, but it's really good")
- Easy URL to share

---

## Job Prioritization Matrix

### Priority vs. Satisfaction

Plot where each job falls to identify opportunities:

```
                    LOW SATISFACTION    HIGH SATISFACTION
                          │                    │
                          │                    │
    HIGH           ┌──────┴────────────────────┴──────┐
    IMPORTANCE     │  🎯 F1: Capture    │             │
                   │  🎯 E2: Relief     │  F3: Mark   │
                   │  🎯 E1: Control    │  Complete   │
                   │  🎯 F6: Trust      │             │
                   ├───────────────────────────────────┤
    LOW            │                    │             │
    IMPORTANCE     │                    │  S1, S2     │
                   │                    │             │
                   └───────────────────────────────────┘

🎯 = Primary opportunity (high importance, low satisfaction with alternatives)
```

### Prioritized Job List

| Priority | Job | Rationale |
|----------|-----|-----------|
| **P0** | F1: Capture Instantly | Core value prop, differentiator |
| **P0** | E2: Feel Relieved | Emotional payoff of F1 |
| **P0** | F6: Trust Data | Table stakes for any task app |
| **P1** | F2: See All Tasks | Essential for planning |
| **P1** | E1: Feel In Control | Emotional payoff of F2 |
| **P1** | F3: Mark Complete | Basic functionality |
| **P1** | E3: Feel Accomplished | Emotional payoff of F3 |
| **P2** | F4: Remove Tasks | Important but secondary |
| **P2** | F5: Multi-Device | Important but MVP can be single-device |
| **P2** | E4: Feel Calm | Important for retention |
| **P3** | S1, S2: Social Jobs | Not relevant for v1.0 |

---

## Job Stories (Implementation-Ready)

Job Stories are a practical format for development. They follow:

> **When** [situation], **I want to** [motivation], **so I can** [outcome].

### P0 Job Stories

#### JS-1: Quick Capture
```
When I have a task I need to remember,
I want to type it and press Enter,
So I can capture it in under 5 seconds and get back to what I was doing.
```

**Acceptance Criteria:**
- [ ] Input field visible on page load
- [ ] Focus in input field on page load
- [ ] Enter key submits task
- [ ] Task appears in list immediately (< 100ms)
- [ ] Input clears after submission
- [ ] No additional clicks required

---

#### JS-2: Trust Persistence
```
When I refresh the page or return later,
I want to see all my previously added tasks,
So I can trust the app with important things.
```

**Acceptance Criteria:**
- [ ] Tasks persist across page refreshes
- [ ] Tasks persist across browser sessions
- [ ] Data loads within 2 seconds
- [ ] Error state shows if load fails

---

#### JS-3: Visual Feedback
```
When I add a task,
I want to see it appear instantly in the list,
So I feel confident it was captured.
```

**Acceptance Criteria:**
- [ ] New task appears without page refresh
- [ ] New task appears at predictable location
- [ ] Subtle animation confirms addition
- [ ] No loading spinner for individual adds

---

### P1 Job Stories

#### JS-4: Task Overview
```
When I open the app,
I want to see all my tasks in a scannable list,
So I can quickly understand what I have to do.
```

**Acceptance Criteria:**
- [ ] All tasks visible without scrolling (up to ~10 tasks)
- [ ] Clear visual hierarchy (incomplete prominent, complete muted)
- [ ] Empty state when no tasks exist
- [ ] Loading state while fetching

---

#### JS-5: Mark Complete
```
When I finish a task,
I want to mark it done with a single tap/click,
So I can track my progress and feel accomplished.
```

**Acceptance Criteria:**
- [ ] Checkbox or toggle on each task
- [ ] Single click/tap toggles state
- [ ] Immediate visual change (strikethrough, muted)
- [ ] State persists after refresh

---

#### JS-6: Unmark Complete
```
When I accidentally mark a task complete (or it needs more work),
I want to unmark it with a single tap/click,
So I can correct the mistake without frustration.
```

**Acceptance Criteria:**
- [ ] Completed tasks still interactive
- [ ] Single click/tap toggles back to incomplete
- [ ] Immediate visual change
- [ ] State persists after refresh

---

### P2 Job Stories

#### JS-7: Delete Task
```
When a task is no longer relevant,
I want to delete it with minimal effort,
So I can keep my list clean and focused.
```

**Acceptance Criteria:**
- [ ] Delete action visible on each task
- [ ] Single action to delete (no confirmation)
- [ ] Task removed from list immediately
- [ ] Deletion persists after refresh

---

#### JS-8: Mobile Capture
```
When I'm on my phone and need to add a task,
I want to do it one-handed in under 10 seconds,
So I can capture thoughts while walking or busy.
```

**Acceptance Criteria:**
- [ ] Input field accessible with thumb
- [ ] Large enough touch targets (min 44px)
- [ ] Keyboard appears automatically (mobile)
- [ ] Submit button reachable without stretching

---

#### JS-9: Calm Interface
```
When I open the app feeling stressed about my tasks,
I want to see a clean, calm interface,
So I feel in control rather than more overwhelmed.
```

**Acceptance Criteria:**
- [ ] Minimal visual elements
- [ ] Ample whitespace
- [ ] No aggressive colors (red warnings, orange urgency)
- [ ] No notifications, badges, or streaks

---

## Forces Diagram

Understanding the forces that push/pull users toward or away from switching.

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   PUSH FROM CURRENT SITUATION          PULL TOWARD NEW SOLUTION    │
│   ─────────────────────────────        ─────────────────────────   │
│   • Tools too complex                  • Zero-friction capture     │
│   • Tasks scattered everywhere         • Beautiful simplicity      │
│   • Forgot something important         • Instant, reliable         │
│   • Anxiety opening todo app           • Calm, in-control feeling  │
│                                                                     │
│                           ───────▶                                  │
│                          SWITCHING                                  │
│                           ◀───────                                  │
│                                                                     │
│   ANXIETY OF NEW SOLUTION              HABIT OF CURRENT BEHAVIOR   │
│   ─────────────────────────            ─────────────────────────   │
│   • Will my data be safe?              • I already know my system  │
│   • Another app to learn?              • It's "good enough"        │
│   • What if it disappears?             • Friction of switching     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Reducing Friction

To get users to "hire" ClearDay, we must:

| Friction | Mitigation |
|----------|------------|
| "Will my data be safe?" | Reliable persistence, error handling |
| "Another app to learn?" | Zero learning curve, instant usability |
| "What if it disappears?" | (Future) Export functionality |
| "I know my current system" | Be 10x better at capture speed |

---

## Competitive Job Analysis

How do alternatives perform on our key jobs?

| Job | Sticky Notes | Apple Reminders | Todoist | Notion | ClearDay Goal |
|-----|--------------|-----------------|---------|--------|----------------|
| F1: Capture Speed | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| F2: At-a-Glance | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| F3: Mark Complete | N/A | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| F5: Multi-Device | ⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| F6: Trust/Persist | ⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| E1: Feel Control | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| E4: Feel Calm | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |

**ClearDay's Opportunity:**
- Beat sticky notes on persistence and organization
- Beat complex apps on speed and simplicity
- Match cloud apps on reliability
- Win on calm/control emotional jobs

---

## Outcome Metrics

How we'll measure job fulfillment:

| Job | Metric | Target |
|-----|--------|--------|
| F1: Capture Speed | Time from open to task created | < 10 seconds |
| F2: At-a-Glance | Time to understand list (usability test) | < 3 seconds |
| F3: Mark Complete | Tap-to-visual-change time | < 200ms |
| F6: Trust | Data loss incidents | 0 |
| E1: Control | User-reported stress level (survey) | "In control" > 80% |
| E2: Relief | Task capture satisfaction (survey) | > 4/5 |
| E3: Accomplished | Return rate (next day) | > 50% |

---

## Using This Framework

### For Product Decisions

When evaluating a feature idea, ask:
1. **Which job does this serve?**
2. **How important is that job?** (P0/P1/P2/P3)
3. **Does it make the job easier or harder?**
4. **Does it conflict with other jobs?** (e.g., features vs. calm)

### For Design Reviews

When reviewing designs, ask:
1. **Does this interface make Job F1 (capture) effortless?**
2. **Does this create the feeling of E1 (control) and E4 (calm)?**
3. **Would David (minimalist) approve of this complexity level?**

### For Development

When building features, reference the Job Stories (JS-1 through JS-9) and their acceptance criteria.

---

## Summary

ClearDay exists to fulfill one primary job:

> **Help users capture tasks instantly so they can free their minds and trust nothing will be forgotten.**

Every feature, every pixel, every interaction should be evaluated against this job. If it doesn't serve the job, it doesn't belong in v1.0.

### The Non-Negotiables

| Must Do | Must Feel |
|---------|-----------|
| Capture in < 10 seconds | Relief after capture |
| Show all tasks at a glance | In control, not overwhelmed |
| Persist data reliably | Trust and confidence |
| Work on mobile and desktop | Calm, not anxious |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | March 5, 2026 | Sally (UX Designer) | Initial creation |
| 1.1 | March 5, 2026 | Sally (UX Designer) | Updated to align with PRD v1.1; approved status |

