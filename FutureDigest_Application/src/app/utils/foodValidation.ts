/**
 * Food validation utilities
 * Handles food name validation against database
 */

import foodData from '../../data/foods.json';

/**
 * Validates if a food name exists in the database
 * Case-insensitive, trims whitespace
 */
export function validateFoodName(foodName: string): boolean {
  const normalizedInput = foodName.toLowerCase().trim();
  
  if (!normalizedInput) return false;
  
  return foodData.foods.some(food => 
    food.name.toLowerCase() === normalizedInput
  );
}

/**
 * Get food item by name
 */
export function getFoodByName(foodName: string) {
  const normalizedInput = foodName.toLowerCase().trim();
  return foodData.foods.find(food => 
    food.name.toLowerCase() === normalizedInput
  );
}

/**
 * Get all food names (for autocomplete/suggestions)
 */
export function getAllFoodNames(): string[] {
  return foodData.foods.map(food => food.name);
}

/**
 * Normalize food name for display (capitalize first letter)
 */
export function normalizeFoodName(foodName: string): string {
  return foodName.trim().charAt(0).toUpperCase() + foodName.trim().slice(1).toLowerCase();
}
