import { CalculatorData } from '../App';

type Props = {
  data: CalculatorData;
  currentStep: number;
};

export function LiveSummary({ data, currentStep }: Props) {
  if (currentStep <= 2) return null;

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
  const usagePercentage = (totalSqft / allowedSqft) * 100;
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

  const roofCost = getRoofCost();
  const totalCost = constructionCost + roofCost;

  return (
    <div className="sticky top-8">
      <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-neutral-100 mb-4">Live Summary</h3>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-neutral-400 mb-1">Allowed Construction Area</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-neutral-100">{allowedSqft.toLocaleString()} sqft</p>
          </div>

          {currentStep >= 4 && (
            <>
              <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
                <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Used Area</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalSqft.toLocaleString()} sqft</p>
              </div>

              <div className={`rounded-lg p-4 ${remainingSqft >= 0 ? 'bg-green-50 dark:bg-green-950' : 'bg-red-50 dark:bg-red-950'}`}>
                <p className={`text-sm mb-1 ${remainingSqft >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  Remaining Space
                </p>
                <p className={`text-2xl font-bold ${remainingSqft >= 0 ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'}`}>
                  {remainingSqft.toLocaleString()} sqft
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-950 rounded-lg p-4">
                <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Usage Percentage</p>
                <div className="flex items-end gap-2">
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{usagePercentage.toFixed(1)}%</p>
                </div>
                <div className="w-full bg-purple-200 dark:bg-purple-900 rounded-full h-2 mt-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, usagePercentage)}%` }}
                  />
                </div>
              </div>
            </>
          )}

          {currentStep >= 5 && roofCost > 0 && (
            <div className="bg-amber-50 dark:bg-amber-950 rounded-lg p-4">
              <p className="text-sm text-amber-600 dark:text-amber-400 mb-1">Roof Cost</p>
              <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">LKR {roofCost.toLocaleString()}</p>
            </div>
          )}

          {currentStep >= 4 && totalSqft > 0 && (
            <div className="bg-gradient-to-br from-[#ED9420] to-[#d67f12] rounded-lg p-4 text-white">
              <p className="text-sm opacity-90 mb-1">Total Estimated Cost</p>
              <p className="text-3xl font-bold">LKR {totalCost.toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
