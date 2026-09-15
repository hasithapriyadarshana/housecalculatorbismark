'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import { ArrowLeft, ArrowRight, Building } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Field, FieldError, FieldLabel, FieldLegend, FieldSet } from './ui/field';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

const formSchema = z.object({
  stories: z.enum(['1', '2', '3'], {
    error: 'Please select how many stories your house has.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  stories: number;
  onUpdate: (stories: number) => void;
  onNext: () => void;
  onPrev: () => void;
};

export function StorySelectionStep({ stories, onUpdate, onNext, onPrev }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stories: String(stories) as FormValues['stories'],
    },
  });

  function onSubmit(values: FormValues) {
    onUpdate(Number(values.stories));
    onNext();
  }

  const storyOptions = [
    { value: '1', title: '1 Story', desc: 'Single floor' },
    { value: '2', title: '2 Story', desc: 'Ground + First' },
    { value: '3', title: '3 Story', desc: 'Ground + First + Second' },
  ];

  return (
    <Card className="w-full max-w-xl mx-auto shadow-none border-0 flex flex-col justify-center">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-3xl font-bold">Select House Stories</CardTitle>
        <CardDescription>How many stories does your house have? (Maximum 3)</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
          <Controller
            name="stories"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldSet>
                <FieldLegend variant="label">Number of stories</FieldLegend>
                <RadioGroup
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  {storyOptions.map((option) => {
                    const selected = field.value === option.value;
                    return (
                      <Field
                        key={option.value}
                        orientation="horizontal"
                        data-invalid={fieldState.invalid}
                        className={`p-6 rounded-lg border-2 transition-all cursor-pointer ${
                          selected
                            ? 'border-[#ED9420] bg-[#ED9420]/10 shadow-lg'
                            : 'border-gray-200 dark:border-neutral-800 hover:border-[#ED9420]/50'
                        }`}
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={`story-${option.value}`}
                          aria-invalid={fieldState.invalid}
                        />
                        <FieldLabel htmlFor={`story-${option.value}`} className="font-normal cursor-pointer">
                          <span className="flex flex-col items-center gap-3 text-center w-full">
                            <Building size={40} className={selected ? 'text-[#ED9420]' : 'text-gray-400 dark:text-neutral-500'} />
                            <span>
                              <span className="block text-xl font-bold text-gray-900 dark:text-neutral-100">{option.title}</span>
                              <span className="block text-sm text-gray-600 dark:text-neutral-400 mt-1">{option.desc}</span>
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
              Next Step
              <ArrowRight size={20} />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
