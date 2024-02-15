import * as React from "react";
import { Column } from "@tanstack/react-table";
import { CounterClockwiseClockIcon } from "@radix-ui/react-icons";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface DataTableRangeFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
  }[];
}

export function DataTableRangeFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableRangeFilterProps<TData, TValue>) {
  const selectedValue = column?.getFilterValue() as string;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          {/* // TODO: update to `ClockIcon` when add specific time stamp */}
          <CounterClockwiseClockIcon className="mr-2 h-4 w-4" />
          {selectedValue ? selectedValue : title}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      column?.setFilterValue(option.value);
                    }}
                  >
                    <span>{option.label}</span>
                    <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                      {option.value}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
          {selectedValue && (
            <>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    column?.setFilterValue(undefined);
                  }}
                  className="justify-center text-center"
                >
                  Clear filters
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
