import { Minus, Plus } from 'lucide-react';
import { FloorData } from '../App';
import { ROOM_META, useRoomConfig } from '../lib/roomConfig';

type Props = {
  floorName: string;
  floorData: FloorData;
  onUpdate: (data: FloorData) => void;
};

export function FloorPlanning({ floorName, floorData, onUpdate }: Props) {
  const { sizes, showSqft } = useRoomConfig();
  const roomTypes = ROOM_META.map((r) => ({ ...r, size: sizes[r.key] }));

  const updateCount = (key: keyof FloorData, delta: number) => {
    const currentValue = floorData[key] as number;
    const newValue = Math.max(0, Math.min(10, currentValue + delta));
    onUpdate({ ...floorData, [key]: newValue });
  };

  const calculateFloorTotal = () => {
    return roomTypes.reduce((total, room) => {
      return total + (floorData[room.key] as number) * room.size;
    }, 0);
  };

  return (
    <div className="border-2 border-gray-200 dark:border-neutral-800 rounded-lg p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-white dark:from-neutral-900 dark:to-neutral-900 min-w-0 overflow-x-clip">
      <h3 className="text-xl font-bold text-gray-900 dark:text-neutral-100 mb-4">{floorName}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {roomTypes.map((room) => {
          const count = floorData[room.key] as number;
          return (
            <div key={room.key} className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-4 min-w-0">
              <div className="flex justify-between items-start gap-2 mb-3">
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 dark:text-neutral-100 break-words">{room.label}</p>
                  {showSqft && (
                    <p className="text-sm text-gray-500 dark:text-neutral-400 whitespace-nowrap">{room.size} sqft each</p>
                  )}
                </div>
                <p className="text-sm font-semibold text-[#ED9420] shrink-0 text-right">
                  {(count * room.size).toLocaleString()} sqft
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateCount(room.key, -1)}
                  disabled={count === 0}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus size={18} />
                </button>

                <div className="flex-1 text-center">
                  <span className="text-2xl font-bold text-gray-900 dark:text-neutral-100">{count}</span>
                </div>

                <button
                  type="button"
                  onClick={() => updateCount(room.key, 1)}
                  disabled={count >= 10}
                  className="w-10 h-10 flex items-center justify-center bg-[#ED9420] hover:bg-[#d67f12] text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-[#ED9420]/10 border border-[#ED9420]/30 rounded-lg p-4">
        <div className="flex justify-between items-center gap-2">
          <span className="font-semibold text-gray-900 dark:text-neutral-100 min-w-0 break-words">{floorName} Total:</span>
          <span className="text-lg sm:text-xl font-bold text-[#ED9420] shrink-0 text-right">{calculateFloorTotal().toLocaleString()} sqft</span>
        </div>
      </div>
    </div>
  );
}
