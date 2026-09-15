import type { CalculatorData } from '../App';

export const SQFT_PER_PERCH = 272.25;
export const BUILDABLE_RATIO = 0.6;
export const CONSTRUCTION_RATE = 10982;
export const CLAY_TILE_RATE = 11090;

const ROOM_SQFT: Record<string, number> = {
  livingAreas: 350,
  diningAreas: 180,
  pantries: 195,
  kitchens: 180,
  parkings: 144,
  rooms: 144,
  bathrooms: 40,
};

export function getRoofName(roofType: string): string {
  switch (roofType) {
    case 'concrete':
      return 'Full Concrete Slab';
    case 'halfConcrete':
      return '50% Concrete Slab';
    case 'clayTiles':
      return 'Clay Tile Roof';
    default:
      return 'Full Timber Roof';
  }
}

export type QuoteTotals = {
  totalLandSqft: number;
  usableLandSqft: number;
  allowedSqft: number;
  totalSqft: number;
  remainingSqft: number;
  constructionCost: number;
  roofCost: number;
  roofName: string;
  totalCost: number;
};

export function computeTotals(data: CalculatorData): QuoteTotals {
  const totalLandSqft = data.perches * SQFT_PER_PERCH;
  const usableLandSqft = totalLandSqft * BUILDABLE_RATIO;
  const allowedSqft = usableLandSqft * data.stories;

  let raw = 0;
  data.floors.forEach((floor) => {
    (Object.keys(ROOM_SQFT) as (keyof typeof ROOM_SQFT & keyof typeof floor)[]).forEach((key) => {
      raw += (floor[key] as number) * ROOM_SQFT[key];
    });
  });
  const totalSqft = raw * 1.05;
  const remainingSqft = allowedSqft - totalSqft;
  const constructionCost = totalSqft * CONSTRUCTION_RATE;

  let roofCost = 0;
  switch (data.roofType) {
    case 'concrete':
      roofCost = 3300000;
      break;
    case 'halfConcrete':
      roofCost = 2200000;
      break;
    case 'clayTiles':
      roofCost = totalSqft * CLAY_TILE_RATE;
      break;
    default:
      roofCost = 0;
  }

  return {
    totalLandSqft,
    usableLandSqft,
    allowedSqft,
    totalSqft,
    remainingSqft,
    constructionCost,
    roofCost,
    roofName: getRoofName(data.roofType),
    totalCost: constructionCost + roofCost,
  };
}

export function formatLKR(n: number): string {
  return `LKR ${Math.round(n).toLocaleString()}`;
}
