import { Progress, ProgressLabel, ProgressValue } from './ui/progress';

export function ProgressBar({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <Progress value={progress} indicatorClassName="bg-[#ED9420]" className="w-full">
      <ProgressLabel className="text-gray-700 dark:text-neutral-300">
        Step {currentStep} of {totalSteps}
      </ProgressLabel>
      <ProgressValue className="text-[#ED9420]">{Math.round(progress)}% Complete</ProgressValue>
    </Progress>
  );
}
