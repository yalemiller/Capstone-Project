/**
 * Transform food data for bar chart visualization
 */
export function transformFoodDataForChart(foods) {
  return foods.map((food) => ({
    name: food.name,
    current: food.cost.currentAvg,
    predicted: food.cost.predictedAvg,
    increase: food.cost.predictedAvg - food.cost.currentAvg,
  }));
}

/**
 * Calculate percentage increase in cost
 */
export function calculatePercentageIncrease(current, predicted) {
  return Math.round(((predicted - current) / current) * 100);
}

/**
 * Format currency value
 */
export function formatCurrency(value, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(value);
}

/**
 * Get risk level color (60s inspired palette)
 */
export function getRiskColor(riskLevel) {
  const colors = {
    low: '#95e1d3',     // Mint green
    moderate: '#ffd93d', // Yellow
    major: '#ff6b6b',    // Red
    critical: '#f38181', // Coral red
  };
  return colors[riskLevel] || '#cccccc';
}

/**
 * Filter foods by risk level
 */
export function filterByRiskLevel(foods, riskLevel) {
  return foods.filter((food) => food.riskLevel === riskLevel);
}

/**
 * Sort foods by cost increase
 */
export function sortByCostIncrease(foods, ascending = false) {
  return [...foods].sort((a, b) => {
    const increaseA = a.cost.predictedAvg - a.cost.currentAvg;
    const increaseB = b.cost.predictedAvg - b.cost.currentAvg;
    return ascending ? increaseA - increaseB : increaseB - increaseA;
  });
}
