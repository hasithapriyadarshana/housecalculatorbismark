"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "./utils";

const ProgressContext = React.createContext<{ value: number }>({ value: 0 });

function Progress({
  className,
  value = 0,
  indicatorClassName,
  children,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  indicatorClassName?: string;
}) {
  return (
    <ProgressContext.Provider value={{ value: value ?? 0 }}>
      <div data-slot="progress" className={cn("flex w-full flex-col gap-2", className)}>
        {children ? (
          <div className="flex items-center justify-between gap-4">{children}</div>
        ) : null}
        <ProgressPrimitive.Root
          data-slot="progress-track"
          value={value}
          max={100}
          className="bg-muted relative h-2 w-full overflow-hidden rounded-full"
          {...props}
        >
          <ProgressPrimitive.Indicator
            data-slot="progress-indicator"
            className={cn("bg-primary h-full w-full flex-1 transition-all", indicatorClassName)}
            style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
          />
        </ProgressPrimitive.Root>
      </div>
    </ProgressContext.Provider>
  );
}

function ProgressLabel({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="progress-label"
      className={cn("text-sm font-medium", className)}
      {...props}
    />
  );
}

function ProgressValue({ className, children, ...props }: React.ComponentProps<"span">) {
  const { value } = React.useContext(ProgressContext);
  return (
    <span
      data-slot="progress-value"
      className={cn("text-sm font-medium tabular-nums", className)}
      {...props}
    >
      {children ?? `${Math.round(value)}%`}
    </span>
  );
}

export { Progress, ProgressLabel, ProgressValue };
