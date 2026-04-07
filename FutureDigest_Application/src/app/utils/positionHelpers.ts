/**
 * Position calculation utilities
 * Helps calculate dynamic positions for elements coupled to other elements
 */

/**
 * Calculate stomach container position based on person image transform
 * This couples the stomach container to the person image so they move together
 * 
 * @param personLeft - Left position of person image (in px string)
 * @param personTop - Top position of person image (in px string)
 * @param personScale - Scale factor of person image
 * @param stomachOffset - Offset configuration for stomach relative to person
 * @returns Calculated position object for stomach container
 */
export function calculateStomachPosition(
  personLeft: string,
  personTop: string,
  personScale: number,
  stomachOffset: {
    leftOffset: number;
    topOffset: number;
    width: number;
    height: number;
  }
) {
  // Parse pixel values
  const personLeftPx = parseFloat(personLeft);
  const personTopPx = parseFloat(personTop);

  // Calculate scaled offsets
  const scaledLeftOffset = stomachOffset.leftOffset * personScale;
  const scaledTopOffset = stomachOffset.topOffset * personScale;
  const scaledWidth = stomachOffset.width * personScale;
  const scaledHeight = stomachOffset.height * personScale;

  // Calculate final position
  const left = personLeftPx + scaledLeftOffset;
  const top = personTopPx + scaledTopOffset;

  return {
    left: `${left}px`,
    top: `${top}px`,
    width: `${scaledWidth}px`,
    height: `${scaledHeight}px`,
    // Return scale for any child elements that need it
    scale: personScale,
  };
}

/**
 * Calculate food block size based on container scale
 * Ensures food blocks scale proportionally with the stomach container
 */
export function calculateFoodBlockSize(
  baseHeight: string,
  containerScale: number
) {
  const baseHeightPx = parseFloat(baseHeight);
  return `${baseHeightPx * containerScale}px`;
}

/**
 * Calculate gap size based on container scale
 */
export function calculateGapSize(
  baseGap: string,
  containerScale: number
) {
  const baseGapPx = parseFloat(baseGap);
  return `${baseGapPx * containerScale}px`;
}
