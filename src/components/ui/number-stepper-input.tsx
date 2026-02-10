import * as React from "react";
import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

interface NumberStepperInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange"
> {
  value: number;
  onValueChange: (next: number) => void;
  min?: number;
  decrementAriaLabel?: string;
  incrementAriaLabel?: string;
}

export function NumberStepperInput({
  className,
  value,
  onValueChange,
  min = 0,
  decrementAriaLabel = "Decrease value",
  incrementAriaLabel = "Increase value",
  ...props
}: NumberStepperInputProps) {
  const setFromInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = Number(event.target.value);
    if (Number.isNaN(parsed)) return;
    onValueChange(Math.max(min, Math.trunc(parsed)));
  };

  const nudge = (delta: number) => {
    onValueChange(Math.max(min, value + delta));
  };

  return (
    <div
      className={cn("flex items-center rounded-chip border border-input w-fit bg-muted", className)}
    >
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center text-foreground"
        onClick={() => nudge(-1)}
        aria-label={decrementAriaLabel}
      >
        <Minus className="h-4 w-4" />
      </button>

      <input
        type="number"
        className={cn(
          "h-10 w-10 border-0 text-center font-medium focus:outline-none truncate",
          inputTypeAppearance
        )}
        value={value}
        onChange={setFromInput}
        min={min}
        {...props}
      />

      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center text-foreground"
        onClick={() => nudge(1)}
        aria-label={incrementAriaLabel}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

const inputTypeAppearance =
  "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield]";
