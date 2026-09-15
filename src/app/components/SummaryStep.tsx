import * as React from 'react';
import { ArrowLeft, Download, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { CalculatorData } from '../App';
import { fireSummaryConfetti } from './ConfettiButton';
import { CountUp } from './CountUp';
import { totalSqftForFloors } from '../lib/roomConfig';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';

type Props = {
  data: CalculatorData;
  quoteId: string;
  onPrev: () => void;
};

export function SummaryStep({ data, quoteId, onPrev }: Props) {
  // Celebrate when the estimation summary loads
  React.useEffect(() => {
    const t = window.setTimeout(() => fireSummaryConfetti(), 350);
    return () => window.clearTimeout(t);
  }, []);

  const handleDownloadPdf = () => {
    toast.promise(
      import('../lib/quotePdf').then(({ downloadQuotePdf }) =>
        downloadQuotePdf(data, quoteId)
      ),
      {
        loading: 'Generating your quote PDF...',
        success: 'Quote PDF downloaded.',
        error: 'Could not generate the PDF. Please try again.',
      }
    );
  };
  const totalLandSqft = data.perches * 272.25;
  const usableLandSqft = totalLandSqft * 0.6;
  const allowedSqft = usableLandSqft * data.stories;

  const calculateTotalSqft = () => {
    return totalSqftForFloors(data.floors);
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

  const sections: { id: string; title: string; body: React.ReactNode }[] = [
    {
      id: 'user',
      title: 'User Information',
      body: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="min-w-0">
            <p className="text-sm text-gray-600 dark:text-neutral-400">Full Name</p>
            <p className="font-semibold text-gray-900 dark:text-neutral-100 break-words">{data.user.fullName}</p>
          </div>
          <div className="min-w-0">
            <p className="text-sm text-gray-600 dark:text-neutral-400">Phone Number</p>
            <p className="font-semibold text-gray-900 dark:text-neutral-100 break-words">{data.user.phone}</p>
          </div>
          <div className="min-w-0">
            <p className="text-sm text-gray-600 dark:text-neutral-400">Email Address</p>
            <p className="font-semibold text-gray-900 dark:text-neutral-100 break-words">{data.user.email}</p>
          </div>
          <div className="min-w-0">
            <p className="text-sm text-gray-600 dark:text-neutral-400">Building Location</p>
            <p className="font-semibold text-gray-900 dark:text-neutral-100 break-words">{data.user.location}</p>
          </div>
        </div>
      ),
    },
    {
      id: 'land',
      title: 'Land Details',
      body: (
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
      ),
    },
    {
      id: 'house',
      title: 'House Details',
      body: (
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
      ),
    },
    {
      id: 'cost',
      title: 'Cost Breakdown',
      body: (
        <div className="space-y-3">
          <div className="flex justify-between items-center gap-3 pb-3 border-b border-gray-200 dark:border-neutral-800">
            <span className="text-gray-700 dark:text-neutral-300 min-w-0">Construction Cost</span>
            <span className="font-semibold text-gray-900 dark:text-neutral-100 text-right break-words">LKR {constructionCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center gap-3 pb-3 border-b border-gray-200 dark:border-neutral-800">
            <span className="text-gray-700 dark:text-neutral-300 min-w-0">Roof Type: {getRoofName()}</span>
            <span className="font-semibold text-gray-900 dark:text-neutral-100 text-right break-words shrink-0">
              LKR {roofCost === 0 ? '0' : roofCost.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-3 pt-3">
            <span className="text-lg font-bold text-gray-900 dark:text-neutral-100">Total Estimated Cost</span>
            <span className="text-xl sm:text-2xl font-bold text-[#ED9420] break-words"><CountUp value={totalCost} prefix="LKR " /></span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-w-0 w-full overflow-x-clip">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-neutral-100 mb-2">Your House Estimation Summary</h2>
        <p className="text-gray-600 dark:text-neutral-400 mb-8">Review your complete house building cost estimate</p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="bg-gradient-to-br from-[#ED9420] to-[#d67f12] text-white rounded-lg p-8 shadow-xl">
          <p className="text-lg opacity-90 mb-2">Total Estimated Budget</p>
          <p className="text-3xl sm:text-5xl font-bold break-words"><CountUp value={totalCost} prefix="LKR " /></p>
        </div>

        {/* Desktop: expanded cards */}
        <div className="hidden md:flex md:flex-col md:gap-6">
          {sections.map((s) => (
            <div
              key={s.id}
              className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-neutral-100 mb-4">{s.title}</h3>
              {s.body}
            </div>
          ))}
        </div>

        {/* Mobile: tap-to-expand accordions */}
        <div className="md:hidden bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg px-4">
          <Accordion type="single" collapsible defaultValue="cost" className="w-full">
            {sections.map((s) => (
              <AccordionItem key={s.id} value={s.id}>
                <AccordionTrigger className="text-base font-bold text-gray-900 dark:text-neutral-100 hover:no-underline">
                  {s.title}
                </AccordionTrigger>
                <AccordionContent>{s.body}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onPrev}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 dark:border-neutral-700 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft size={20} />
            Previous
          </button>
          <button
            type="button"
            onClick={handleDownloadPdf}
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
