'use client';

import * as React from 'react';
import type { FloorData } from '../App';

export type RoomKey = keyof FloorData;

export const ROOM_META: { key: RoomKey; label: string }[] = [
  { key: 'livingAreas', label: 'Living Area' },
  { key: 'diningAreas', label: 'Dining Area' },
  { key: 'pantries', label: 'Pantry' },
  { key: 'kitchens', label: 'Kitchen Area' },
  { key: 'parkings', label: 'Parking for Vehicle' },
  { key: 'rooms', label: 'Room' },
  { key: 'bathrooms', label: 'Bathroom' },
];

export const DEFAULT_ROOM_SIZES: Record<RoomKey, number> = {
  livingAreas: 350,
  diningAreas: 180,
  pantries: 195,
  kitchens: 180,
  parkings: 144,
  rooms: 144,
  bathrooms: 40,
};

const SIZES_KEY = 'bismark_room_sizes_v1';
const SHOW_KEY = 'bismark_show_sqft_v1';
const EVENT = 'bismark:room-config';

function notify() {
  try {
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {
    // ignore
  }
}

function sanitizeSizes(input: unknown): Record<RoomKey, number> {
  const out = { ...DEFAULT_ROOM_SIZES };
  if (input && typeof input === 'object') {
    for (const { key } of ROOM_META) {
      const v = Number((input as Record<string, unknown>)[key]);
      if (Number.isFinite(v) && v >= 0 && v <= 100000) out[key] = v;
    }
  }
  return out;
}

export function getRoomSizes(): Record<RoomKey, number> {
  try {
    const raw = localStorage.getItem(SIZES_KEY);
    if (!raw) return { ...DEFAULT_ROOM_SIZES };
    return sanitizeSizes(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_ROOM_SIZES };
  }
}

export function saveRoomSizes(sizes: Record<RoomKey, number>): void {
  try {
    localStorage.setItem(SIZES_KEY, JSON.stringify(sanitizeSizes(sizes)));
  } catch {
    // ignore
  }
  notify();
}

export function getShowSqft(): boolean {
  try {
    const v = localStorage.getItem(SHOW_KEY);
    if (v === null) return true;
    return v !== '0';
  } catch {
    return true;
  }
}

export function setShowSqft(show: boolean): void {
  try {
    localStorage.setItem(SHOW_KEY, show ? '1' : '0');
  } catch {
    // ignore
  }
  notify();
}

export function resetRoomConfig(): void {
  try {
    localStorage.removeItem(SIZES_KEY);
    localStorage.removeItem(SHOW_KEY);
  } catch {
    // ignore
  }
  notify();
}

/** Reactive hook — re-reads config when admin saves or another tab changes it. */
export function useRoomConfig() {
  const [sizes, setSizes] = React.useState<Record<RoomKey, number>>(DEFAULT_ROOM_SIZES);
  const [showSqft, setShow] = React.useState(true);

  React.useEffect(() => {
    const read = () => {
      setSizes(getRoomSizes());
      setShow(getShowSqft());
    };
    read();
    window.addEventListener(EVENT, read);
    window.addEventListener('storage', read);
    return () => {
      window.removeEventListener(EVENT, read);
      window.removeEventListener('storage', read);
    };
  }, []);

  return { sizes, showSqft };
}

/** Total sqft for one floor using the admin-configured sizes (before 5% walls factor). */
export function floorRawSqft(floor: FloorData, sizes?: Record<RoomKey, number>): number {
  const s = sizes ?? getRoomSizes();
  return (Object.keys(s) as RoomKey[]).reduce((t, k) => t + (floor[k] as number) * s[k], 0);
}

/** Total sqft across floors including the 5% wall factor. */
export function totalSqftForFloors(floors: FloorData[], sizes?: Record<RoomKey, number>): number {
  const s = sizes ?? getRoomSizes();
  return floors.reduce((t, f) => t + floorRawSqft(f, s), 0) * 1.05;
}
