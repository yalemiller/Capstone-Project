/**
 * Transform food data for bar chart visualization
 */
export function transformFoodDataForChart(foods = []) {
  return foods.map((food) => ({
    name: food.name,
    current: food.cost?.currentAvg ?? 0,
    predicted: food.cost?.predictedAvg ?? 0,
    increase: (food.cost?.predictedAvg ?? 0) - (food.cost?.currentAvg ?? 0),
  }));
}

/**
 * Calculate percentage increase in cost
 */
export function calculatePercentageIncrease(current, predicted) {
  if (!current || current === 0) return 0;
  return Math.round(((predicted - current) / current) * 100);
}

/**
 * Format currency value
 */
export function formatCurrency(value, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value ?? 0);
}

/**
 * Get risk level color (60s inspired palette)
 */
export function getRiskColor(riskLevel) {
  const colors = {
    low: '#95e1d3',
    moderate: '#ffd93d',
    major: '#ff6b6b',
    critical: '#f38181',
  };

  return colors[riskLevel] || '#cccccc';
}

/**
 * Filter foods by risk level
 */
export function filterByRiskLevel(foods = [], riskLevel) {
  return foods.filter((food) => food.riskLevel === riskLevel);
}

/**
 * Sort foods by cost increase
 */
export function sortByCostIncrease(foods = [], ascending = false) {
  return [...foods].sort((a, b) => {
    const increaseA = (a.cost?.predictedAvg ?? 0) - (a.cost?.currentAvg ?? 0);
    const increaseB = (b.cost?.predictedAvg ?? 0) - (b.cost?.currentAvg ?? 0);

    return ascending ? increaseA - increaseB : increaseB - increaseA;
  });
}

/**
 * Get total current and projected cost for selected foods
 */
export function getSelectedFoodsCostTotals(selectedFoods = [], foods = []) {
  if (!Array.isArray(selectedFoods) || !Array.isArray(foods)) {
    return { currentTotal: 0, predictedTotal: 0 };
  }

  const selected = foods.filter((food) =>
    selectedFoods.some(selected => 
      selected.toLowerCase().trim() === food.name.toLowerCase().trim()
    )
  );

  const currentTotal = selected.reduce(
    (sum, food) => sum + (food.cost?.currentAvg ?? 0),
    0
  );

  const predictedTotal = selected.reduce(
    (sum, food) => sum + (food.cost?.predictedAvg ?? 0),
    0
  );

  return { currentTotal, predictedTotal };
}