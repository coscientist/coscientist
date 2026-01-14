# Coscientist Design System

> "Good design is as little design as possible." — Dieter Rams

This document defines the visual language, design tokens, and component patterns for Coscientist. It serves as the single source of truth for designers and developers building the Coscientist knowledge production system.

---

## Table of Contents

- [1. Design Philosophy](#1-design-philosophy)
- [2. Brand Identity](#2-brand-identity)
- [3. Color System](#3-color-system)
- [4. Typography](#4-typography)
- [5. Layout & Spacing](#5-layout--spacing)
- [6. Components](#6-components)
- [7. Interactive States](#7-interactive-states)
- [8. Motion & Animation](#8-motion--animation)
- [9. OG Image Design](#9-og-image-design)
- [10. Icons & Favicon](#10-icons--favicon)
- [11. Accessibility](#11-accessibility)
- [12. Implementation Reference](#12-implementation-reference)

---

## 1. Design Philosophy

### Dieter Rams' Ten Principles

Coscientist follows the "Less, but better" approach. We prioritize:

- **Honesty**: The UI reflects the underlying data structure (the Dialectical Graph).
- **Unobtrusiveness**: Tools should fade into the background, leaving space for thought.
- **Longevity**: Avoiding trendy effects in favor of timeless typography and motion.

### Sliding Panes (Matuschak-style)

The interface is based on the concept of **Sliding Panes**. Instead of traditional tabbed navigation or a single-page view, notes open in a horizontal stack. This preserves context and allows for non-linear exploration of knowledge.

---

## 2. Brand Identity

### The Logo

The Coscientist logo represents three sliding panes in a stack.

| Element       | Description                                          | Visual Representation |
| :------------ | :--------------------------------------------------- | :-------------------- | --- | --- | --- |
| **Structure** | 3 vertical bars with equal width and spacing.        | `[                    |     |     | ]`  |
| **Opacity**   | Decreasing opacity (100% → 50% → 20%).               | `1.0, 0.5, 0.2`       |
| **Meaning**   | Represents a "rabbit hole" of knowledge exploration. | Stacking context      |

#### SVG Specification

```tsx
<svg width="36" height="32" viewBox="0 0 36 32" fill="none">
  <rect x="0" y="0" width="8" height="32" fill="currentColor" fillOpacity="1" />
  <rect
    x="14"
    y="0"
    width="8"
    height="32"
    fill="currentColor"
    fillOpacity="0.5"
  />
  <rect
    x="28"
    y="0"
    width="8"
    height="32"
    fill="currentColor"
    fillOpacity="0.2"
  />
</svg>
```

---

## 3. Color System

Coscientist uses a theme-aware color system with strong contrast in both light and dark modes.

### Core Palettes

| Token          | Light Mode (Hex)   | Dark Mode (Hex)          | Purpose               |
| :------------- | :----------------- | :----------------------- | :-------------------- |
| `--background` | `#ffffff`          | `#0a0a0a`                | Primary surface       |
| `--foreground` | `#262626`          | `#ededed`                | Primary text          |
| `--border`     | `rgba(0,0,0,0.08)` | `rgba(255,255,255,0.1)`  | Structural boundaries |
| `--muted`      | `rgba(0,0,0,0.04)` | `rgba(255,255,255,0.04)` | Secondary surfaces    |
| `--accent`     | `rgba(0,0,0,0.04)` | `rgba(255,255,255,0.04)` | Interaction states    |
| `--link`       | `#2563eb`          | `#60a5fa`                | Interactive links     |

### Ambient Lighting (Dark Mode Only)

To create depth and premium feel, dark mode utilizes subtle radial gradients:

- **Top Right**: `radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)` with `blur(80px)`.
- **Bottom Left**: `radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)` with `blur(80px)`.

---

## 4. Typography

We prioritize readability and typographic "voice".

### Font Families

- **Sans (Headings/Body)**: `Faculty Glyphic` — A distinctive serif-like font with a scholarly yet modern personality.
- **Mono (Code/Data)**: `Iosevka` — A condensed, highly legible monospace font.

### Scale & Hierarchy

| Element     | Size              | Weight | Leading | Utility                                       |
| :---------- | :---------------- | :----- | :------ | :-------------------------------------------- |
| **H1**      | `1.75rem` (28px)  | `600`  | `1.1`   | `text-[1.75rem] font-semibold tracking-tight` |
| **H2**      | `1.375rem` (22px) | `500`  | `1.2`   | `text-[1.375rem] font-medium tracking-tight`  |
| **Body**    | `1rem` (16px)     | `400`  | `1.6`   | `text-base leading-relaxed`                   |
| **Caption** | `0.875rem` (14px) | `400`  | `1.4`   | `text-sm text-muted-foreground`               |
| **Mono**    | `0.875rem` (14px) | `400`  | `1.2`   | `font-mono text-sm`                           |

### Typographic Principles

- **`text-balance`**: Used for all headings to avoid awkward widows.
- **`text-pretty`**: Used for body paragraphs for better justification.
- **`tabular-nums`**: Used for all numerical data and indexes.

---

## 5. Layout & Spacing

### The Grid & Spacing Scale

We strictly adhere to the Tailwind 4px/8px spacing system.

| Variable             | Value           | Description                             |
| :------------------- | :-------------- | :-------------------------------------- |
| `--pane-min-width`   | `20rem` (320px) | Minimum width of an expanded note pane. |
| `--pane-spine-width` | `2.5rem` (40px) | Width of a collapsed "spine".           |
| `max-w-prose`        | `65ch`          | Optimal reading width for note content. |

### Z-Index Scale

A centralized z-index scale prevents "z-index wars".

| Layer      | Value | Purpose                        |
| :--------- | :---- | :----------------------------- |
| `base`     | `0`   | Default content                |
| `pane`     | `10`  | Individual note panes          |
| `dropdown` | `100` | Context menus                  |
| `sticky`   | `200` | Pane spines and sticky headers |
| `overlay`  | `300` | Modal backdrops                |
| `modal`    | `400` | Dialogs and popups             |
| `popover`  | `500` | Tooltips and previews          |
| `toast`    | `600` | Notifications                  |

---

## 6. Components

### 6.1 Note Pane

The primary content container. Each note is rendered in its own pane with ambient lighting effects.

#### Anatomy

```
┌─────────────────────────────────────────────────────────┐
│ ○ ○ ○  (ambient gradient - top right, dark mode only)   │
│                                              [×] Close  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │                                                   │  │
│  │  Note Title                                       │  │
│  │  ─────────────────────────────                    │  │
│  │  Description text here                            │  │
│  │                                                   │  │
│  │  ─────────────────────────────────────────────    │  │
│  │                                                   │  │
│  │  [Markdown Content]                               │  │
│  │  Lorem ipsum dolor sit amet, consectetur          │  │
│  │  adipiscing elit. [[Internal Link]]               │  │
│  │                                                   │  │
│  │  ─────────────────────────────────────────────    │  │
│  │                                                   │  │
│  │  Backlinks                                        │  │
│  │  • Related Note 1                                 │  │
│  │  • Related Note 2                                 │  │
│  │                                                   │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│ ○ ○ ○  (ambient gradient - bottom left, dark mode only) │
└─────────────────────────────────────────────────────────┘
```

#### Implementation

```tsx
<motion.article
  className={cn(
    "flex-shrink-0 w-full md:w-1/3 md:min-w-pane-min h-full overflow-hidden",
    "bg-background border-l border-border relative group/pane",
    "sticky left-0",
  )}
  style={{
    left: `calc(${index} * var(--pane-spine-width))`,
    zIndex: `calc(var(--z-pane) + ${index})`,
  }}
>
  {/* Ambient Gradients (Dark Mode Only) */}
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div
      className="absolute -top-[300px] -right-[100px] w-[800px] h-[800px] 
                 opacity-0 dark:opacity-100 transition-opacity duration-1000"
      style={{
        background:
          "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
        filter: "blur(80px)",
      }}
    />
    <div
      className="absolute -bottom-[300px] -left-[100px] w-[800px] h-[800px] 
                 opacity-0 dark:opacity-100 transition-opacity duration-1000"
      style={{
        background:
          "radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)",
        filter: "blur(80px)",
      }}
    />
  </div>

  {/* Content */}
  <Frame className="min-h-full rounded-none bg-transparent border-none">
    <FrameHeader className="pb-2 pt-8 px-8">
      <FrameTitle
        className="text-3xl font-normal tracking-tight 
                             text-foreground/90 
                             dark:text-transparent dark:bg-clip-text 
                             dark:bg-gradient-to-br dark:from-white 
                             dark:via-white dark:to-neutral-500"
      >
        {note.title}
      </FrameTitle>
    </FrameHeader>
    ...
  </Frame>
</motion.article>
```

#### Key Features

| Feature           | Light Mode               | Dark Mode                    |
| :---------------- | :----------------------- | :--------------------------- |
| Background        | `bg-background` (white)  | `bg-background` (#0a0a0a)    |
| Ambient Gradients | Hidden (`opacity-0`)     | Visible (`opacity-100`)      |
| Title             | `text-foreground/90`     | Gradient text (white → gray) |
| Focus Ring        | `ring-1 ring-primary/20` | Same                         |
| Close Button      | Top-right, icon only     | Same                         |

---

### 6.2 Pane Spine

When a pane is scrolled out of view, it collapses into a thin "spine" showing vertical text.

#### Anatomy

```
┌──────┐
│ ███  │  ← 3-bar logo (faded, animates on hover)
│ ░░░  │
│ ···  │
│      │
│  01  │  ← Index (monospace, minimal)
│      │
│  N   │
│  o   │  ← Vertical title (rotated 180°)
│  t   │
│  e   │
│      │
│  T   │
│  i   │
│  t   │
│  l   │
│  e   │
│      │
└──────┘
```

#### Implementation

```tsx
<div
  className={cn(
    "absolute left-0 top-0 bottom-0 w-pane-spine",
    "flex flex-col items-center py-4",
    "bg-card/80 backdrop-blur-md border-r border-border/50",
    "z-sticky gap-6 group/spine",
  )}
>
  {/* Logo Mark */}
  <div
    className="flex flex-col gap-1 items-center 
                  opacity-50 grayscale 
                  group-hover/spine:grayscale-0 
                  group-hover/spine:opacity-100 
                  transition-all duration-300"
  >
    <div className="w-1.5 h-6 bg-foreground/90 rounded-sm" />
    <div className="w-1.5 h-6 bg-foreground/50 rounded-sm" />
    <div className="w-1.5 h-6 bg-foreground/20 rounded-sm" />
  </div>

  {/* Index */}
  <span className="text-[10px] font-mono text-muted-foreground/50">
    {index < 10 ? `0${index}` : index}
  </span>

  {/* Vertical Title */}
  <span
    className="text-sm font-medium text-foreground whitespace-nowrap"
    style={{
      writingMode: "vertical-rl",
      textOrientation: "mixed",
      transform: "rotate(180deg)",
    }}
  >
    {title}
  </span>
</div>
```

#### Glassmorphism Effect

The spine uses a translucent glass effect:

```css
.spine {
  background: rgba(var(--card), 0.8); /* 80% opacity */
  backdrop-filter: blur(12px); /* Blur background */
  border-right: 1px solid rgba(var(--border), 0.5);
}
```

Tailwind equivalent: `bg-card/80 backdrop-blur-md border-r border-border/50`

---

### 6.3 All Notes List

The index pane showing all available notes with their stack positions.

#### Anatomy

```
┌─────────────────────────────────────┐
│ ○ (ambient gradient top-right)      │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  All Notes          ← Header  │  │
│  │  42 notes           ← Count   │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  01  Active Note      ← In stack │
│  │  02  Another Note     ← In stack │
│  │  —   Inactive Note    ← Not open │
│  │  —   Another Inactive           │
│  │  03  Third Open       ← In stack │
│  └───────────────────────────────┘  │
│                                     │
│ ○ (ambient gradient bottom-left)    │
└─────────────────────────────────────┘
```

#### List Item States

| State        | Index         | Background                         | Text Color              |
| :----------- | :------------ | :--------------------------------- | :---------------------- |
| **Default**  | `—` (em dash) | Transparent                        | `text-muted-foreground` |
| **Hover**    | `—`           | `bg-muted/50` / `dark:bg-white/5`  | `text-foreground`       |
| **In Stack** | `01`, `02`... | `bg-primary/5` / `dark:bg-white/5` | `text-foreground`       |

#### Implementation

```tsx
<li>
  <PreviewLink href={buildNoteHref(note.slug)} onClick={handleClick}>
    <span
      className={cn(
        "flex items-center gap-3 py-2 px-3 rounded-md text-sm",
        "transition-all duration-150",
        "hover:bg-muted/50 dark:hover:bg-white/5",
        isInStack
          ? "bg-primary/5 dark:bg-white/5 text-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {/* Index Column */}
      <span
        className={cn(
          "flex-shrink-0 w-6 text-[10px] font-mono tabular-nums",
          isInStack
            ? "text-primary dark:text-white/70"
            : "text-muted-foreground/30",
        )}
      >
        {isInStack ? String(stackPosition + 1).padStart(2, "0") : "—"}
      </span>

      {/* Title */}
      <span className="truncate">{note.title}</span>
    </span>
  </PreviewLink>
</li>
```

#### Header with Glassmorphism

```tsx
<div
  className="sticky top-0 z-sticky 
                bg-background/80 backdrop-blur-md 
                px-4 pt-4 pb-2 border-b border-border/50"
>
  <h2
    className="text-2xl font-normal tracking-tight 
                 text-foreground/90 
                 dark:text-transparent dark:bg-clip-text 
                 dark:bg-gradient-to-br dark:from-white 
                 dark:via-white dark:to-neutral-500"
  >
    {t("title")}
  </h2>
  <p className="text-sm text-muted-foreground/60 mt-1 font-mono">
    {t("noteCount", { count: notes.length })}
  </p>
</div>
```

---

### 6.4 Markdown Prose

The `.prose-note` class handles all markdown-rendered content.

#### Typography Specifications

| Element           | Tailwind Classes                                                               |
| :---------------- | :----------------------------------------------------------------------------- |
| **H1**            | `text-[1.75rem] font-semibold leading-tight mb-4 text-foreground text-balance` |
| **H2**            | `text-[1.375rem] font-medium mt-6 mb-3 text-foreground text-balance`           |
| **H3**            | `text-lg font-medium mt-5 mb-2 text-foreground text-balance`                   |
| **Paragraph**     | `text-base leading-relaxed mb-4 text-foreground/90 text-pretty`                |
| **List Item**     | `text-base leading-relaxed mb-2 text-foreground/90 text-pretty`                |
| **Link**          | `text-link no-underline border-b border-transparent hover:border-link`         |
| **Code (inline)** | `bg-muted px-1.5 py-0.5 rounded text-sm font-mono`                             |
| **Code Block**    | `bg-muted p-4 rounded-lg overflow-x-auto mb-4`                                 |
| **Blockquote**    | `border-l-[3px] border-border pl-4 ml-0 mb-4 text-muted-foreground italic`     |

#### CSS Definition

```css
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

    & a {
      @apply text-link no-underline border-b border-transparent transition-colors;
    }
    & a:hover {
      @apply border-link;
    }
    & a:visited {
      @apply text-link-visited;
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
  }
}
```

---

## 7. Interactive States

### 7.1 Hover States

| Component        | Default                                | Hover                                          |
| :--------------- | :------------------------------------- | :--------------------------------------------- |
| **List Item**    | `transparent`                          | `bg-muted/50` / `dark:bg-white/5`              |
| **Close Button** | `bg-transparent text-muted-foreground` | `bg-muted`                                     |
| **Spine Logo**   | `opacity-50 grayscale`                 | `opacity-100 grayscale-0`                      |
| **Link**         | `border-transparent`                   | `border-link`                                  |
| **Pane**         | Normal                                 | `group/pane` parent enables child hover states |

### 7.2 Focus States

All focusable elements use a consistent ring style:

```tsx
// Standard focus ring
"focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:ring-inset";

// For panes
"ring-1 ring-primary/20 ring-inset"; // When isFocused
```

### 7.3 Active/Selected States

| State            | Visual Treatment                                  |
| :--------------- | :------------------------------------------------ |
| **In Stack**     | `bg-primary/5 dark:bg-white/5` with colored index |
| **Current Pane** | Focus ring visible                                |
| **Collapsed**    | Spine visible, content shifted right              |

### 7.4 Transition Timing

All interactive state changes use consistent timing:

```css
transition-all duration-150  /* 150ms for hover/active */
transition-colors duration-150  /* Color-only transitions */
transition-opacity duration-1000  /* Ambient gradients fade */
```

---

## 8. Motion & Animation

Animations communicate **spatial relationships** and provide feedback. They should never be decorative.

### 8.1 Spring Configurations

We use physics-based springs from `motion/react`:

| Name           | Duration | Bounce | Use Case                                |
| :------------- | :------- | :----- | :-------------------------------------- |
| `springSubtle` | `200ms`  | `0.05` | Pane enter/exit, collapse/expand        |
| `springQuick`  | `150ms`  | `0`    | Buttons, spine fade, micro-interactions |

#### Implementation

```ts
// src/lib/animations.ts
export const springSubtle = {
  type: "spring",
  duration: 0.2,
  bounce: 0.05,
};

export const springQuick = {
  type: "spring",
  duration: 0.15,
  bounce: 0,
};
```

### 8.2 Pane Variants

```ts
export const paneVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export const paneContentVariants = {
  collapsed: {
    opacity: 0.4,
    x: "var(--pane-spine-width)",
  },
  expanded: {
    opacity: 1,
    x: 0,
  },
};

export const spineVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};
```

### 8.3 Animation Principles

| Principle              | Implementation                                    |
| :--------------------- | :------------------------------------------------ |
| **Compositor Only**    | Only animate `transform` and `opacity`            |
| **Maximum 200ms**      | Feedback must feel instant                        |
| **Entrance: ease-out** | Fast start, slow end                              |
| **Exit: accelerate**   | Feels like moving away                            |
| **Reduced Motion**     | Check `prefers-reduced-motion`, set `duration: 0` |

### 8.4 Reduced Motion Support

```tsx
const prefersReducedMotion = useReducedMotion();
const transition = prefersReducedMotion ? { duration: 0 } : springSubtle;

<motion.div
  initial={prefersReducedMotion ? false : "initial"}
  animate="animate"
  exit="exit"
  variants={paneVariants}
  transition={transition}
>
```

---

## 9. OG Image Design

Dynamic Open Graph images are generated via Satori at `/api/og`.

### 9.1 Specifications

| Property       | Value                                              |
| :------------- | :------------------------------------------------- |
| **Dimensions** | 2400 × 1260px (2× standard for Retina)             |
| **Background** | `#0a0a0a`                                          |
| **Font**       | Faculty Glyphic (fetched from Google Fonts as TTF) |
| **Runtime**    | Edge (Vercel Edge Functions)                       |

### 9.2 Layout Structure

```
┌────────────────────────────────────────────────────────────────┐
│  ○                                              (gradient)  ○  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │  ███ ░░░ ···  COSCIENTIST          coscientist.app      │  │
│  │                                                          │  │
│  │                                                          │  │
│  │                                                          │  │
│  │  Note Title Here                                         │  │
│  │  ───────────────────────────────────                     │  │
│  │  (gradient: white → gray)                                │  │
│  │                                                          │  │
│  │  Description text that provides context                  │  │
│  │  about the note content.                                 │  │
│  │                                                          │  │
│  │  ─────────────────────────────────────────────────────   │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ○                                              (gradient)  ○  │
└────────────────────────────────────────────────────────────────┘
```

### 9.3 Typography

| Element         | Size  | Color                           |
| :-------------- | :---- | :------------------------------ |
| **Brand**       | 32px  | `rgba(255,255,255,0.8)`         |
| **URL**         | 32px  | `rgba(255,255,255,0.4)`         |
| **Title**       | 160px | Gradient: `#ffffff` → `#9ca3af` |
| **Description** | 64px  | `#a1a1aa`                       |

### 9.4 Ambient Effects

```tsx
// Top-right glow
<div style={{
  position: "absolute",
  top: "-300px",
  right: "-100px",
  width: "1200px",
  height: "1200px",
  background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)",
  filter: "blur(80px)",
}} />

// Bottom-left glow
<div style={{
  position: "absolute",
  bottom: "-300px",
  left: "-100px",
  width: "1200px",
  height: "1200px",
  background: "radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)",
  filter: "blur(80px)",
}} />
```

---

## 10. Icons & Favicon

### 10.1 Logo Component

A reusable React component for the 3-bar logo:

```tsx
// src/components/logo.tsx
interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className, size = 20 }: LogoProps) {
  const height = size;
  const width = (36 / 32) * size;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 36 32"
      fill="none"
      className={className}
      aria-label="Coscientist logo"
      role="img"
    >
      <rect
        x="0"
        y="0"
        width="8"
        height="32"
        fill="currentColor"
        fillOpacity="1"
      />
      <rect
        x="14"
        y="0"
        width="8"
        height="32"
        fill="currentColor"
        fillOpacity="0.5"
      />
      <rect
        x="28"
        y="0"
        width="8"
        height="32"
        fill="currentColor"
        fillOpacity="0.2"
      />
    </svg>
  );
}
```

Usage:

```tsx
<Logo size={20} className="text-foreground" />
```

### 10.2 Favicon

Located at `src/app/icon.svg`:

```svg
<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" fill="#0a0a0a"/>
  <rect x="5" y="6" width="6" height="20" fill="white" fill-opacity="1"/>
  <rect x="13" y="6" width="6" height="20" fill="white" fill-opacity="0.5"/>
  <rect x="21" y="6" width="6" height="20" fill="white" fill-opacity="0.2"/>
</svg>
```

### 10.3 Apple Touch Icon

Located at `src/app/apple-icon.svg` (180×180):

```svg
<svg width="180" height="180" viewBox="0 0 180 180" fill="none">
  <rect width="180" height="180" fill="#0a0a0a"/>
  <rect x="30" y="40" width="30" height="100" fill="white" fill-opacity="1"/>
  <rect x="75" y="40" width="30" height="100" fill="white" fill-opacity="0.5"/>
  <rect x="120" y="40" width="30" height="100" fill="white" fill-opacity="0.2"/>
</svg>
```

### 10.4 Files Structure

```
src/app/
├── icon.svg          # Browser favicon (32×32)
├── apple-icon.svg    # Apple touch icon (180×180)
public/
└── logo.svg          # Standalone logo file
```

---

## 11. Accessibility

### 11.1 Motion Preferences

```tsx
import { useReducedMotion } from "@/hooks/use-reduced-motion";

function Component() {
  const prefersReducedMotion = useReducedMotion();

  // Disable animations if user prefers
  const transition = prefersReducedMotion ? { duration: 0 } : springSubtle;
}
```

### 11.2 Semantic Structure

| Component    | Element                     | Attributes                                 |
| :----------- | :-------------------------- | :----------------------------------------- |
| Note Pane    | `<article>`                 | `aria-label={title}`                       |
| All Notes    | `<aside>`                   | Role: complementary                        |
| Close Button | `<button>`                  | `aria-label="Close {title}"`               |
| Spine        | `<button>` (when collapsed) | `aria-label="Expand {title}"`              |
| Logo SVG     | `<svg>`                     | `role="img" aria-label="Coscientist logo"` |

### 11.3 Keyboard Navigation

| Key               | Action                                  |
| :---------------- | :-------------------------------------- |
| `←` / `→`         | Navigate between panes                  |
| `Home`            | Go to first pane                        |
| `End`             | Go to last pane                         |
| `Escape`          | Close current pane                      |
| `Enter` / `Space` | Expand collapsed spine                  |
| `Tab`             | Move focus through interactive elements |

### 11.4 Focus Management

```tsx
// Focus indicators
"focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:ring-inset";

// Ring uses inset to prevent layout shifts
"ring-inset";
```

### 11.5 Color Contrast

| Pair                                 | Ratio  | Pass |
| :----------------------------------- | :----- | :--- |
| `foreground` on `background` (light) | 12.6:1 | AAA  |
| `foreground` on `background` (dark)  | 15.4:1 | AAA  |
| `muted-foreground` on `background`   | 4.8:1  | AA   |
| `link` on `background`               | 4.5:1  | AA   |

---

## 12. Implementation Reference

### 12.1 File Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx          # Root layout with Logo
│   │   └── [[...slug]]/
│   │       ├── page.tsx        # Main page with OG metadata
│   │       └── client.tsx      # Client-side pane orchestration
│   ├── api/og/
│   │   └── route.tsx           # Dynamic OG image generation
│   ├── globals.css             # Design tokens & prose styles
│   ├── icon.svg                # Favicon
│   └── apple-icon.svg          # Apple touch icon
├── components/
│   ├── logo.tsx                # Logo component
│   ├── note-pane.tsx           # Main pane component
│   ├── pane-spine.tsx          # Collapsed spine
│   ├── pane-container.tsx      # Collapse detection logic
│   ├── note-content.tsx        # Markdown renderer
│   ├── all-notes-list.tsx      # Note index sidebar
│   └── ui/                     # Base UI components
├── lib/
│   ├── animations.ts           # Spring configs & variants
│   ├── og/
│   │   └── fonts.ts            # Google Fonts → TTF fetcher
│   └── utils.ts                # cn() helper
└── hooks/
    └── use-reduced-motion.ts   # Motion preference hook
```

### 12.2 Key Dependencies

| Package                    | Purpose                         |
| :------------------------- | :------------------------------ |
| `motion/react`             | Animation (springs, variants)   |
| `@vercel/og`               | OG image generation with Satori |
| `tailwind-merge`           | Class deduplication             |
| `class-variance-authority` | Variant management              |
| `next/font/google`         | Font optimization               |

### 12.3 CSS Custom Properties

```css
:root {
  /* Layout */
  --pane-spine-width: 2.5rem;
  --pane-min-width: 20rem;

  /* Z-Index */
  --z-base: 0;
  --z-pane: 10;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-overlay: 300;
  --z-modal: 400;
  --z-popover: 500;
  --z-toast: 600;

  /* Colors */
  --background: #ffffff;
  --foreground: #262626;
  --link: #2563eb;
  /* ... see globals.css for full list */
}

.dark {
  --background: #0a0a0a;
  --foreground: #ededed;
  --link: #60a5fa;
  /* ... */
}
```

### 12.4 Tailwind Theme Extensions

```css
@theme inline {
  --width-pane-spine: var(--pane-spine-width);
  --width-pane-min: var(--pane-min-width);
  --font-sans: var(--font-faculty-glyphic);
  --font-mono: "Iosevka", ui-monospace, monospace;
  --color-link: var(--link);
  --color-link-visited: var(--link-visited);
  /* ... */
}
```

---

## Changelog

### v1.1.0 — January 2026

- Added ambient gradient system for dark mode
- Redesigned Note Pane with glassmorphism header
- Redesigned Pane Spine with 3-bar logo and minimal index
- Redesigned All Notes List with consistent styling
- Added gradient text effect for titles in dark mode
- Added comprehensive component documentation
- Added Icons & Favicon section
- Added Implementation Reference section

### v1.0.0 — January 2026

- Initial design system documentation
- Core color tokens and typography
- Basic component patterns

---

_Coscientist Design System v1.1.0 — Updated January 2026_
