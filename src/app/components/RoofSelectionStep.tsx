import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { CalculatorData } from '../App';

type Props = {
  roofType: string;
  data: CalculatorData;
  onUpdate: (roofType: string) => void;
  onNext: () => void;
  onPrev: () => void;
};

export function RoofSelectionStep({ roofType, data, onUpdate, onNext, onPrev }: Props) {
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

  const roofOptions = [
    { id: 'timber', name: 'Full Timber Roof', cost: 0, description: 'Traditional timber roofing' },
    { id: 'concrete', name: 'Full Concrete Slab', cost: 3300000, description: 'Complete concrete coverage' },
    { id: 'halfConcrete', name: '50% Concrete Slab', cost: 2200000, description: 'Partial concrete coverage' },
    { id: 'clayTiles', name: 'Clay Tile Roof', cost: totalSqft * 11090, description: 'Premium clay tiles' },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Select Your Roof Type</h2>
      <p className="text-gray-600 mb-8">Choose the roofing option that suits your budget and preferences</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {roofOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onUpdate(option.id)}
            className={`relative p-6 rounded-lg border-2 transition-all text-left ${
              roofType === option.id
                ? 'border-[#ED9420] bg-[#ED9420]/10 shadow-lg'
                : 'border-gray-300 hover:border-[#ED9420]/50 bg-white'
            }`}
          >
            {roofType === option.id && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-[#ED9420] rounded-full flex items-center justify-center">
                <Check size={16} className="text-white" />
              </div>
            )}
            <div>
              <p className="font-bold text-lg text-gray-900 mb-1">{option.name}</p>
              <p className="text-sm text-gray-600 mb-3">{option.description}</p>
              <p className="text-2xl font-bold text-[#ED9420]">
                {option.cost === 0 ? 'No Additional Cost' : `LKR ${option.cost.toLocaleString()}`}
              </p>
            </div>
          </button>
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
          className="flex-1 flex items-center justify-center gap-2 bg-[#ED9420] hover:bg-[#d67f12] text-white font-semibold py-3 rounded-lg transition-colors"
        >
          View Summary
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
