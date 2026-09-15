'use client';

import * as React from 'react';
import { ArrowLeft, Eye, EyeOff, Lock, User } from 'lucide-react';
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
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [show, setShow] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tryAdminLogin(username.trim(), password)) {
      setError(null);
      onSuccess();
    } else {
      setError('Incorrect username or password. Please try again.');
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
          <CardDescription>Enter your username and password to view calculations</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <Field>
              <FieldLabel htmlFor="admin-username">Username</FieldLabel>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="admin-username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError(null);
                  }}
                  placeholder="Enter username"
                  autoComplete="username"
                  className="pl-10"
                />
              </div>
            </Field>
            <Field data-invalid={Boolean(error)}>
              <FieldLabel htmlFor="admin-password">Password</FieldLabel>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  aria-invalid={Boolean(error)}
                  className="pr-10"
                />
                <button
                  type="button"
                  aria-label={show ? 'Hide password' : 'Show password'}
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
