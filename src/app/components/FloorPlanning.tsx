import { Minus, Plus } from 'lucide-react';
import { FloorData } from '../App';

type Props = {
  floorName: string;
  floorData: FloorData;
  onUpdate: (data: FloorData) => void;
};

const roomTypes = [
  { key: 'livingAreas' as keyof FloorData, label: 'Living Area', size: 350 },
  { key: 'diningAreas' as keyof FloorData, label: 'Dining Area', size: 180 },
  { key: 'pantries' as keyof FloorData, label: 'Pantry', size: 195 },
  { key: 'kitchens' as keyof FloorData, label: 'Kitchen Area', size: 180 },
  { key: 'parkings' as keyof FloorData, label: 'Parking for Vehicle', size: 144 },
  { key: 'rooms' as keyof FloorData, label: 'Room', size: 144 },
  { key: 'bathrooms' as keyof FloorData, label: 'Bathroom', size: 40 },
];

export function FloorPlanning({ floorName, floorData, onUpdate }: Props) {
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
    <div className="border-2 border-gray-200 dark:border-neutral-800 rounded-lg p-6 bg-gradient-to-br from-gray-50 to-white dark:from-neutral-900 dark:to-neutral-900">
      <h3 className="text-xl font-bold text-gray-900 dark:text-neutral-100 mb-4">{floorName}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {roomTypes.map((room) => {
          const count = floorData[room.key] as number;
          return (
            <div key={room.key} className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium text-gray-900 dark:text-neutral-100">{room.label}</p>
                  <p className="text-sm text-gray-500 dark:text-neutral-400">{room.size} sqft each</p>
                </div>
                <p className="text-sm font-semibold text-[#ED9420]">
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
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-900 dark:text-neutral-100">{floorName} Total:</span>
          <span className="text-xl font-bold text-[#ED9420]">{calculateFloorTotal().toLocaleString()} sqft</span>
        </div>
      </div>
    </div>
  );
}
