"use client";

import { Table } from "@tanstack/react-table";
import { Cross2Icon } from "@radix-ui/react-icons";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Severities, Timestamps } from "@/components/logs/data";
import { DataTableRangeFilter } from "@/components/logs/data-table-range-filter";
import { DataTableViewOptions } from "@/components/logs/data-table-view-options";
import { DataTableFacetedFilter } from "@/components/logs/data-table-faceted-filter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {table.getColumn("title") && (
          <DataTableFacetedFilter
            column={table.getColumn("title")}
            title="Severity"
            options={Severities}
          />
        )}
        {table.getColumn("timestamp") && (
          <DataTableRangeFilter
            column={table.getColumn("timestamp")}
            title="Timestamp"
            options={Timestamps}
          />
        )}
        <Input
          placeholder="Filter Messages..."
          value={(table.getColumn("message")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("message")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
