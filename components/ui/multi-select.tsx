"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Check,
  ChevronDown,
} from "lucide-react";

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

  searchPlaceholder?: string;
  emptyMessage?: string;

  searchValue?: string;
  onSearchChange?: (value: string) => void;

  serverSearch?: boolean;
}

export default function MultiSelect({
  options,
  value,
  placeholder,
  onApply,

  className = "",

  searchPlaceholder = "Search...",
  emptyMessage = "No data found.",

  searchValue,
  onSearchChange,

  serverSearch = false,
}: MultiSelectProps) {

  const [open, setOpen] =
    useState(false);

  const [draft, setDraft] =
    useState<string[]>(value);

  const [internalSearch, setInternalSearch] =
    useState("");


  // ============================================================
  // SYNC DRAFT WITH EXTERNAL VALUE
  // ============================================================

  useEffect(() => {
    setDraft(value);
  }, [value]);


  // ============================================================
  // RESET INTERNAL SEARCH WHEN CLOSED
  // ============================================================

  useEffect(() => {
    if (!open) {
      setInternalSearch("");
    }
  }, [open]);


  // ============================================================
  // SEARCH VALUE
  // ============================================================

  const currentSearch =
    serverSearch
      ? searchValue ?? ""
      : internalSearch;


  // ============================================================
  // CLIENT-SIDE FILTER
  // ============================================================

  const filteredOptions =
    useMemo(() => {

      if (serverSearch) {
        return options;
      }

      const query =
        internalSearch
          .trim()
          .toLowerCase();

      if (!query) {
        return options;
      }

      return options.filter(
        (option) =>
          option.label
            .toLowerCase()
            .includes(query)
      );

    }, [
      options,
      internalSearch,
      serverSearch,
    ]);


  // ============================================================
  // TOGGLE
  // ============================================================

  const toggle = (
    optionValue: string
  ) => {

    if (draft.includes(optionValue)) {

      setDraft(
        draft.filter(
          (value) =>
            value !== optionValue
        )
      );

      return;
    }

    setDraft([
      ...draft,
      optionValue,
    ]);
  };


  // ============================================================
  // SELECT ALL CURRENT RESULTS
  // ============================================================

  const handleSelectAll = () => {

    const filteredValues =
      filteredOptions.map(
        (option) =>
          option.value
      );

    setDraft((current) => {

      const merged = [
        ...current,
        ...filteredValues,
      ];

      return Array.from(
        new Set(merged)
      );
    });
  };


  // ============================================================
  // UNSELECT ALL CURRENT RESULTS
  // ============================================================

  const handleUnselectAll = () => {

    const filteredValues =
      new Set(
        filteredOptions.map(
          (option) =>
            option.value
        )
      );

    setDraft((current) =>
      current.filter(
        (value) =>
          !filteredValues.has(value)
      )
    );
  };


  // ============================================================
  // LABEL
  // ============================================================

  const label =
    useMemo(() => {

      if (value.length === 0) {
        return placeholder;
      }

      if (
        options.length > 0 &&
        value.length === options.length
      ) {
        return `All (${value.length})`;
      }

      const selected =
        options.filter(
          (option) =>
            value.includes(
              option.value
            )
        );

      if (selected.length === 0) {
        return `${value.length} selected`;
      }

      if (selected.length <= 2) {
        return selected
          .map(
            (option) =>
              option.label
          )
          .join(", ");
      }

      return `${selected
        .slice(0, 2)
        .map(
          (option) =>
            option.label
        )
        .join(", ")} +${value.length - 2}`;

    }, [
      value,
      options,
      placeholder,
    ]);


  // ============================================================
  // RENDER
  // ============================================================

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

        <ChevronDown
          className="h-4 w-4 opacity-60"
        />

      </PopoverTrigger>


      <PopoverContent
        align="start"
        className="w-[360px] p-0"
      >

        {/* ====================================================
            SEARCH
        ==================================================== */}

        <div className="border-b p-3">

          <input
            type="text"
            value={currentSearch}
            onChange={(event) => {

              const nextValue =
                event.target.value;

              if (
                serverSearch &&
                onSearchChange
              ) {
                onSearchChange(
                  nextValue
                );
              } else {
                setInternalSearch(
                  nextValue
                );
              }

            }}
            placeholder={
              searchPlaceholder
            }
            className="
              h-10
              w-full
              rounded-lg
              border
              border-input
              bg-background
              px-3
              text-sm
              outline-none
              focus:ring-2
              focus:ring-ring
            "
          />

        </div>


        {/* ====================================================
            SELECT ALL / UNSELECT ALL
        ==================================================== */}

        <div className="flex items-center justify-between border-b px-3 py-2">

          <button
            type="button"
            onClick={handleSelectAll}
            disabled={
              filteredOptions.length === 0
            }
            className="
              text-xs
              font-medium
              text-primary
              hover:underline
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            Select All
          </button>


          <button
            type="button"
            onClick={handleUnselectAll}
            disabled={
              filteredOptions.length === 0
            }
            className="
              text-xs
              font-medium
              text-muted-foreground
              hover:underline
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            Unselect All
          </button>

        </div>


        {/* ====================================================
            OPTIONS
        ==================================================== */}

        <div className="max-h-72 overflow-y-auto p-2">

          {filteredOptions.length === 0 ? (

            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </div>

          ) : (

            filteredOptions.map(
              (option) => {

                const checked =
                  draft.includes(
                    option.value
                  );

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      toggle(
                        option.value
                      )
                    }
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
                        shrink-0
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

                    <span className="truncate">
                      {option.label}
                    </span>

                  </button>
                );
              }
            )

          )}

        </div>


        {/* ====================================================
            FOOTER
        ==================================================== */}

        <div className="flex items-center justify-between border-t p-3">

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              setDraft([])
            }
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