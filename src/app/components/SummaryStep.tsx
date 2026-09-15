import { ArrowLeft, Download, Mail } from 'lucide-react';
import { CalculatorData } from '../App';

type Props = {
  data: CalculatorData;
  onPrev: () => void;
};

export function SummaryStep({ data, onPrev }: Props) {
  const totalLandSqft = data.perches * 272.25;
  const usableLandSqft = totalLandSqft * 0.6;
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
  const constructionCost = totalSqft * 10982;

  const getRoofCost = () => {
    switch (data.roofType) {
      case 'concrete':
        return 3300000;
      case 'halfConcrete':
        return 2200000;
      case 'clayTiles':
        return totalSqft * 11090;
      default:
        return 0;
    }
  };

  const getRoofName = () => {
    switch (data.roofType) {
      case 'concrete':
        return 'Full Concrete Slab';
      case 'halfConcrete':
        return '50% Concrete Slab';
      case 'clayTiles':
        return 'Clay Tile Roof';
      default:
        return 'Full Timber Roof';
    }
  };

  const roofCost = getRoofCost();
  const totalCost = constructionCost + roofCost;

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-neutral-100 mb-2">Your House Estimation Summary</h2>
      <p className="text-gray-600 dark:text-neutral-400 mb-8">Review your complete house building cost estimate</p>

      <div className="space-y-6">
        <div className="bg-gradient-to-br from-[#ED9420] to-[#d67f12] text-white rounded-lg p-8 shadow-xl">
          <p className="text-lg opacity-90 mb-2">Total Estimated Budget</p>
          <p className="text-5xl font-bold">LKR {totalCost.toLocaleString()}</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-neutral-100 mb-4">User Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Full Name</p>
              <p className="font-semibold text-gray-900 dark:text-neutral-100">{data.user.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Phone Number</p>
              <p className="font-semibold text-gray-900 dark:text-neutral-100">{data.user.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Email Address</p>
              <p className="font-semibold text-gray-900 dark:text-neutral-100">{data.user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Building Location</p>
              <p className="font-semibold text-gray-900 dark:text-neutral-100">{data.user.location}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-neutral-100 mb-4">Land Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Land Size</p>
              <p className="font-semibold text-gray-900 dark:text-neutral-100">{data.perches} Perches</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Total Land Area</p>
              <p className="font-semibold text-gray-900 dark:text-neutral-100">{totalLandSqft.toLocaleString()} sqft</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Buildable Area (60%)</p>
              <p className="font-semibold text-gray-900 dark:text-neutral-100">{usableLandSqft.toLocaleString()} sqft</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-neutral-100 mb-4">House Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Number of Stories</p>
              <p className="font-semibold text-gray-900 dark:text-neutral-100">{data.stories} Story</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Total Construction Area</p>
              <p className="font-semibold text-gray-900 dark:text-neutral-100">{totalSqft.toLocaleString()} sqft</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Remaining Space</p>
              <p className="font-semibold text-gray-900 dark:text-neutral-100">{remainingSqft.toLocaleString()} sqft</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-neutral-100 mb-4">Cost Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-neutral-800">
              <span className="text-gray-700 dark:text-neutral-300">Construction Cost</span>
              <span className="font-semibold text-gray-900 dark:text-neutral-100">LKR {constructionCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-neutral-800">
              <span className="text-gray-700 dark:text-neutral-300">Roof Type: {getRoofName()}</span>
              <span className="font-semibold text-gray-900 dark:text-neutral-100">
                LKR {roofCost === 0 ? '0' : roofCost.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3">
              <span className="text-lg font-bold text-gray-900 dark:text-neutral-100">Total Estimated Cost</span>
              <span className="text-2xl font-bold text-[#ED9420]">LKR {totalCost.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onPrev}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-neutral-700 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft size={20} />
            Previous
          </button>
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            <Download size={20} />
            Download PDF
          </button>
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            <Mail size={20} />
            Email Quote
          </button>
        </div>
      </div>
    </div>
  );
}
