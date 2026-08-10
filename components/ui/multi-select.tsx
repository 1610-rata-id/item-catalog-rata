"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  value: string[];

  placeholder: string;

  onApply: (values: string[]) => void;

  className?: string;
}

export default function MultiSelect({
  options,
  value,
  placeholder,
  onApply,
  className = "",
}: MultiSelectProps) {

  const [open, setOpen] =
    useState(false);

  const [draft, setDraft] =
    useState<string[]>(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const toggle = (
    value: string
  ) => {

    if (draft.includes(value)) {

      setDraft(
        draft.filter(
          (v) => v !== value
        )
      );

      return;
    }

    setDraft([
      ...draft,
      value,
    ]);

  };

  const label =
    useMemo(() => {

      if (value.length === 0)
        return placeholder;

      const selected =
        options.filter((o) =>
          value.includes(o.value)
        );

      if (selected.length <= 3) {

        return selected
          .map((o) => o.label)
          .join(", ");

      }

      return `${selected
        .slice(0,3)
        .map((o)=>o.label)
        .join(", ")} +${selected.length-3}`;

    }, [
      value,
      options,
      placeholder,
    ]);

  return (

    <Popover
      open={open}
      onOpenChange={setOpen}
    >

      <PopoverTrigger
        className={`
          ${className}
          flex
          h-11
          w-full
          items-center
          justify-between
          rounded-xl
          border
          border-input
          bg-background
          px-3
          text-sm
        `}
      >

        <span className="truncate">
          {label}
        </span>

        <ChevronDown className="h-4 w-4 opacity-60" />

      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[280px] p-0"
      >

        <div className="max-h-72 overflow-y-auto p-2">

  {options.map((option) => {

  const checked =
    draft.includes(option.value);

  return (

    <button
      key={option.value}
      type="button"
      onClick={() => toggle(option.value)}
      className="
        flex
        w-full
        items-center
        gap-3
        rounded-lg
        px-3
        py-2
        text-left
        text-sm
        transition-colors
        hover:bg-accent
      "
    >

      <div
        className={`
          flex
          h-5
          w-5
          items-center
          justify-center
          rounded
          border
          transition-colors
          ${
            checked
              ? "border-primary bg-primary text-primary-foreground"
              : "border-muted-foreground/40"
          }
        `}
      >

        {checked && (
          <Check className="h-3 w-3" />
        )}

      </div>

      <span>
        {option.label}
      </span>

    </button>

  );

})}

</div>

<div className="flex items-center justify-between border-t p-3">

  <Button
    type="button"
    variant="ghost"
    size="sm"
    onClick={() => setDraft([])}
  >
    Clear
  </Button>

  <Button
    type="button"
    size="sm"
    onClick={() => {
      onApply(draft);
      setOpen(false);
    }}
  >
    Apply
  </Button>

</div>

</PopoverContent>

</Popover>

);
}