import { ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { CalculatorData } from '../App';
import { FloorPlanning } from './FloorPlanning';

type Props = {
  data: CalculatorData;
  onUpdate: (floors: CalculatorData['floors']) => void;
  onNext: () => void;
  onPrev: () => void;
};

export function SpacePlanningStep({ data, onUpdate, onNext, onPrev }: Props) {
  const usableLandSqft = data.perches * 272.25 * 0.6;
  const allowedSqft = usableLandSqft * data.stories;

  const calculateTotalSqft = () => {
    let total = 0;
    data.floors.forEach((floor) => {
      total += floor.livingAreas * 350;
      total += floor.diningAreas * 180;
      total += floor.pantries * 195;
      total += floor.kitchens * 180;
      total += floor.parkings * 144;
      total += floor.rooms * 144;
      total += floor.bathrooms * 40;
    });
    return total * 1.05;
  };

  const totalSqft = calculateTotalSqft();
  const remainingSqft = allowedSqft - totalSqft;
  const usagePercentage = (totalSqft / allowedSqft) * 100;
  const isExceeded = totalSqft > allowedSqft;

  const floorNames = ['Ground Floor', 'First Floor', 'Second Floor'];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Plan Your House Spaces</h2>
      <p className="text-gray-600 mb-8">Select the number of each room type for your house</p>

      {isExceeded && (
        <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 mb-6 animate-shake">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-red-500" size={24} />
            <div>
              <p className="font-semibold text-red-900">Land Size Limit Exceeded!</p>
              <p className="text-sm text-red-700">
                You cannot add more areas. Your land size limit has been exceeded by{' '}
                {Math.abs(remainingSqft).toLocaleString()} sqft.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6 mb-8">
        {data.floors.map((floor, index) => (
          <FloorPlanning
            key={index}
            floorName={floorNames[index]}
            floorData={floor}
            onUpdate={(updatedFloor) => {
              const newFloors = [...data.floors];
              newFloors[index] = updatedFloor;
              onUpdate(newFloors);
            }}
          />
        ))}
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onPrev}
          className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={20} />
          Previous
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={isExceeded || totalSqft === 0}
          className="flex-1 flex items-center justify-center gap-2 bg-[#ED9420] hover:bg-[#d67f12] text-white font-semibold py-3 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Next Step
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
