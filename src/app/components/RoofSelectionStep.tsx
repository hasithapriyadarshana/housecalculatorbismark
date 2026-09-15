'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { CalculatorData } from '../App';
import { totalSqftForFloors } from '../lib/roomConfig';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Field, FieldError, FieldLabel, FieldLegend, FieldSet } from './ui/field';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

const formSchema = z.object({
  roofType: z.enum(['timber', 'concrete', 'halfConcrete', 'clayTiles'], {
    error: 'Please select a roof type.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  roofType: string;
  data: CalculatorData;
  onUpdate: (roofType: string) => void;
  onNext: () => void;
  onPrev: () => void;
};

export function RoofSelectionStep({ roofType, data, onUpdate, onNext, onPrev }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roofType: (roofType as FormValues['roofType']) ?? 'timber',
    },
  });

  const calculateTotalSqft = () => {
    return totalSqftForFloors(data.floors);
  };

  const totalSqft = calculateTotalSqft();

  const roofOptions = [
    { id: 'timber', name: 'Full Timber Roof', cost: 0, description: 'Traditional timber roofing' },
    { id: 'concrete', name: 'Full Concrete Slab', cost: 3300000, description: 'Complete concrete coverage' },
    { id: 'halfConcrete', name: '50% Concrete Slab', cost: 2200000, description: 'Partial concrete coverage' },
    { id: 'clayTiles', name: 'Clay Tile Roof', cost: totalSqft * 11090, description: 'Premium clay tiles' },
  ];

  function onSubmit(values: FormValues) {
    onUpdate(values.roofType);
    onNext();
  }

  return (
    <Card className="w-full mx-auto shadow-none border-0 flex flex-col justify-center">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-3xl font-bold">Select Your Roof Type</CardTitle>
        <CardDescription>Choose the roofing option that suits your budget and preferences</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
          <Controller
            name="roofType"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldSet>
                <FieldLegend variant="label">Roof type</FieldLegend>
                <RadioGroup
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {roofOptions.map((option) => {
                    const selected = field.value === option.id;
                    return (
                      <Field
                        key={option.id}
                        orientation="horizontal"
                        data-invalid={fieldState.invalid}
                        className={`relative p-6 rounded-lg border-2 transition-all text-left cursor-pointer ${
                          selected
                            ? 'border-[#ED9420] bg-[#ED9420]/10 shadow-lg'
                            : 'border-gray-200 dark:border-neutral-800 hover:border-[#ED9420]/50'
                        }`}
                      >
                        <RadioGroupItem
                          value={option.id}
                          id={`roof-${option.id}`}
                          aria-invalid={fieldState.invalid}
                          className="sr-only"
                        />
                        {selected && (
                          <div className="absolute top-4 right-4 w-6 h-6 bg-[#ED9420] rounded-full flex items-center justify-center">
                            <Check size={16} className="text-white" />
                          </div>
                        )}
                        <FieldLabel htmlFor={`roof-${option.id}`} className="font-normal cursor-pointer w-full">
                          <span>
                            <span className="block font-bold text-lg text-gray-900 dark:text-neutral-100 mb-1">{option.name}</span>
                            <span className="block text-sm text-gray-600 dark:text-neutral-400 mb-3">{option.description}</span>
                            <span className="block text-2xl font-bold text-[#ED9420]">
                              {option.cost === 0 ? 'No Additional Cost' : `LKR ${option.cost.toLocaleString()}`}
                            </span>
                          </span>
                        </FieldLabel>
                      </Field>
                    );
                  })}
                </RadioGroup>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </FieldSet>
            )}
          />

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button type="button" variant="outline" onClick={onPrev} className="px-6 py-6 w-full sm:w-auto">
              <ArrowLeft size={20} />
              Previous
            </Button>
            <Button type="submit" className="flex-1 bg-[#ED9420] hover:bg-[#d67f12] py-6 text-base font-semibold">
              View Summary
              <ArrowRight size={20} />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
