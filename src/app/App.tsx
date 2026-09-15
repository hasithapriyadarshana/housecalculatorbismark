import { useState } from 'react';
import { RegistrationStep } from './components/RegistrationStep';
import { LandSizeStep } from './components/LandSizeStep';
import { StorySelectionStep } from './components/StorySelectionStep';
import { SpacePlanningStep } from './components/SpacePlanningStep';
import { RoofSelectionStep } from './components/RoofSelectionStep';
import { SummaryStep } from './components/SummaryStep';
import { ProgressBar } from './components/ProgressBar';
import { LiveSummary } from './components/LiveSummary';
import { SiteHeader } from './components/SiteHeader';
import { Toaster } from './components/ui/sonner';

export type UserData = {
  fullName: string;
  phone: string;
  email: string;
  location: string;
};

export type FloorData = {
  livingAreas: number;
  diningAreas: number;
  pantries: number;
  kitchens: number;
  parkings: number;
  rooms: number;
  bathrooms: number;
};

export type CalculatorData = {
  user: UserData;
  perches: number;
  stories: number;
  floors: FloorData[];
  roofType: string;
};

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<CalculatorData>({
    user: { fullName: '', phone: '', email: '', location: '' },
    perches: 0,
    stories: 1,
    floors: [{ livingAreas: 0, diningAreas: 0, pantries: 0, kitchens: 0, parkings: 0, rooms: 0, bathrooms: 0 }],
    roofType: 'timber',
  });

  const totalSteps = 6;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateData = (updates: Partial<CalculatorData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
      <Toaster position="top-center" richColors />
      <SiteHeader />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-neutral-100 mb-2">House Building Cost Calculator</h1>
          <p className="text-gray-600 dark:text-neutral-400">Plan your dream house with accurate cost estimates</p>
        </div>

        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 items-start">
          <div className={currentStep <= 2 ? 'lg:col-span-3' : 'lg:col-span-2'}>
            <div className={`${currentStep === 1 ? 'bg-[#171717]' : 'bg-white dark:bg-neutral-900'} rounded-lg shadow-lg p-8 flex justify-center`}>
              <div className={`w-full max-w-2xl mx-auto flex flex-col justify-center min-h-[420px] ${currentStep === 1 ? 'dark' : ''}`}>
              {currentStep === 1 && (
                <RegistrationStep
                  data={data.user}
                  onUpdate={(user) => updateData({ user })}
                  onNext={nextStep}
                />
              )}
              {currentStep === 2 && (
                <LandSizeStep
                  perches={data.perches}
                  onUpdate={(perches) => updateData({ perches })}
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              )}
              {currentStep === 3 && (
                <StorySelectionStep
                  stories={data.stories}
                  onUpdate={(stories) => {
                    const floors = Array.from({ length: stories }, (_, i) =>
                      data.floors[i] || { livingAreas: 0, diningAreas: 0, pantries: 0, kitchens: 0, parkings: 0, rooms: 0, bathrooms: 0 }
                    );
                    updateData({ stories, floors });
                  }}
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              )}
              {currentStep === 4 && (
                <SpacePlanningStep
                  data={data}
                  onUpdate={(floors) => updateData({ floors })}
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              )}
              {currentStep === 5 && (
                <RoofSelectionStep
                  roofType={data.roofType}
                  data={data}
                  onUpdate={(roofType) => updateData({ roofType })}
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              )}
              {currentStep === 6 && (
                <SummaryStep data={data} onPrev={prevStep} />
              )}
              </div>
            </div>
          </div>

          {currentStep > 2 && (
            <div className="lg:col-span-1">
              <LiveSummary data={data} currentStep={currentStep} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}