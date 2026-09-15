'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CalculatorData } from '../App';
import { FloorPlanning } from './FloorPlanning';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AlertCircle } from 'lucide-react';

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
  const isExceeded = totalSqft > allowedSqft;

  const floorNames = ['Ground Floor', 'First Floor', 'Second Floor'];

  return (
    <Card className="w-full mx-auto shadow-none border-0 flex flex-col justify-center">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-3xl font-bold">Plan Your House Spaces</CardTitle>
        <CardDescription>Select the number of each room type for your house</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0 space-y-6">
        {isExceeded && (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Land Size Limit Exceeded!</AlertTitle>
            <AlertDescription>
              You cannot add more areas. Your land size limit has been exceeded by{' '}
              {Math.abs(remainingSqft).toLocaleString()} sqft.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
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
          <Button type="button" variant="outline" onClick={onPrev} className="px-6 py-6">
            <ArrowLeft size={20} />
            Previous
          </Button>
          <Button
            type="button"
            onClick={onNext}
            disabled={isExceeded || totalSqft === 0}
            className="flex-1 bg-[#ED9420] hover:bg-[#d67f12] py-6 text-base font-semibold disabled:bg-gray-300"
          >
            Next Step
            <ArrowRight size={20} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
