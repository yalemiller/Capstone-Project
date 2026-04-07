/**
 * Application-wide constants
 * Centralized location for all magic numbers, colors, and configuration
 */

import { appContent } from '../data/appContent';

// ============================================
// SCENE CONFIGURATION
// ============================================

export const TOTAL_SCENES = 9;

// ============================================
// COLORS
// ============================================

export const COLORS = {
  turquoise: '#2ea3bd',
  yellow: '#fae850',
  white: '#ffffff',
  purple: '#a949ea',
  lavender: '#bbbdfd',
  orange: '#f5c255',
  green: '#52c467',
  sunYellow: '#F4CF4B',
  foodBlock: '#47c6da',
  gray: {
    light: '#d9d9d9',
    medium: '#d2d2d2',
    dark: '#8A8A8A',
  },
} as const;

// ============================================
// SCENE 3 CONFIGURATION
// ============================================

// Sun arc path coordinates (creating a natural arc across the sky)
export const SUN_ARC_PATH = [
  { x: 74, y: 725 },    // Morning - bottom left
  { x: 457, y: 200 },   // Lunch - top middle-left
  { x: 941, y: 200 },   // Snack - top middle-right  
  { x: 1517, y: 676 },  // Dinner - bottom right
] as const;

export const SCENE_3_STEPS = [
  {
    id: 1,
    prompt: "I start my morning off with...",
    gradient: `linear-gradient(180deg, #2ea3bd 0%, #FFB347 100%)`, // Sky blue to warm orange (sunrise)
    sunPosition: { left: '74px', top: '300px' },
    timeOfDay: 'morning',
  },
  {
    id: 2,
    prompt: "For lunch I'll have...",
    gradient: `linear-gradient(180deg, #4A90E2 0%, #87CEEB 50%, #FFFFFF 100%)`, // Bright blue to white (midday)
    sunPosition: { left: '457px', top: '200px' },
    timeOfDay: 'lunch',
  },
  {
    id: 3,
    prompt: "For a snack I usually have...",
    gradient: `linear-gradient(180deg, #FF6B6B 0%, #FFA07A 50%, #FFD700 100%)`, // Red to coral to gold (golden hour)
    sunPosition: { left: '941px', top: '200px' },
    timeOfDay: 'snack',
  },
  {
    id: 4,
    prompt: "For dinner I like to eat...",
    gradient: `linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)`, // Dark navy to deep blue (night)
    sunPosition: { left: '1517px', top: '676px' },
    timeOfDay: 'dinner',
  },
] as const;

export const SCENE_3_CONFIG = {
  helperText: appContent.scenes.scene3.helperText,
  completionText: appContent.scenes.scene3.completionText,
  personPosition: {
    left: '1150px',  // Moved right from 900px to 1150px (250px right)
    top: '-1080px',  // Changed from -1150px to -1080px for seamless Scene 2→3 transition
    scale: 1.5,
  },
  // Stomach position relative to person image (percentage-based for coupling)
  stomachRelativePosition: {
    // These are offsets from the person's position
    leftOffset: 250,      // Pixels right from person left edge (moved left from 280)
    topOffset: 1200,      // Pixels down from person top edge (moved up from 1451)
    width: 325,           // Width of stomach area
    height: 534,          // Height of stomach area
  },
  foodBlockContainer: {
    left: '1430px',  // Updated from 1180px (moved right 250px to match person)
    top: '371px',    // Adjusted from 301px (moved down 70px to account for new person top position)
    width: '325px',
    height: '534px',
    gap: '6px',
  },
  foodBlockSize: {
    height: '114px',
    borderRadius: '25px',
  },
} as const;

// ============================================
// ANIMATION DURATIONS
// ============================================

export const ANIMATION_DURATION = {
  fast: 0.3,
  normal: 0.5,
  slow: 0.8,
  transition: 1.5,
  bob: 2,
} as const;

export const ANIMATION_DELAYS = {
  short: 0.2,
  medium: 0.3,
  long: 0.5,
  initial: 1,
  afterInitial: 1.5,
} as const;

// ============================================
// COMMON DIMENSIONS
// ============================================

export const DIMENSIONS = {
  sun: {
    size: '305px',
    radius: 152.5,
  },
  ground: {
    height: '1004px',
    width: '3617px',
    radiusX: 1308.5,
    radiusY: 302,
  },
  progressIndicator: {
    dotSize: '30px',
    spacing: '40px',
  },
} as const;

// ============================================
// Z-INDEX LAYERS
// ============================================

export const Z_INDEX = {
  background: 0,
  ground: 1,
  person: 2,
  content: 3,
  overlay: 40,
  modal: 50,
} as const;

// ============================================
// TYPOGRAPHY
// ============================================

export const FONTS = {
  inter: {
    regular: "'Inter:Regular',sans-serif",
    bold: "'Inter:Bold',sans-serif",
    extraBold: "'Inter:Extra_Bold',sans-serif",
  },
} as const;

// ============================================
// VALIDATION
// ============================================

export const VALIDATION = {
  errorFlashDuration: 500, // ms
  inputDebounce: 300, // ms
} as const;