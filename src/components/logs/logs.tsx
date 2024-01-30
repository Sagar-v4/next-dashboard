"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { columns } from "@/components/logs/columns";
import { Log, getData } from "@/components/logs/data";
import { DataTable } from "@/components/logs/data-table";

export default function LogsDataTablef() {
  const [data, setData] = useState<Log[] | any>();

  const searchParams = useSearchParams();
  const searchSource = searchParams.get("source");

  useEffect(() => {
    (async () => {
      const logs = await getData(searchSource as string);
      setData(logs);
    })();
  }, [searchSource]);

  return (
    <div className="container py-4">
      {data ? <DataTable columns={columns} data={data} /> : "Loading..."}
    </div>
  );
}
