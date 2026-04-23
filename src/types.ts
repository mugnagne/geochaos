export interface Country {
  name: string;
  density: number;
  abbreviation: string;
  agriculturalLand: number;
  landArea: number;
  armedForces: number;
  birthRate: number;
  callingCode: string;
  capital: string;
  co2Emissions: number;
  cpi: number;
  cpiChange: number;
  currency: string;
  fertilityRate: number;
  forestedArea: number;
  gasolinePrice: number;
  gdp: number;
  educationPrimary: number;
  educationTertiary: number;
  infantMortality: number;
  largestCity: string;
  lifeExpectancy: number;
  maternalMortality: number;
  minimumWage: number;
  officialLanguage: string;
  outOfPocketHealth: number;
  physiciansPerThousand: number;
  population: number;
  laborForce: number;
  taxRevenue: number;
  totalTaxRate: number;
  unemploymentRate: number;
  urbanPopulation: number;
  latitude: number;
  longitude: number;
  // 15 Catégories basées strictement sur les CSV fournis
  alcoholConsumption?: number;
  averageTemp?: number;
  povertyIndex?: number;
  coffeeProduction?: number;
  corruptionIndex?: number;
  suicideRate?: number;
  democracyScore?: number;
  riceProduction?: number;
  highestPoint?: number;
  homicideRate?: number;
  obesityRate?: number;
  aged65Plus?: number;
  netMigrationRate?: number;
  fertilityRate?: number;
  youthPopulation?: number;
  
  // Métadonnées pour les warnings
  isEstimated?: Record<string, boolean>;
  region?: string;
}

export type ChallengeDirection = 'HIGHER' | 'LOWER';

export interface GameCategory extends CategorySpec {
  direction: ChallengeDirection;
}

export interface CategorySpec {
  id: keyof Country;
  label: string;
  unit: string;
  description: string;
}

export type GameState = 'START' | 'PLAYING' | 'END';

export interface Round {
  country: Country;
  category: GameCategory;
  rank: number;
  value: number;
}
