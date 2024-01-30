import {
  Ban,
  Bug,
  Info,
  Flame,
  DotSquare,
  AlertTriangle,
  ActivitySquare,
} from "lucide-react";

import { LogLevels } from "@/constants/logs";
import { getLogFromLocal } from "@/logger/local";
import { getLogFromDatabase } from "@/logger/database";

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
];

export type Log = {
  title: string;
  timestamp: Date;
  file: string;
  method: string;
  line: string;
};

export const sources = ["database", "local"];

export const Severities = [
  {
    value: LogLevels.LOG,
    label: "Log",
    icon: DotSquare,
  },
  {
    value: LogLevels.TRACE,
    label: "Trace",
    icon: ActivitySquare,
  },
  {
    value: LogLevels.DEBUG,
    label: "Debug",
    icon: Bug,
  },
  {
    value: LogLevels.INFO,
    label: "Info",
    icon: Info,
  },
  {
    value: LogLevels.WARN,
    label: "Warn",
    icon: AlertTriangle,
  },
  {
    value: LogLevels.ERROR,
    label: "Error",
    icon: Ban,
  },
  {
    value: LogLevels.FATAL,
    label: "Fatal",
    icon: Flame,
  },
];

export const Timestamps = [
  {
    value: "15s",
    label: "Last 15 seconds",
  },
  {
    value: "30s",
    label: "Last 30 seconds",
  },
  {
    value: "1m",
    label: "Last 1 minute",
  },
  {
    value: "5m",
    label: "Last 5 minutes",
  },
  {
    value: "10m",
    label: "Last 10 minutes",
  },
  {
    value: "15m",
    label: "Last 15 minutes",
  },
  {
    value: "30m",
    label: "Last 30 minutes",
  },
  {
    value: "45m",
    label: "Last 45 minutes",
  },
  {
    value: "1h",
    label: "Last 1 hour",
  },
  {
    value: "3h",
    label: "Last 3 hours",
  },
  {
    value: "6h",
    label: "Last 6 hours",
  },
  {
    value: "12h",
    label: "Last 12 hours",
  },
  {
    value: "1d",
    label: "Last 1 day",
  },
  {
    value: "2d",
    label: "Last 2 days",
  },
  {
    value: "7d",
    label: "Last 7 days",
  },
  {
    value: "14d",
    label: "Last 14 days",
  },
  {
    value: "30d",
    label: "Last 30 days",
  },
];

export async function getData(searchSource: string): Promise<Log[]> {
  let data: Log[] | undefined | any;

  if (searchSource === sources[0]) {
    data = await getLogFromDatabase();
  } else {
    data = await getLogFromLocal();
  }

  if (!data) return [];
  return data;
}
