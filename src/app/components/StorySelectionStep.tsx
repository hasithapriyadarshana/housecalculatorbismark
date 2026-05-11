import { ArrowLeft, ArrowRight, Building } from 'lucide-react';

type Props = {
  stories: number;
  onUpdate: (stories: number) => void;
  onNext: () => void;
  onPrev: () => void;
};

export function StorySelectionStep({ stories, onUpdate, onNext, onPrev }: Props) {
  const storyOptions = [1, 2, 3];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Select House Stories</h2>
      <p className="text-gray-600 mb-8">How many stories does your house have? (Maximum 3)</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {storyOptions.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onUpdate(option)}
            className={`p-6 rounded-lg border-2 transition-all ${
              stories === option
                ? 'border-[#ED9420] bg-[#ED9420]/10 shadow-lg'
                : 'border-gray-300 hover:border-[#ED9420]/50 bg-white'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <Building size={48} className={stories === option ? 'text-[#ED9420]' : 'text-gray-400'} />
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{option} Story</p>
                <p className="text-sm text-gray-600 mt-1">
                  {option === 1 ? 'Single floor' : option === 2 ? 'Ground + First' : 'Ground + First + Second'}
                </p>
              </div>
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
          Next Step
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
