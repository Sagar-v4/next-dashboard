"use client";

import {
  ActivitySquare,
  AlertTriangle,
  Ban,
  Bug,
  DotSquare,
  Flame,
  HelpCircle,
  Info,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { LogLevels } from "@/constants/logs";
import { DataTableRowActions } from "./data-table-row-actions";
import { DataTableColumnHeader } from "./data-table-column-header";
import { getLogDateFormat, isInLastTime } from "@/utils/date-time";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Log = {
  title: string;
  timestamp: Date;
  file: string;
  method: string;
  line: string;
};

export const columns: ColumnDef<Log>[] = [
  {
    accessorKey: "title",
    enableSorting: false,
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Severity" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => {
      let severityIcon: any;
      const severity = row.getValue("title");
      const commonCSS = "h-5 w-5 rounded-full p-0.5";

      switch (severity) {
        case LogLevels.LOG:
          severityIcon = <DotSquare className={`${commonCSS} text-zinc-500`} />;
          break;
        case LogLevels.TRACE:
          severityIcon = (
            <ActivitySquare className={`${commonCSS} text-purple-500`} />
          );
          break;
        case LogLevels.DEBUG:
          severityIcon = <Bug className={`${commonCSS} text-blue-500`} />;
          break;
        case LogLevels.INFO:
          severityIcon = <Info className={`${commonCSS}  text-green-500`} />;
          break;
        case LogLevels.WARN:
          severityIcon = (
            <AlertTriangle className={`${commonCSS} text-yellow-500`} />
          );
          break;
        case LogLevels.ERROR:
          severityIcon = <Ban className={`${commonCSS} text-red-400`} />;
          break;
        case LogLevels.FATAL:
          severityIcon = (
            <Flame strokeWidth={3} className={`${commonCSS} text-red-600`} />
          );
          break;
        default:
          severityIcon = <HelpCircle className={`${commonCSS} text-red-500`} />;
          return;
      }

      return severityIcon;
    },
  },
  {
    accessorKey: "timestamp",
    enableSorting: false,
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Time" />
    ),
    filterFn: (row, id, value) => {
      const timestamp = new Date(row.getValue(id) as string).getTime();
      return isInLastTime(timestamp, value);
    },
    cell: ({ row }) => {
      // TODO: commenting as of now, use with mongodb logs
      // const timeStamp = getLogDateFormat(new Date(row.getValue("timestamp")));
      // return <div className="">{timeStamp}</div>;
      return <div className="">{row.getValue("timestamp")}</div>;
    },
  },
  {
    accessorKey: "file",
    enableSorting: false,
    enableHiding: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="File" />
    ),
  },
  {
    accessorKey: "method",
    enableSorting: false,
    enableHiding: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Method" />
    ),
  },
  {
    accessorKey: "line",
    enableSorting: false,
    enableHiding: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Line" />
    ),
  },
  {
    accessorKey: "message",
    enableSorting: false,
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Message" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
