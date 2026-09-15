'use client';

import * as React from 'react';
import { ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Field, FieldError, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { tryAdminLogin } from '../lib/adminAuth';

type Props = {
  onBack: () => void;
  onSuccess: () => void;
};

export function AdminLogin({ onBack, onSuccess }: Props) {
  const [passcode, setPasscode] = React.useState('');
  const [show, setShow] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tryAdminLogin(passcode.trim())) {
      setError(null);
      onSuccess();
    } else {
      setError('Incorrect passcode. Please try again.');
    }
  };

  return (
    <div className="mx-auto w-full max-w-sm">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#ED9420]/10">
            <Lock size={22} className="text-[#ED9420]" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>Enter the admin passcode to view calculations</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <Field data-invalid={Boolean(error)}>
              <FieldLabel htmlFor="admin-passcode">Passcode</FieldLabel>
              <div className="relative">
                <Input
                  id="admin-passcode"
                  type={show ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setError(null);
                  }}
                  placeholder="Enter passcode"
                  autoComplete="current-password"
                  aria-invalid={Boolean(error)}
                  className="pr-10"
                />
                <button
                  type="button"
                  aria-label={show ? 'Hide passcode' : 'Show passcode'}
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {error && <FieldError>{error}</FieldError>}
            </Field>
            <Button
              type="submit"
              className="w-full bg-[#ED9420] hover:bg-[#d67f12] font-semibold"
            >
              Unlock Dashboard
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={onBack}>
              <ArrowLeft size={18} />
              Back to Calculator
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
