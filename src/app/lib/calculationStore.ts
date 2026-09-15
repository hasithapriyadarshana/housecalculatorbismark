import type { CalculatorData } from '../App';
import { computeTotals, type QuoteTotals } from './calculations';

export type SavedCalculation = {
  id: string;
  createdAt: string;
  updatedAt: string;
  user: CalculatorData['user'];
  perches: number;
  stories: number;
  floors: CalculatorData['floors'];
  roofType: string;
  totals: QuoteTotals;
};

const STORAGE_KEY = 'bismark_calculations_v1';

export function loadCalculations(): SavedCalculation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedCalculation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(all: SavedCalculation[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // storage full / unavailable — ignore
  }
}

/** Insert or update the record for a calculator session. */
export function upsertCalculation(sessionId: string, data: CalculatorData): SavedCalculation {
  const all = loadCalculations();
  const now = new Date().toISOString();
  const existing = all.find((c) => c.id === sessionId);
  const record: SavedCalculation = {
    id: sessionId,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    user: data.user,
    perches: data.perches,
    stories: data.stories,
    floors: data.floors,
    roofType: data.roofType,
    totals: computeTotals(data),
  };
  persist([record, ...all.filter((c) => c.id !== sessionId)]);
  return record;
}

export function deleteCalculation(id: string) {
  persist(loadCalculations().filter((c) => c.id !== id));
}

export function clearCalculations() {
  persist([]);
}

export function newSessionId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
