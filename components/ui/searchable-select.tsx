"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  value: string;
  options: Option[];
  onChange: (value: string) => void;

  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
}

export default function SearchableSelect({
  value,
  options,
  onChange,

  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyMessage = "No data found.",

  className = "",
}: SearchableSelectProps) {
  const [open, setOpen] =
    React.useState(false);

  const selected =
    options.find(
      (option) => option.value === value
    );

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
    items-center
    justify-between
    rounded-xl
    border
    border-input
    bg-background
    px-3
    text-sm
    transition-colors
    hover:bg-accent
  `}
>
        <span className="truncate">
          {selected
            ? selected.label
            : placeholder}
        </span>

        <ChevronsUpDown className="h-4 w-4 opacity-50" />
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[340px] p-0"
      >
        <Command>

          <CommandInput
            placeholder={searchPlaceholder}
          />

          <CommandList>

            <CommandEmpty>
              {emptyMessage}
            </CommandEmpty>

            <CommandGroup>

              {options.map((option) => (

                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      value === option.value
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  />

                  {option.label}

                </CommandItem>

              ))}

            </CommandGroup>

          </CommandList>

        </Command>
      </PopoverContent>
    </Popover>
  );
}