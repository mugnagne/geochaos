import { Country, GameCategory } from '../types';

/**
 * Calculates the exact competition rank (1, 1, 3 pattern) for a country within a specific category.
 * Handles the dual-objective system (HIGHER or LOWER).
 */
export function calculateRank(
  targetCountry: Country,
  category: GameCategory,
  allCountries: Country[]
): number {
  const currentValue = targetCountry[category.id] as number;
  
  if (currentValue === undefined || currentValue === null) return allCountries.length;

  const betterCount = allCountries.reduce((count, otherCountry) => {
    const otherValue = otherCountry[category.id] as number;
    
    if (otherValue === undefined || otherValue === null) return count;

    // Challenge HIGHER: #1 is the biggest value
    // Challenge LOWER: #1 is the smallest value
    if (category.direction === 'HIGHER') {
      return otherValue > currentValue ? count + 1 : count;
    } else {
      return otherValue < currentValue ? count + 1 : count;
    }
  }, 0);

  return betterCount + 1;
}
