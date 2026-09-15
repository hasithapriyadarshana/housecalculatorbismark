'use client';

import * as React from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Loader2, MapPin } from 'lucide-react';
import { cn } from './ui/utils';
import { Input } from './ui/input';

const GOOGLE_KEY = (import.meta as unknown as { env: Record<string, string | undefined> }).env
  .VITE_GOOGLE_MAPS_API_KEY;

type Suggestion = {
  id: string;
  label: string;
  secondary?: string;
  source: 'google' | 'osm';
};

type Props = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  invalid?: boolean;
  placeholder?: string;
};

let googleLoadPromise: Promise<boolean> | null = null;

function ensureGoogle(): Promise<boolean> {
  if (!GOOGLE_KEY) return Promise.resolve(false);
  if (typeof window !== 'undefined' && window.google?.maps?.places) return Promise.resolve(true);
  if (!googleLoadPromise) {
    const loader = new Loader({ apiKey: GOOGLE_KEY, version: 'weekly', libraries: ['places'] });
    googleLoadPromise = loader
      .load()
      .then(() => true)
      .catch(() => {
        googleLoadPromise = null;
        return false;
      });
  }
  return googleLoadPromise;
}

function fetchGooglePredictions(query: string): Promise<Suggestion[]> {
  return new Promise((resolve) => {
    try {
      const service = new window.google.maps.places.AutocompleteService();
      service.getPlacePredictions(
        { input: query, componentRestrictions: { country: 'lk' } },
        (predictions, status) => {
          if (
            status !== window.google.maps.places.PlacesServiceStatus.OK ||
            !predictions
          ) {
            resolve([]);
            return;
          }
          resolve(
            predictions.map((p) => ({
              id: p.place_id,
              label: p.structured_formatting.main_text,
              secondary: p.structured_formatting.secondary_text,
              source: 'google' as const,
            }))
          );
        }
      );
    } catch {
      resolve([]);
    }
  });
}

type OsmResult = {
  place_id: number;
  display_name: string;
};

async function fetchOsmSuggestions(query: string, signal: AbortSignal): Promise<Suggestion[]> {
  const url =
    `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=6&countrycodes=lk&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    signal,
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) return [];
  const data = (await res.json()) as OsmResult[];
  return data.map((r) => {
    const parts = r.display_name.split(',').map((s) => s.trim());
    return {
      id: String(r.place_id),
      label: parts.slice(0, 2).join(', '),
      secondary: parts.slice(2, 4).join(', '),
      source: 'osm' as const,
    };
  });
}

export function LocationAutocomplete({
  id,
  value,
  onChange,
  onBlur,
  invalid,
  placeholder = 'Search your building location',
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([]);
  const [highlight, setHighlight] = React.useState(-1);
  const [googleActive, setGoogleActive] = React.useState(false);
  const requestId = React.useRef(0);
  const abortRef = React.useRef<AbortController | null>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Debounced search
  React.useEffect(() => {
    const query = value.trim();
    if (query.length < 2) {
      setSuggestions([]);
      setOpen(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    const current = ++requestId.current;
    const timer = window.setTimeout(async () => {
      try {
        const googleReady = await ensureGoogle();
        if (current !== requestId.current) return;
        if (googleReady) {
          const results = await fetchGooglePredictions(query);
          if (current !== requestId.current) return;
          setGoogleActive(true);
          setSuggestions(results);
        } else {
          abortRef.current?.abort();
          const controller = new AbortController();
          abortRef.current = controller;
          const results = await fetchOsmSuggestions(query, controller.signal);
          if (current !== requestId.current) return;
          setGoogleActive(false);
          setSuggestions(results);
        }
        setHighlight(-1);
        setOpen(true);
      } catch {
        if (current === requestId.current) {
          setSuggestions([]);
          setOpen(false);
        }
      } finally {
        if (current === requestId.current) setLoading(false);
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [value]);

  const select = (s: Suggestion) => {
    onChange(s.secondary ? `${s.label}, ${s.secondary}` : s.label);
    setOpen(false);
    setSuggestions([]);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' && suggestions.length > 0) {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => (h + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp' && suggestions.length > 0) {
      e.preventDefault();
      setHighlight((h) => (h - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter' && open && highlight >= 0 && suggestions[highlight]) {
      e.preventDefault();
      select(suggestions[highlight]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <div className="relative">
        <MapPin
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={18}
        />
        <Input
          id={id}
          value={value}
          aria-invalid={invalid}
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls={open ? `${id}-location-listbox` : undefined}
          className="pl-10 pr-10"
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          onFocus={() => {
            if (suggestions.length > 0) setOpen(true);
          }}
          onKeyDown={onKeyDown}
        />
        {loading && (
          <Loader2
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground"
          />
        )}
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-lg">
          <ul id={`${id}-location-listbox`} role="listbox" className="max-h-60 overflow-y-auto p-1">
            {suggestions.map((s, i) => (
              <li key={`${s.source}-${s.id}`} role="option" aria-selected={i === highlight}>
                <button
                  type="button"
                  tabIndex={-1}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    select(s);
                  }}
                  onMouseEnter={() => setHighlight(i)}
                  className={cn(
                    'flex w-full items-start gap-2 rounded-md px-3 py-2 text-left transition-colors',
                    i === highlight
                      ? 'bg-gray-100 dark:bg-neutral-800'
                      : 'hover:bg-gray-100 dark:hover:bg-neutral-800'
                  )}
                >
                  <MapPin size={16} className="mt-0.5 shrink-0 text-[#ED9420]" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-gray-900 dark:text-neutral-100">
                      {s.label}
                    </span>
                    {s.secondary && (
                      <span className="block truncate text-xs text-gray-500 dark:text-neutral-400">
                        {s.secondary}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-200 dark:border-neutral-800 px-3 py-1.5 text-right">
            <span className="text-[11px] text-gray-500 dark:text-neutral-500">
              {googleActive ? 'Powered by Google' : 'Search by OpenStreetMap contributors'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
