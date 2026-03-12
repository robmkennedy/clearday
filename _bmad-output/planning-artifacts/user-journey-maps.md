# User Journey Maps

## ClearDay Application

**Version:** 1.1  
**Date:** March 5, 2026  
**Author:** Sally (UX Designer)  
**Status:** Approved

---

## Overview

This document maps the end-to-end user experience for each persona defined in `user-personas.md`. Journey maps visualize the user's path from discovery through daily use, highlighting emotions, pain points, and opportunities at each stage.

---

## Journey Map Legend

| Symbol | Meaning |
|--------|---------|
| 😊 | Positive emotion |
| 😐 | Neutral emotion |
| 😤 | Frustrated emotion |
| 😍 | Delighted emotion |
| ⚡ | Critical moment |
| 🎯 | Opportunity |
| ⚠️ | Risk |

---

## Journey 1: Maya Chen — The Busy Professional

### Scenario
Maya is between meetings and remembers she needs to follow up with a client. She needs to capture the task immediately before her next call starts.

### Journey Phases

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  DISCOVER   │───▶│   FIRST     │───▶│   DAILY     │───▶│   REVIEW    │───▶│   ONGOING   │
│             │    │   USE       │    │   CAPTURE   │    │   & PLAN    │    │   HABIT     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

---

### Phase 1: Discovery

| Aspect | Details |
|--------|---------|
| **Context** | Maya's colleague mentions ClearDay during lunch. "It's dead simple, just open and use." |
| **Action** | Opens the URL on her phone while walking back to her desk |
| **Thought** | *"Another todo app? Let's see if this one is actually simple..."* |
| **Emotion** | 😐 Skeptical but curious |
| **Touchpoint** | Mobile browser, shared link |

**⚡ Critical Moment: First Impression**
> Maya will decide in 3 seconds if this is worth her time. The page must load instantly and show a clear input field.

| Opportunity | Risk |
|-------------|------|
| 🎯 No signup = instant trust | ⚠️ Slow load = immediate bounce |
| 🎯 Clean UI signals simplicity | ⚠️ Any modal/popup = distrust |

---

### Phase 2: First Use

| Aspect | Details |
|--------|---------|
| **Context** | Standing in hallway, 90 seconds before next meeting |
| **Action** | Types "Follow up with client about Q2 proposal" and hits Enter |
| **Thought** | *"Wait, that's it? No account? It just... works?"* |
| **Emotion** | 😊 → 😍 Surprised delight |
| **Touchpoint** | Mobile browser, text input |

**⚡ Critical Moment: First Task Creation**
> The task must appear instantly. Any delay breaks the magic.

| Opportunity | Risk |
|-------------|------|
| 🎯 Instant feedback builds confidence | ⚠️ Error on first action = abandonment |
| 🎯 "It remembered!" on refresh = trust | ⚠️ Lost task = permanent distrust |

**User Flow:**
```
[Open App] → [See empty state with input] → [Type task] → [Press Enter]
                                                              ↓
                                        [Task appears instantly] → [Close browser]
                                                              ↓
                                        [Reopen later] → [Task is still there!] 😍
```

---

### Phase 3: Daily Capture

| Aspect | Details |
|--------|---------|
| **Context** | Throughout workday: meetings, emails, calls |
| **Action** | Quick captures: "Send deck to Sarah", "Book dentist", "Review PR #234" |
| **Thought** | *"I can finally stop using sticky notes!"* |
| **Emotion** | 😊 Relieved, productive |
| **Touchpoint** | Mobile (60%), Desktop (40%) |

**Typical Daily Flow:**
```
Morning                    Midday                     Evening
   │                          │                          │
   ▼                          ▼                          ▼
[Check list]           [Quick captures]           [Check off done]
[Add 2-3 tasks]        [5-10 rapid adds]          [Review tomorrow]
   │                          │                          │
   └──────────────────────────┴──────────────────────────┘
                              │
                    10-20 tasks/day cycle
```

| Opportunity | Risk |
|-------------|------|
| 🎯 Keyboard shortcut for power users | ⚠️ Input field not visible = friction |
| 🎯 Mobile bookmark/PWA | ⚠️ Scroll to find input = abandonment |

---

### Phase 4: Review & Plan

| Aspect | Details |
|--------|---------|
| **Context** | Morning coffee ritual, evening wind-down |
| **Action** | Scans list, checks off completed items, mentally prioritizes |
| **Thought** | *"Okay, I can see what's on my plate. I've got this."* |
| **Emotion** | 😊 In control, calm |
| **Touchpoint** | Desktop (morning), Mobile (evening) |

**⚡ Critical Moment: The Morning Scan**
> Maya needs to see her full list at a glance. Visual hierarchy is everything.

| Opportunity | Risk |
|-------------|------|
| 🎯 Clear done/not-done states | ⚠️ Too much visual noise |
| 🎯 Newest tasks visible first | ⚠️ Can't find recent additions |

---

### Phase 5: Ongoing Habit

| Aspect | Details |
|--------|---------|
| **Context** | 2 weeks later — ClearDay is now part of daily routine |
| **Action** | Opens app reflexively, captures without thinking |
| **Thought** | *"I finally have a system that doesn't fight me."* |
| **Emotion** | 😍 Loyal, advocates to colleagues |
| **Touchpoint** | Pinned browser tab, home screen bookmark |

| Opportunity | Risk |
|-------------|------|
| 🎯 She tells 3 colleagues | ⚠️ Any friction sends her back to sticky notes |
| 🎯 Becomes daily driver | ⚠️ Data loss = permanent churn |
| 🎯 Theme toggle reinforces "this app gets me" | ⚠️ Flash of wrong theme on load = jarring |

---

### Maya's Journey Summary

```
Emotion Curve:
                                    ╭───╮
                              ╭────╯   │    ╭────────────
    ╭─────╮              ╭───╯        │   ╯
────╯     ╰──────────────╯            ╰───╯
Skeptical → Surprised → Relieved → Confident → Loyal

    Discovery   First Use   Daily     Review    Habit
```

**Key Metrics to Track:**
- Time from open to first task created: Target < 10 seconds
- Return rate day 1 → day 2: Target > 60%
- Tasks created per session: Target 3-5

---

## Journey 2: David Park — The Focused Minimalist

### Scenario
David is frustrated with his current tools. He wants a simple list that doesn't try to "manage" him. He's heard about ClearDay's minimalist approach.

### Journey Phases

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  EVALUATE   │───▶│   ADOPT     │───▶│  MORNING    │───▶│   WEEKLY    │───▶│  LONG-TERM  │
│             │    │             │    │  RITUAL     │    │   CLEANUP   │    │   TRUST     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

---

### Phase 1: Evaluate

| Aspect | Details |
|--------|---------|
| **Context** | Sunday evening, clearing digital clutter |
| **Action** | Opens ClearDay, inspects the interface carefully |
| **Thought** | *"Please don't have a million features... please..."* |
| **Emotion** | 😐 Cautiously hopeful |
| **Touchpoint** | Desktop browser, direct URL |

**⚡ Critical Moment: Feature Audit**
> David is actively looking for reasons NOT to use the app. Simplicity must be obvious.

| Opportunity | Risk |
|-------------|------|
| 🎯 "That's ALL it does? Perfect." | ⚠️ Any unnecessary element = rejection |
| 🎯 Beautiful typography, whitespace | ⚠️ Cluttered UI = instant close |

**David's Mental Checklist:**
```
□ No sidebar with 10 sections          ✓ Pass
□ No "upgrade to pro" prompts          ✓ Pass  
□ No integrations/plugins section      ✓ Pass
□ No gamification/streaks/badges       ✓ Pass
□ Clean, calming color palette         ✓ Pass
                                        ↓
                              "Okay, I'll try it."
```

---

### Phase 2: Adopt

| Aspect | Details |
|--------|---------|
| **Context** | Monday morning, starting fresh week |
| **Action** | Adds his 3 focus tasks for the day |
| **Thought** | *"This is exactly what I needed. Nothing more."* |
| **Emotion** | 😊 Relieved, validated |
| **Touchpoint** | Desktop, morning setup |

**David's Daily List Philosophy:**
```
┌─────────────────────────────────┐
│  Today's Focus (3 items max)    │
├─────────────────────────────────┤
│  □ Finish logo concepts         │
│  □ Invoice Peterson project     │
│  □ Review contract draft        │
└─────────────────────────────────┘

"If it has more than 5 things, I'm doing it wrong."
```

| Opportunity | Risk |
|-------------|------|
| 🎯 App supports his philosophy | ⚠️ App encourages adding more |
| 🎯 Completion feels satisfying | ⚠️ Gamification cheapens it |

---

### Phase 3: Morning Ritual

| Aspect | Details |
|--------|---------|
| **Context** | 7:30 AM, coffee, quiet house |
| **Action** | Opens app, reviews yesterday's remaining items, sets today's focus |
| **Thought** | *"Clear list, clear mind."* |
| **Emotion** | 😊 → 🧘 Calm, intentional |
| **Touchpoint** | Desktop, dedicated browser window |

**Morning Ritual Flow:**
```
[Open App]
    │
    ▼
[Review yesterday's incomplete tasks]
    │
    ├─── Keep? → Leave it
    │
    └─── Stale? → Delete it
    │
    ▼
[Add 1-3 new tasks for today]
    │
    ▼
[Close app, start working]

Total time: 2-3 minutes
```

| Opportunity | Risk |
|-------------|------|
| 🎯 Fast load = ritual-friendly | ⚠️ Loading spinner breaks flow |
| 🎯 Satisfying delete action | ⚠️ Confirmation dialogs = friction |

---

### Phase 4: Weekly Cleanup

| Aspect | Details |
|--------|---------|
| **Context** | Sunday evening, preparing for new week |
| **Action** | Deletes all completed tasks, reviews what's left |
| **Thought** | *"A fresh start. I love this."* |
| **Emotion** | 😊 Accomplished, renewed |
| **Touchpoint** | Desktop, intentional session |

**⚡ Critical Moment: Bulk Cleanup**
> David wants to clear completed tasks efficiently.

| Opportunity | Risk |
|-------------|------|
| 🎯 "Clear completed" option (future) | ⚠️ Tedious one-by-one deletion |
| 🎯 Visual satisfaction of empty state | ⚠️ Completed tasks cluttering view |

---

### Phase 5: Long-Term Trust

| Aspect | Details |
|--------|---------|
| **Context** | 3 months later — ClearDay is his only task tool |
| **Action** | Recommends it to freelancer friends |
| **Thought** | *"Finally, an app that respects my attention."* |
| **Emotion** | 😍 Devoted advocate |
| **Touchpoint** | Daily ritual, word of mouth |

**Theme Consistency:**
> Dark mode has been remembered perfectly for 3 months. Every time David opens the app, it's exactly how he left it — calming, focused, his.

| Opportunity | Risk |
|-------------|------|
| 🎯 Becomes identity: "I use a simple list" | ⚠️ Feature additions alienate him |
| 🎯 Refers other minimalists | ⚠️ Scope creep breaks trust |
| 🎯 Theme persistence reinforces trust | ⚠️ Theme reset on update = broken trust |

---

### David's Journey Summary

```
Emotion Curve:
                              ╭─────────────────────────
                         ╭───╯      
              ╭─────────╯          
    ╭────────╯                     
────╯                              
Cautious → Relieved → Calm → Intentional → Devoted

   Evaluate    Adopt     Ritual    Cleanup    Trust
```

**Key Metrics to Track:**
- Time spent evaluating before first task: Target < 30 seconds
- Average tasks per day: Target 3-5 (not more!)
- Weekly return rate: Target > 80%

---

## Journey 3: Jordan Williams — The Student Juggler

### Scenario
Jordan is overwhelmed with midterms, a hackathon, and work shifts. They need to get everything out of their head and into a system — fast.

### Journey Phases

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   BRAIN     │───▶│   RAPID     │───▶│   MOBILE    │───▶│   BATCH     │───▶│   POWER     │
│   DUMP      │    │   CAPTURE   │    │   CAPTURE   │    │   COMPLETE  │    │   USER      │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

---

### Phase 1: Brain Dump

| Aspect | Details |
|--------|---------|
| **Context** | Sunday night panic — "What do I have to do this week?!" |
| **Action** | Opens ClearDay, starts rapid-fire adding everything |
| **Thought** | *"Get it all out of my head. Get it all out."* |
| **Emotion** | 😤 → 😊 Anxious → Relieved |
| **Touchpoint** | Laptop, browser |

**Brain Dump Session:**
```
[Open App] → [Type] → [Enter] → [Type] → [Enter] → [Type] → [Enter]...
                              │
                              ▼
                    15-20 tasks in 3 minutes

"Okay, NOW I can see what I'm dealing with."
```

**⚡ Critical Moment: Rapid Entry**
> Jordan will add 15+ tasks in one session. The app must keep up.

| Opportunity | Risk |
|-------------|------|
| 🎯 Zero lag between tasks | ⚠️ Any delay breaks flow |
| 🎯 Enter → clear → ready instantly | ⚠️ Focus loss = friction |
| 🎯 Visual list growth is motivating | ⚠️ Lost tasks = panic |

---

### Phase 2: Rapid Capture (Desktop)

| Aspect | Details |
|--------|---------|
| **Context** | During class, lecture sparks a thought |
| **Action** | Quick tab switch, adds "Research sorting algorithms for project" |
| **Thought** | *"Got it. Back to lecture."* |
| **Emotion** | 😊 Efficient, minimal disruption |
| **Touchpoint** | Laptop, browser tab |

**Desktop Capture Flow:**
```
[Cmd+Tab to browser] → [Click input] → [Type] → [Enter] → [Cmd+Tab back]

Total time: < 5 seconds
```

| Opportunity | Risk |
|-------------|------|
| 🎯 Input always focused/visible | ⚠️ Need to scroll to find input |
| 🎯 Works with keyboard only | ⚠️ Requires mouse clicks |

---

### Phase 3: Mobile Capture

| Aspect | Details |
|--------|---------|
| **Context** | Walking between buildings, remembers something |
| **Action** | Opens app on phone, adds task one-handed |
| **Thought** | *"Captured. Won't forget now."* |
| **Emotion** | 😊 Confident, in control |
| **Touchpoint** | iPhone, mobile browser/PWA |

**Mobile Capture Flow:**
```
[Unlock phone] → [Tap bookmark] → [Tap input] → [Type] → [Tap add] → [Lock phone]

Target time: < 10 seconds total
```

**⚡ Critical Moment: One-Handed Mobile Add**
> Jordan is often walking, holding coffee, etc. Input must be thumb-reachable.

| Opportunity | Risk |
|-------------|------|
| 🎯 Large touch targets | ⚠️ Small buttons = misses |
| 🎯 Input at top (thumb zone) | ⚠️ Input at bottom = stretch |
| 🎯 Works on poor WiFi | ⚠️ Requires connection = fails |

---

### Phase 4: Batch Complete

| Aspect | Details |
|--------|---------|
| **Context** | Sunday afternoon, wrapping up study session |
| **Action** | Goes through list, checking off everything finished |
| **Thought** | *"Look at all I accomplished!"* |
| **Emotion** | 😊 → 😍 Satisfied, accomplished |
| **Touchpoint** | Laptop, focused session |

**Batch Completion Flow:**
```
[Open app]
    │
    ▼
[Scan list top to bottom]
    │
    ├─── Done? → Check it off ✓
    │              │
    │              └─── Satisfying visual feedback
    │
    └─── Not done? → Leave it
    │
    ▼
[See progress: "8 of 15 done!"]
    │
    ▼
[Feel accomplished] 😍
```

| Opportunity | Risk |
|-------------|------|
| 🎯 Fast checkbox toggling | ⚠️ Slow animations block flow |
| 🎯 Progress visibility | ⚠️ Completed items disappear (confusing) |
| 🎯 Celebratory micro-moment | ⚠️ Over-the-top gamification |

---

### Phase 5: Power User

| Aspect | Details |
|--------|---------|
| **Context** | 1 month later — ClearDay is daily driver |
| **Action** | Explores source code on GitHub, shares with CS friends |
| **Thought** | *"Clean code AND clean UX. Nice."* |
| **Emotion** | 😍 Impressed, inspired |
| **Touchpoint** | App + GitHub repo |

| Opportunity | Risk |
|-------------|------|
| 🎯 Code quality impresses | ⚠️ Messy code = loses respect |
| 🎯 Shares in CS Discord | ⚠️ "It's just a todo app" dismissal |
| 🎯 Learning reference | ⚠️ Poor patterns mislead |

---

### Jordan's Journey Summary

```
Emotion Curve:
              ╭───╮                    ╭─────────────
    ╭────────╯   ╰────╮          ╭────╯
────╯                 ╰──────────╯
Anxious → Relieved → Efficient → Accomplished → Impressed

   Brain     Rapid     Mobile     Batch      Power
   Dump      Capture   Capture    Complete   User
```

**Key Metrics to Track:**
- Tasks added per session (brain dump): Target 10-20
- Mobile vs desktop ratio: Expect 50/50
- Time to add task (mobile): Target < 10 seconds

---

## Cross-Persona Journey Insights

### Universal Critical Moments

| Moment | All Personas Need | Design Response |
|--------|-------------------|-----------------|
| **First task** | Instant success | Optimistic UI, no loading |
| **Data persistence** | Trust it saved | Visual confirmation |
| **Return visit** | Data still there | Reliable backend |
| **Mobile use** | Fast, thumb-friendly | Responsive, touch targets |
| **Completion** | Satisfying feedback | Visual distinction |
| **Theme preference** | Respected automatically | System preference detection, localStorage persistence |

### Emotional Journey Comparison

```
         Discovery    First Use    Daily Use    Review      Loyalty
              │            │            │          │            │
Maya:     😐 ──────▶ 😍 ──────▶ 😊 ──────▶ 😊 ──────▶ 😍
              │            │            │          │            │
David:    😐 ──────▶ 😊 ──────▶ 🧘 ──────▶ 😊 ──────▶ 😍
              │            │            │          │            │
Jordan:   😤 ──────▶ 😊 ──────▶ 😊 ──────▶ 😍 ──────▶ 😍
```

### Design Priority Matrix

Based on journey analysis, prioritize these features:

| Priority | Feature | Personas Impacted | Journey Phase |
|----------|---------|-------------------|---------------|
| 🔴 P0 | Instant task add (< 1s) | All | First Use, Daily |
| 🔴 P0 | Persistent data | All | Return Visit |
| 🔴 P0 | Mobile responsive | Maya, Jordan | Daily Capture |
| 🟡 P1 | Clear visual hierarchy | All | Review |
| 🟡 P1 | Satisfying completion | All | Daily Use |
| 🟡 P1 | Clean, calm aesthetic | David | Evaluate |
| 🟢 P2 | Offline support | Jordan | Mobile Capture |
| 🟢 P2 | Keyboard shortcuts | Jordan | Rapid Capture |

---

## Service Blueprint Summary

### Frontstage (User-Visible)

| Touchpoint | Key Experience |
|------------|----------------|
| Input field | Always visible, always ready |
| Task list | Scannable in 2 seconds |
| Checkbox | Single-tap complete |
| Delete button | Immediate removal |
| Empty state | Encouraging, not sad |
| Loading state | Minimal, fast |
| Error state | Helpful, recoverable |

### Backstage (System)

| Component | User Impact |
|-----------|-------------|
| API response time | Perceived speed |
| Data persistence | Trust & reliability |
| Optimistic updates | Instant feedback |
| Error handling | Graceful recovery |

---

## Recommendations

Based on these journey maps, the following are critical for v1.0:

### Must Have
1. **Sub-second task creation** — All personas depend on this
2. **Reliable data persistence** — Trust is foundational
3. **Mobile-first responsive design** — 2 of 3 personas are mobile-heavy
4. **Clean, uncluttered UI** — David will leave otherwise

### Should Have
1. **Visible completed count** — Jordan needs progress feedback
2. **Smooth animations** — David appreciates craft
3. **Clear error recovery** — Maya has no patience for cryptic errors

### Could Have (Post-v1.0)
1. **"Clear completed" bulk action** — David's weekly cleanup
2. **Offline support** — Jordan's unreliable campus WiFi
3. **Keyboard shortcuts** — Jordan's power user path

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | March 5, 2026 | Sally (UX Designer) | Initial creation |
| 1.1 | March 5, 2026 | Sally (UX Designer) | Updated to align with PRD v1.1; formalized section transitions for completion flows |
| 1.2 | March 5, 2026 | Sally (UX Designer) | Added theme toggle journey touchpoints per persona, dark mode critical moments, service blueprint updates to align with PRD v1.2 dark mode feature |

