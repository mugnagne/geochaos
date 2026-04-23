import { CategorySpec } from '../types';

export const CATEGORIES: CategorySpec[] = [
  { id: 'alcoholConsumption', label: "Conso. Alcool", unit: 'L/hab', description: "Consommation annuelle d'alcool pur par personne." },
  { id: 'averageTemp', label: "Température", unit: '°C', description: "Température moyenne annuelle." },
  { id: 'povertyIndex', label: "Indice Faim", unit: 'pts', description: "Global Hunger Index (plus haut = plus de faim)." },
  { id: 'coffeeProduction', label: "Prod. Café", unit: 'tonnes', description: "Production annuelle de café." },
  { id: 'corruptionIndex', label: "Transparence", unit: '/100', description: "Indice de perception de la corruption (100 = propre)." },
  { id: 'suicideRate', label: "Suicide", unit: '/100k', description: "Nombre de suicides annuel pour 100 000 habitants." },
  { id: 'democracyScore', label: "Démocratie", unit: '/10', description: "Indice de démocratie (The Economist)." },
  { id: 'riceProduction', label: "Prod. Riz", unit: 'tonnes', description: "Production annuelle de riz." },
  { id: 'highestPoint', label: "Altitude Max", unit: 'm', description: "Point le plus élevé du territoire." },
  { id: 'homicideRate', label: "Homicides", unit: '/100k', description: "Taux d'homicides volontaires pour 100 000 personnes." },
  { id: 'obesityRate', label: "Obésité", unit: '%', description: "Pourcentage de la population adulte obèse." },
  { id: 'aged65Plus', label: "Population Senior", unit: '%', description: "Part de la population âgée de plus de 65 ans." },
  { id: 'netMigrationRate', label: "Solde Migratoire", unit: '‰', description: "Différence entre immigrés et émigrés pour 1000 habitants." },
  { id: 'fertilityRate', label: "Fécondité", unit: 'enf/femme', description: "Nombre moyen d'enfants par femme." },
  { id: 'youthPopulation', label: "Jeunesse", unit: '%', description: "Part de la population de moins de 15 ans." },
];
