# Visual Phenomena

Static SvelteKit site with interactive demos of visual illusions, built from reusable components
organised along atomic design.

## Setup

Requires Node.js with corepack (yarn version is pinned in `package.json`) and
[Task](https://taskfile.dev).

```sh
corepack enable
task install
task dev        # dev server
task build      # static output in build/
task ci         # format check + typecheck + build
```

## Structure

```
src/lib/components/
  atoms/       ChevronArrow, Notice, Segmented, Slider, Toggle
  molecules/   ControlGroup, PhenomenonCard
  organisms/   one per phenomenon (ArrowField, CafeWall, LilacChaser, ...)
  templates/   PhenomenonLayout
src/lib/clock.svelte.ts     PhaseClock: one rAF clock so modulated elements stay in phase
src/lib/playback.svelte.ts  play/pause that respects prefers-reduced-motion
src/lib/phenomena.ts        registry driving the index page and its live previews
src/routes/phenomena/       one route per phenomenon
docs/research/              background research notes
```

To add a phenomenon: build its organism, add a route under `src/routes/phenomena/<slug>/`,
and register it (with a preview) in `src/lib/phenomena.ts`.
