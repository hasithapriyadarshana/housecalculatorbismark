'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, type FieldErrors } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { User, Phone, Mail, CheckCircle2Icon, InfoIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Field, FieldError, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { LocationAutocomplete } from './LocationAutocomplete';
import { ConstructionIllustration } from './ConstructionIllustration';
import { UserData } from '../App';

const formSchema = z.object({
  fullName: z.string().min(1, 'Full name is required.').min(2, 'Enter your full name.'),
  phone: z
    .string()
    .min(1, 'Phone number is required.')
    .refine((v) => /^[0-9+\-\s()]+$/.test(v), 'Enter a valid phone number.')
    .refine((v) => {
      const digits = v.replace(/[\s\-()]/g, '');
      return /^(\+94|94|0)\d{9}$/.test(digits);
    }, 'Enter a valid number with country code, e.g. +94771234567 or 0771234567.'),
  email: z.string().min(1, 'Email is required.').email({ message: 'Please enter a valid email address.' }),
  location: z.string().min(1, 'Building location is required.').min(2, 'Enter your building location.'),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  data: UserData;
  onUpdate: (data: UserData) => void;
  onNext: () => void;
};

export function RegistrationStep({ data, onUpdate, onNext }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: data.fullName ?? '',
      phone: data.phone ?? '',
      email: data.email ?? '',
      location: data.location ?? '',
    },
  });

  // Keep RHF in sync if parent data changes externally
  React.useEffect(() => {
    form.reset({
      fullName: data.fullName ?? '',
      phone: data.phone ?? '',
      email: data.email ?? '',
      location: data.location ?? '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmit(values: FormValues) {
    onUpdate(values);
    toast.custom(
      () => (
        <div className="grid w-full max-w-md items-start gap-4">
          <Alert>
            <CheckCircle2Icon />
            <AlertTitle>Details saved successfully!</AlertTitle>
            <AlertDescription>Let&apos;s calculate your land size.</AlertDescription>
          </Alert>
        </div>
      ),
      { position: 'bottom-right' }
    );
    onNext();
  }

  function onInvalid(errors: FieldErrors<FormValues>) {
    const messages = Object.values(errors)
      .map((e) => e?.message)
      .filter((m): m is string => Boolean(m));
    toast.custom(
      () => (
        <div className="grid w-full max-w-md items-start gap-4">
          <Alert>
            <InfoIcon />
            <AlertTitle>Please complete the missing details</AlertTitle>
            <AlertDescription>
              <ul className="list-disc space-y-0.5 pl-4">
                {messages.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      ),
      { position: 'bottom-right' }
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-none border-0 bg-transparent flex flex-col justify-center">
      <CardContent className="px-0 pb-0">
        <div className="grid w-full items-center gap-10 md:grid-cols-2">
          <div>
            <CardHeader className="px-0 pt-0">
        <CardTitle className="text-3xl font-bold">Let&apos;s Start Your House Estimation</CardTitle>
        <CardDescription>Please provide your contact details to begin</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="w-full space-y-6">
          <Controller
            name="fullName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className="pl-10"
                  />
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    {...field}
                    id={field.name}
                    type="tel"
                    aria-invalid={fieldState.invalid}
                    placeholder="+94 77 XXX XXXX"
                    autoComplete="tel"
                    className="pl-10"
                  />
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    {...field}
                    id={field.name}
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="example@gmail.com"
                    autoComplete="email"
                    className="pl-10"
                  />
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="location"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Building Location</FieldLabel>
                <LocationAutocomplete
                  id={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  invalid={fieldState.invalid}
                  placeholder="Search your building location in Sri Lanka"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Button type="submit" className="w-full bg-[#ED9420] hover:bg-[#d67f12] py-6 text-base font-semibold">
            Next Step
          </Button>
        </form>
        </CardContent>
          </div>
          <div className="mx-auto w-full max-w-sm md:max-w-none">
            <ConstructionIllustration />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
