# Scenes 7-9 Tuning Guide

This file lists the hardcoded values you can change to tune person size, person slicing alignment, food-to-stomach alignment, and scroll/snap behavior for the last three screens.

## Primary Files

- `src/app/components/PersonSlice79.tsx`
- `src/app/scenes/Scene7.tsx`
- `src/app/scenes/Scene8.tsx`
- `src/app/scenes/Scene9.tsx`
- `src/app/hooks/useScrollSnap.ts`
- `src/app/hooks/useScrollProgress.ts`

## 1) Person Geometry And 3-Slice Alignment (Scene 7-9)

File: `src/app/components/PersonSlice79.tsx`

### `PERSON2_CONFIG`

- `widthVw: 44`
- `leftVw: 2`
- `topVh: -18`
- `offsetUpPx: -150`

What each does:

- `widthVw`: person visual size. Higher value makes the person larger.
- `leftVw`: horizontal screen position from the left. Higher value moves right.
- `topVh`: base vertical position for all 3 sections. More negative moves person up.
- `offsetUpPx`: final pixel correction after vh math. More negative moves up.

### Segment Mapping (No Parallax)

Current hardcoded scene segmentation (mounted by scene):

- `Scene7.tsx`: `<PersonSlice79 slice="top" />`
- `Scene8.tsx`: `<PersonSlice79 slice="middle" />`
- `Scene9.tsx`: `<PersonSlice79 slice="bottom" />`

Core hardcoded slice math:

- `SLICE_OFFSET.top = 0`
- `SLICE_OFFSET.middle = -33.333333`
- `SLICE_OFFSET.bottom = -66.666666`

Meaning:

- Scene 7 translate: `0%`
- Scene 8 translate: `-33.333333%`
- Scene 9 translate: `-66.666666%`

This gives strict equal slicing and perfect x/y alignment across sections because only image translate changes, not person scale or x-position.

Because the person is scene-mounted (not global/fixed), it scrolls with page content and does not need global visibility gating.

## 2) Food Labels Relative To Stomach (Scene 8)

File: `src/app/components/PersonSlice79.tsx`

### Stomach Anchor Values

- `BELLY_ANCHOR.xPct: 0.57`
- `BELLY_ANCHOR.yPct: 0.43`
- Food container transform: `translate(-40%, -12%)`

How to tune:

- Increase `xPct` to move labels right on the torso.
- Decrease `xPct` to move labels left.
- Increase `yPct` to move labels lower.
- Decrease `yPct` to move labels higher.
- More negative X in `translate(...)` moves the label stack left.
- More negative Y in `translate(...)` moves the label stack up.

### Food Label Layout Values

- `gap: '0.9vh'`
- `width: '30%'`
- `minHeight: '5.8vh'`
- `padding: '0 0.7vw'`
- `borderRadius: 'clamp(8px, 0.9vw, 16px)'`
- `fontSize: 'clamp(12px, 0.95vw, 20px)'`

### Food Visibility Window

- Food blocks render only in middle slice mode (`slice === 'middle'`)
- Scene 8 is the only scene passing middle mode

If labels appear detached, first tune anchor and translate values, then tune this visibility window.

## 3) Scene 8 Horizontal Scroll And Card Motion

File: `src/app/scenes/Scene8.tsx`

### Snap Timing

- `SNAP_IDLE_DELAY_MS = 120`
- `SNAP_LOCK_MS = 280`

- Lower these values for snappier behavior.
- Raise these values for calmer behavior.

### Velocity Projection

In target index calculation:

- Projection scale: `velocity * 0.22`
- Clamp: `-0.35` to `0.35`

- Lower projection scale for less aggressive forward snapping.
- Raise projection scale for stronger momentum feel.

### Stack Transform Multipliers

In card render loop:

- Distance clamp: `clamp(index - scrollProgress, -2.5, 2.5)`
- `cardScale = 1 - depth * 0.08`
- `cardRotate = stackDistance * -6`
- `cardX = stackDistance * 34`
- `cardY = depth * 18`
- `cardOpacity = 1 - depth * 0.2`

These are the core hardcoded values for card depth/parallax style.

### Spring Settings

`motion.div` transition:

- `type: 'spring'`
- `stiffness: 220`
- `damping: 24`
- `mass: 0.7`

### Scene 8 Rail And Card Dimensions

- Scroll rail left edge: `left: '43vw'`
- Rail padding: `paddingLeft: '1.2vw'`, `paddingRight: '3vw'`
- Rail gap: `gap: '1.6vw'`
- Card frame: `width: '53vw'`, `height: '90vh'`, `padding: '0.7vw'`
- Inner panel frame: `w-[47vw]`, `h-[88vh]`

## 4) Vertical Scene Snap Timing

File: `src/app/hooks/useScrollSnap.ts`

- Snap debounce: `140` ms
- Snap unlock after smooth scroll: `380` ms
- `scrollToScene` unlock timeout: `1000` ms

These values can indirectly affect how late-scene motion feels because scene boundaries are reached according to this snapping behavior.

## 5) Continuous Progress Scale

File: `src/app/hooks/useScrollProgress.ts`

- Progress formula: `scrollTop / window.innerHeight`

Meaning:

- Scene 7 top is around `6`
- Scene 8 top is around `7`
- Scene 9 top is around `8`

Scene boundaries still use this scale; slices are now scene-mounted instead of threshold-switched in a global overlay.

## 6) Quick Preset For Requested Behavior

Requested intent:

- Scene 7: person comes with background, not a top drop.
- Scene 8: food stays stomach-anchored.
- Scene 9: feet framing.

Current preset that implements that intent:

- Strict 3 slices via `-segmentIndex * 33.333333%`
- Scene 7 is top third, Scene 8 middle third, Scene 9 bottom third
- Food blocks mounted only in Scene 8 using stomach anchor
- Base alignment controlled by `leftVw`, `topVh`, `offsetUpPx`, `widthVw` in `PersonSlice79.tsx`

If you want the whole person framing lower across all 3 scenes:

- Increase `topVh` and/or make `offsetUpPx` less negative.

If you want the whole person framing higher across all 3 scenes:

- Decrease `topVh` and/or make `offsetUpPx` more negative.
