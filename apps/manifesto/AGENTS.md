# Manifesto - AI Agent Guidelines

> **IMPORTANT**: This file should be updated regularly as the project evolves. After making significant changes, update this document to reflect new patterns, decisions, and learnings.

## Project Philosophy

### Core Concept

Andy Matuschak-style sliding panes for documentation. Users click links to open notes in new panes stacking horizontally, creating a "rabbit hole" exploration trail while maintaining context.

### Key UX Principles

1. **Context preservation** - Never lose where you came from
2. **Horizontal stacking** - New panes open to the right
3. **Book spine collapse** - Overflow panes shrink to thin spines showing titles vertically
4. **Duplicate allowed** - Clicking an existing note appends it again (stack becomes [1,2,3,1] not [1])
5. **URL-synced state** - Stack state persists in `?stack=a,b,c&focus=N` format

## Tech Stack

| Layer         | Choice                            | Why                                             |
| ------------- | --------------------------------- | ----------------------------------------------- |
| Runtime       | Bun                               | Fast, modern Node alternative                   |
| Framework     | Next.js 16 (App Router)           | SSR, RSC, file-based routing                    |
| Language      | TypeScript                        | Type safety                                     |
| Styling       | Tailwind CSS v4                   | Utility-first, design tokens                    |
| UI Components | COSS/UI                           | Cal.com's component library, Base UI + Tailwind |
| Animation     | motion/react                      | Performant springs, AnimatePresence, layout     |
| Font          | Faculty Glyphic                   | Distinctive serif with personality              |
| Markdown      | gray-matter + remark + remark-gfm | Frontmatter + GFM support                       |

## Architecture

### Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── notes/[...slug]/    # Dynamic note route with stack handling
│   ├── globals.css         # Tailwind + COSS/UI tokens
│   ├── layout.tsx          # Root layout with header
│   └── page.tsx            # Home page with note listing
├── components/
│   ├── ui/                 # COSS/UI components (auto-generated)
│   ├── pane-container.tsx  # Horizontal scroll container + collapse detection
│   ├── pane-spine.tsx      # Vertical title handle for collapsed panes
│   ├── note-pane.tsx       # Individual pane with enter/exit/collapse animations
│   ├── note-content.tsx    # Markdown renderer with link interception
│   ├── backlinks-section.tsx # Shows notes linking to current
│   ├── preview-link.tsx    # Link with hover preview tooltip
│   ├── all-notes-list.tsx  # Lists all notes with matching animations
│   └── keyboard-navigation.tsx # Arrow/Escape/Home/End handlers
├── hooks/
│   ├── use-mobile.ts       # Mobile breakpoint detection
│   └── use-reduced-motion.ts # prefers-reduced-motion preference
├── lib/
│   ├── animations.ts       # Dieter Rams-inspired spring configurations
│   ├── types.ts            # Note, BacklinkInfo, NoteGraph types
│   ├── notes.ts            # Note loading, parsing, graph building
│   ├── stack.ts            # URL state parsing/serialization
│   ├── use-note-stack.ts   # React hook for navigation
│   ├── note-links.ts       # Link extraction utilities
│   └── utils.ts            # cn() helper for class merging
└── content/notes/          # Markdown source files
```

### Key Patterns

#### Stack State Management

- Root note from URL path: `/notes/coscientist`
- Additional panes from query: `?stack=dialectical-graph,active-recall`
- Focus parameter: `?stack=a,b&focus=1` (optional, defaults to last pane)
- Full stack: `[coscientist, dialectical-graph, active-recall]`

#### CSS-Based Pane Collapse (Obsidian-style)

- Uses `position: sticky` with incrementing `left` offset per pane
- Each pane offsets by 40px: `left: ${index * 40}px`
- Panes stack/overlap as user scrolls right, showing slivers of left panes
- Z-index increases with index so later panes appear on top
- No JavaScript collapse logic - pure CSS behavior

#### Link Interception

- Internal links (relative, not http/mailto) are intercepted
- `pushNote(slug, fromPaneIndex)` appends to stack
- Panes after `fromPaneIndex` are trimmed before appending

#### Pane Animation System (Dieter Rams Philosophy)

The pane animations follow Dieter Rams' design principles: **"Good design is as little design as possible."** Animations exist to communicate spatial relationships and state changes, not to decorate.

**Core Files:**

- `src/lib/animations.ts` - Spring configurations and variants
- `src/hooks/use-reduced-motion.ts` - Accessibility preference hook

**Animation Configurations:**

| Name           | Duration | Bounce | Use Case                                 |
| -------------- | -------- | ------ | ---------------------------------------- |
| `springSubtle` | 200ms    | 0.05   | Pane enter/exit, collapse/expand         |
| `springQuick`  | 150ms    | 0      | Micro-interactions (buttons, spine fade) |

**Pane Animation Variants:**

```tsx
// Enter: fade in + slide from right
initial: { opacity: 0, x: 40 }
animate: { opacity: 1, x: 0 }

// Exit: fade out + slide left (faster, feels like accelerating away)
exit: { opacity: 0, x: -20 }

// Collapse: dim + translate to reveal spine
collapsed: { opacity: 0.4, x: "var(--pane-spine-width)" }
expanded: { opacity: 1, x: 0 }
```

**Implementation Pattern:**

```tsx
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { paneVariants, springSubtle } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

function Pane() {
  const prefersReducedMotion = useReducedMotion();
  const transition = prefersReducedMotion ? { duration: 0 } : springSubtle;

  return (
    <motion.article
      layout
      initial={prefersReducedMotion ? false : "initial"}
      animate="animate"
      exit="exit"
      variants={paneVariants}
      transition={transition}
    >
      {/* content */}
    </motion.article>
  );
}

// Wrap multiple panes for coordinated animations
<LayoutGroup>
  <AnimatePresence initial={false} mode="popLayout">
    {panes.map((pane) => (
      <Pane key={pane.id} />
    ))}
  </AnimatePresence>
</LayoutGroup>;
```

**Dieter Rams Principles Applied:**

| Principle                      | Implementation                                    |
| ------------------------------ | ------------------------------------------------- |
| "As little design as possible" | ~200ms springs, minimal bounce (0.05)             |
| "Good design is unobtrusive"   | Only compositor properties (transform, opacity)   |
| "Good design is honest"        | Animations communicate real spatial relationships |
| "Good design is long-lasting"  | No trendy effects, timeless motion                |

**The Test:** Remove the animation. Is the interface worse?

- Yes → Keep it
- No → Delete it
- Not sure → Delete it

## UI Skills (Opinionated Constraints)

### Stack

- MUST use Tailwind CSS defaults (spacing, radius, shadows) before custom values
- MUST use motion/react (formerly framer-motion) when JavaScript animation is required
- SHOULD use tw-animate-css for entrance and micro-animations in Tailwind CSS
- MUST use cn utility (clsx + tailwind-merge) for class logic

### Components

- MUST use accessible component primitives for anything with keyboard or focus behavior (Base UI, React Aria, Radix)
- MUST use the project's existing component primitives first
- NEVER mix primitive systems within the same interaction surface
- SHOULD prefer Base UI for new primitives if compatible with the stack
- MUST add an aria-label to icon-only buttons
- NEVER rebuild keyboard or focus behavior by hand unless explicitly requested

### Interaction

- MUST use an AlertDialog for destructive or irreversible actions
- SHOULD use structural skeletons for loading states
- NEVER use h-screen, h-dvh, vh, dvh, or any viewport-specific CSS units
- MUST use flex-1 with flex containers for full-height layouts
- MUST respect safe-area-inset for fixed elements
- MUST show errors next to where the action happens
- NEVER block paste in input or textarea elements

### Animation

- NEVER add animation unless it is explicitly requested
- MUST animate only compositor props (transform, opacity)
- NEVER animate layout properties (width, height, top, left, margin, padding)
- SHOULD avoid animating paint properties (background, color) except for small, local UI (text, icons)
- SHOULD use ease-out on entrance
- NEVER exceed 200ms for interaction feedback
- MUST pause looping animations when off-screen
- MUST respect prefers-reduced-motion
- NEVER introduce custom easing curves unless explicitly requested
- SHOULD avoid animating large images or full-screen surfaces

### Typography

- MUST use text-balance for headings and text-pretty for body/paragraphs
- MUST use tabular-nums for data
- SHOULD use truncate or line-clamp for dense UI
- NEVER modify letter-spacing (tracking-) unless explicitly requested

### Layout

- MUST use a fixed z-index scale (no arbitrary z-x)
- SHOULD use size-x for square elements instead of w-x + h-x

### Performance

- NEVER animate large blur() or backdrop-filter surfaces
- NEVER apply will-change outside an active animation
- NEVER use useEffect for anything that can be expressed as render logic

### Design

- NEVER use gradients unless explicitly requested
- NEVER use purple or multicolor gradients
- NEVER use glow effects as primary affordances
- SHOULD use Tailwind CSS default shadow scale unless explicitly requested
- MUST give empty states one clear next action
- SHOULD limit accent color usage to one per view
- SHOULD use existing theme or Tailwind CSS color tokens before introducing new ones

## Component Guidelines

### When Using COSS/UI

- Prefer semantic components: `Card`, `Separator`, `Spinner` over raw divs
- Use `cn()` from `@/lib/utils` for conditional classes
- Follow existing import patterns from `@/components/ui/`

### Tailwind Conventions

- Use design tokens: `bg-card`, `text-foreground`, `border-border`
- Responsive: mobile-first with `md:` breakpoints
- Animation: only when explicitly requested, use compositor props only

### TypeScript

- Define types in `src/lib/types.ts`
- Use strict mode, avoid `any`
- Prefer `interface` for object shapes

## Commands

```bash
bun install          # Install dependencies
bun run dev          # Development server (http://localhost:3000)
bun run build        # Production build
bun run start        # Start production server
```

## Updating This Document

After significant changes, update these sections:

1. **Tech Stack** - New dependencies or replacements
2. **Architecture** - Structural changes
3. **Key Patterns** - New conventions or patterns
4. **Component Guidelines** - Style/component standards

Keep this document accurate - it's the source of truth for AI agents working on this codebase.

---

## COSS/UI Pattern Reference (from coss.com)

> **Source**: Studied from [cosscom/coss](https://github.com/cosscom/coss) - the official coss.com monorepo containing `@coss/ui` package and reference implementations.

### Architecture Overview

COSS/UI is built on three pillars:

1. **Base UI** (`@base-ui/react`) - Accessible, unstyled primitives
2. **Tailwind CSS v4** - Utility-first styling with design tokens
3. **CVA** (`class-variance-authority`) - Type-safe variant management

### Component Anatomy Pattern

Every COSS/UI component follows this structure:

```tsx
"use client";

import { SomePrimitive } from "@base-ui/react/some-primitive";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// 1. Define variants with CVA
const componentVariants = cva("base-classes-here", {
  defaultVariants: { variant: "default", size: "default" },
  variants: {
    variant: { default: "...", destructive: "..." },
    size: { default: "...", sm: "...", lg: "..." },
  },
});

// 2. Extend Base UI's component props
interface ComponentProps extends useRender.ComponentProps<"element"> {
  variant?: VariantProps<typeof componentVariants>["variant"];
  size?: VariantProps<typeof componentVariants>["size"];
}

// 3. Use useRender for polymorphism
function Component({
  className,
  variant,
  size,
  render,
  ...props
}: ComponentProps) {
  const defaultProps = {
    className: cn(componentVariants({ className, size, variant })),
    "data-slot": "component-name", // For CSS targeting
  };

  return useRender({
    defaultTagName: "element",
    props: mergeProps<"element">(defaultProps, props),
    render, // Allows changing underlying element
  });
}
```

### Key Patterns from COSS/UI

#### 1. Polymorphic Components with `useRender`

```tsx
// The `render` prop allows changing the underlying element
<Button render={<a href="/somewhere" />}>Click me</Button>
// Renders as <a> with button styling
```

#### 2. Data Slots for CSS Targeting

```tsx
// Every component sets data-slot for descendant selectors
<div data-slot="button">...</div>

// Use in CSS:
[data-slot=input-group] [data-slot=button] { ... }
```

#### 3. Collapsible Pattern (Base UI)

```tsx
import { Collapsible } from "@base-ui/react/collapsible";

// Correct: Use Base UI's built-in height animation
<CollapsiblePanel className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 data-ending-style:h-0 data-starting-style:h-0">
  {children}
</CollapsiblePanel>;
```

#### 4. Theme Tokens in globals.css

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-link: var(--info); /* Add for links */
  --color-link-visited: var(--info-foreground);
  /* ... */
}

:root {
  --background: var(--color-white);
  --foreground: var(--color-neutral-800);
  --info: var(--color-blue-500); /* Use for links */
  --info-foreground: var(--color-blue-700);
}
```

#### 5. Z-Index Scale

COSS/UI uses a fixed z-index scale. Define these tokens:

```css
@theme inline {
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-overlay: 300;
  --z-modal: 400;
  --z-popover: 500;
  --z-toast: 600;
}
```

---

## Identified Issues & Refactoring Roadmap

> **Analysis Date**: January 2026  
> **Severity Legend**: 🔴 High (Accessibility/Breaking) | 🟡 Medium (Maintenance) | 🟢 Low (Tech Debt)

### 🔴 High Priority Issues

#### 1. Manual Keyboard Handling on Non-Semantic Elements

**File**: `src/components/note-pane.tsx` (Lines 129-134)

```tsx
// ❌ CURRENT: Fake button with manual keyboard handling
<motion.div
  onClick={handleExpandClick}
  onKeyDown={(e) => {
    if (isCollapsed && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onExpand?.();
    }
  }}
  role={isCollapsed ? "button" : undefined}
  tabIndex={isCollapsed ? 0 : -1}
>
```

**Fix**: Use Base UI's `Collapsible` primitive or a real `<button>`:

```tsx
// ✅ CORRECT: Semantic button
{
  isCollapsed && (
    <button
      type="button"
      onClick={onExpand}
      className="absolute inset-0 cursor-pointer"
      aria-label={`Expand ${note.title}`}
    >
      <span className="sr-only">Expand pane</span>
    </button>
  );
}
```

#### 2. Direct DOM Manipulation for Focus

**File**: `src/components/keyboard-navigation.tsx` (Lines 78-90)

```tsx
// ❌ CURRENT: Raw DOM queries
function scrollToPane(index: number) {
  const panes = document.querySelectorAll("[data-pane]");
  const targetPane = panes[index] as HTMLElement | undefined;
  targetPane?.focus();
}
```

**Fix**: Use React refs and a focus management hook:

```tsx
// ✅ CORRECT: React-managed focus
const paneRefs = useRef<Map<number, HTMLElement>>(new Map());

function scrollToPane(index: number) {
  paneRefs.current.get(index)?.focus();
}
```

### 🟡 Medium Priority Issues

#### 3. Hardcoded Link Colors

**File**: `src/components/note-content.tsx` (Lines 76-78)

```tsx
// ❌ CURRENT: Hardcoded blue
"[&_a]:text-blue-600 [&_a:visited]:text-blue-800 dark:[&_a]:text-blue-400";
```

**Fix**: Use theme tokens:

```tsx
// ✅ CORRECT: Theme-aware
"[&_a]:text-info [&_a:visited]:text-info-foreground";
```

And add to `globals.css`:

```css
:root {
  --link: var(--color-blue-600);
  --link-visited: var(--color-blue-800);
}
.dark {
  --link: var(--color-blue-400);
  --link-visited: var(--color-blue-300);
}
@theme inline {
  --color-link: var(--link);
  --color-link-visited: var(--link-visited);
}
```

#### 4. Arbitrary Z-Index Values

**Files**: `note-pane.tsx`, `all-notes-list.tsx`, `toast.tsx`

```tsx
// ❌ CURRENT: Magic numbers
style={{ zIndex: 10 + index }}

// In toast.tsx
"z-[calc(9999-var(--toast-index))]"
```

**Fix**: Use z-index scale tokens:

```tsx
// ✅ CORRECT: Token-based
style={{ zIndex: `calc(var(--z-sticky) + ${index})` }}
```

#### 5. Markdown "Class Soup"

**File**: `src/components/note-content.tsx` (Lines 64-79)

The entire markdown styling is inline in one component. This makes it:

- Hard to read (20+ line className)
- Impossible to reuse (e.g., in PreviewCard)
- Prone to inconsistency

**Fix**: Extract to a Tailwind `@layer`:

```css
/* In globals.css */
@layer components {
  .prose-note {
    @apply max-w-prose;

    & h1 {
      @apply text-[1.75rem] font-semibold leading-tight mb-4 text-foreground text-balance;
    }
    & h2 {
      @apply text-[1.375rem] font-medium mt-6 mb-3 text-foreground text-balance;
    }
    & h3 {
      @apply text-lg font-medium mt-5 mb-2 text-foreground text-balance;
    }
    & p {
      @apply text-base leading-relaxed mb-4 text-foreground/90 text-pretty;
    }
    & ul,
    & ol {
      @apply mb-4 pl-6;
    }
    & li {
      @apply text-base leading-relaxed mb-2 text-foreground/90 text-pretty;
    }
    & code {
      @apply bg-muted px-1.5 py-0.5 rounded text-sm font-mono;
    }
    & pre {
      @apply bg-muted p-4 rounded-lg overflow-x-auto mb-4;
    }
    & pre code {
      @apply bg-transparent p-0;
    }
    & blockquote {
      @apply border-l-[3px] border-border pl-4 ml-0 mb-4 text-muted-foreground italic;
    }
    & a {
      @apply text-link no-underline border-b border-transparent transition-colors hover:border-link;
    }
    & a:visited {
      @apply text-link-visited;
    }
  }
}
```

Then in component:

```tsx
<div className="prose-note p-8 pt-10">
```

#### 6. Duplicate Spine UI

**Files**: `note-pane.tsx` (Lines 101-122), `all-notes-list.tsx`

The "spine" (collapsed vertical title) is duplicated with identical logic.

**Fix**: Extract `<PaneSpine>` component:

```tsx
// src/components/pane-spine.tsx
interface PaneSpineProps {
  index: number;
  title: string;
}

export function PaneSpine({ index, title }: PaneSpineProps) {
  return (
    <div className="absolute left-0 top-0 bottom-0 w-pane-spine flex flex-col items-center pt-2 bg-card z-10 gap-2">
      <span className="size-5 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center tabular-nums flex-shrink-0">
        {index + 1}
      </span>
      <span
        className="text-sm font-medium text-muted-foreground whitespace-nowrap"
        style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
      >
        {title}
      </span>
    </div>
  );
}
```

### 🟢 Low Priority Issues

#### 7. Manual Drag-and-Drop Implementation

**File**: `src/app/notes/[...slug]/client.tsx`

Uses manual pointer events (`startX`, `deltaX` math). Consider using `@dnd-kit` for better accessibility and mobile support.

#### 8. Brittle Width Constants

**Files**: `note-pane.tsx`, `client.tsx`

```tsx
// In note-pane.tsx
"md:min-w-80"; // 320px

// In client.tsx
const paneWidth = 320; // Magic number
```

**Fix**: Use CSS variable:

```css
:root {
  --pane-min-width: 20rem;
}
```

```tsx
// Read from CSS when needed
const paneWidth =
  parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--pane-min-width",
    ),
  ) * 16;
```

---

## Implementation Checklist

When refactoring, complete in this order:

1. [x] Add z-index scale tokens to `globals.css`
2. [x] Add link color tokens to `globals.css`
3. [x] Extract `.prose-note` layer to `globals.css`
4. [x] Create `<PaneSpine>` shared component
5. [x] Refactor `note-pane.tsx` to use semantic button for expansion
6. [ ] Refactor `keyboard-navigation.tsx` to use React refs
7. [x] Update `note-content.tsx` to use `.prose-note` class
8. [x] Replace arbitrary z-index values with tokens
9. [ ] Consider `@dnd-kit` migration for drag-and-drop
10. [x] Add pane enter/exit animations with Motion
11. [x] Add collapse/expand animations for panes
12. [x] Add `prefers-reduced-motion` support

---

## Reference: COSS/UI Component List

Components available in `@coss/ui` (from `packages/ui/src/components/`):

| Category       | Components                                                                                                                    |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Layout**     | Card, Separator, Frame, Group, Fieldset                                                                                       |
| **Forms**      | Button, Input, InputGroup, Textarea, Checkbox, CheckboxGroup, RadioGroup, Select, Switch, NumberField, Autocomplete, Combobox |
| **Feedback**   | Alert, AlertDialog, Toast, Progress, Meter, Spinner, Skeleton, Empty                                                          |
| **Navigation** | Tabs, Breadcrumb, Pagination, Menu, Command, Sidebar                                                                          |
| **Overlay**    | Dialog, Sheet, Popover, Tooltip, PreviewCard                                                                                  |
| **Data**       | Table, Badge, Avatar, Kbd                                                                                                     |
| **Disclosure** | Accordion, Collapsible, Toggle, ToggleGroup, Toolbar                                                                          |
| **Utilities**  | Label, Field, Form, ScrollArea                                                                                                |

When adding new UI, check if COSS/UI has a component first. Copy from their implementation to maintain consistency.

---

## Advanced COSS/UI Patterns

### Contextual CSS with `data-slot`

COSS/UI heavily uses `data-slot` attributes for contextual styling without React Context:

```tsx
// Component sets its slot
<div data-slot="dialog-header">...</div>

// Parent can style children via CSS
.dialog-popup:has([data-slot=dialog-panel]) [data-slot=dialog-header] {
  padding-bottom: var(--spacing-3);
}

// In Tailwind v4:
"in-[[data-slot=dialog-popup]:has([data-slot=dialog-panel])]:pb-3"
```

### Nested Dialog Stacking

Automatic 3D deck effect for nested dialogs:

```css
/* Each nested dialog scales down and fades */
[data-slot="dialog"] {
  --nested-dialogs: 0;
  scale: calc(1 - 0.1 * var(--nested-dialogs));
  opacity: calc(1 - 0.2 * var(--nested-dialogs));
}
```

### Scroll-Aware Layouts

Components detect overflow and adjust:

```tsx
// ScrollArea sets data-has-overflow when content scrolls
<div data-has-overflow={hasOverflow}>
  {/* Padding adjusts based on overflow presence */}
</div>
```

### CSS Masking for Fade Effects

```css
/* Smooth fade at scroll edges */
mask-image: linear-gradient(
  to bottom,
  transparent,
  black calc(var(--fade-size)),
  black calc(100% - var(--fade-size)),
  transparent
);
```

---

## Migration Path: Current → COSS/UI Patterns

| Current Pattern               | COSS/UI Pattern         | Priority  |
| ----------------------------- | ----------------------- | --------- |
| Manual `onKeyDown` handlers   | Base UI primitives      | 🔴 High   |
| `document.querySelectorAll`   | React refs + Context    | 🔴 High   |
| Hardcoded colors (`blue-600`) | Theme tokens (`--link`) | 🟡 Medium |
| Inline Tailwind class soup    | `@layer` abstractions   | 🟡 Medium |
| Arbitrary `zIndex: 10 + n`    | `--z-*` scale tokens    | 🟡 Medium |
| Duplicated UI (spine)         | Shared components       | 🟡 Medium |
| Manual drag-and-drop          | `@dnd-kit` library      | 🟢 Low    |
