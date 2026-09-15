'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { ArrowLeft, ArrowRight, CheckCheckIcon } from 'lucide-react';
import { Alert, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Field, FieldError, FieldLabel } from './ui/field';
import { Input } from './ui/input';

const formSchema = z.object({
  perches: z
    .number({ error: 'Land size is required.' })
    .min(0.01, 'Enter a land size greater than 0.')
    .max(1000, 'Land size looks too large. Please verify.'),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  perches: number;
  onUpdate: (perches: number) => void;
  onNext: () => void;
  onPrev: () => void;
};

export function LandSizeStep({ perches, onUpdate, onNext, onPrev }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      perches: perches > 0 ? perches : undefined as unknown as number,
    },
  });

  const watchedPerches = form.watch('perches');
  const effectivePerches = Number(watchedPerches) || 0;
  const totalLandSqft = effectivePerches * 272.25;
  const usableLandSqft = totalLandSqft * 0.6;

  function onSubmit(values: FormValues) {
    onUpdate(values.perches);
    toast.custom(() => (
      <Alert className="border-green-600 text-green-600 dark:border-green-400 dark:text-green-400 *:[svg]:row-span-1">
        <CheckCheckIcon />
        <AlertTitle>
          Land size saved! Buildable area: {usableLandSqft.toLocaleString()} sqft.
        </AlertTitle>
      </Alert>
    ));
    onNext();
  }

  return (
    <Card className="w-full max-w-xl mx-auto shadow-none border-0 bg-transparent flex flex-col justify-center">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-3xl font-bold">Calculate Your Land Size</CardTitle>
        <CardDescription>Enter your land size to calculate buildable area</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
          <Controller
            name="perches"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="perches">Land Size in Perches</FieldLabel>
                <Input
                  id="perches"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter land size in perches"
                  aria-invalid={fieldState.invalid}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {effectivePerches > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Total Land Size</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{totalLandSqft.toLocaleString()} sqft</p>
              </div>
              <div className="bg-gradient-to-br from-[#ED9420]/10 to-[#ED9420]/20 p-6 rounded-lg border border-[#ED9420]/30">
                <p className="text-sm text-[#d67f12] font-medium mb-1">Buildable Area (60%)</p>
                <p className="text-3xl font-bold text-[#d67f12]">{usableLandSqft.toLocaleString()} sqft</p>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={onPrev} className="px-6 py-6">
              <ArrowLeft size={20} />
              Previous
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#ED9420] hover:bg-[#d67f12] py-6 text-base font-semibold"
            >
              Next Step
              <ArrowRight size={20} />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
