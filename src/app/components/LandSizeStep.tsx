import { ArrowLeft, ArrowRight } from 'lucide-react';

type Props = {
  perches: number;
  onUpdate: (perches: number) => void;
  onNext: () => void;
  onPrev: () => void;
};

export function LandSizeStep({ perches, onUpdate, onNext, onPrev }: Props) {
  const totalLandSqft = perches * 272.25;
  const usableLandSqft = totalLandSqft * 0.6;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (perches > 0) {
      onNext();
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Calculate Your Land Size</h2>
      <p className="text-gray-600 mb-8">Enter your land size to calculate buildable area</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Land Size in Perches</label>
          <input
            type="number"
            value={perches || ''}
            onChange={(e) => onUpdate(Number(e.target.value))}
            placeholder="Enter land size in perches"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED9420] focus:border-[#ED9420] outline-none transition-all"
            min="0"
            step="0.01"
            required
          />
        </div>

        {perches > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600 font-medium mb-1">Total Land Size</p>
              <p className="text-3xl font-bold text-blue-900">{totalLandSqft.toLocaleString()} sqft</p>
            </div>

            <div className="bg-gradient-to-br from-[#ED9420]/10 to-[#ED9420]/20 p-6 rounded-lg border border-[#ED9420]/30">
              <p className="text-sm text-[#d67f12] font-medium mb-1">Buildable Area (60%)</p>
              <p className="text-3xl font-bold text-[#d67f12]">{usableLandSqft.toLocaleString()} sqft</p>
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-8">
          <button
            type="button"
            onClick={onPrev}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={20} />
            Previous
          </button>
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-[#ED9420] hover:bg-[#d67f12] text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Next Step
            <ArrowRight size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
