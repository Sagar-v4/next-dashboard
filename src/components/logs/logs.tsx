import { getLogFromLocal } from "@/logger/local";
import { DataTable } from "@/components/logs/data-table";
import { Log, columns } from "@/components/logs/columns";

async function getData(): Promise<Log[]> {
  const data: Log[] | undefined = await getLogFromLocal();

  if (!data) return [];
  return data;
}

export default async function LogsDataTablef() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
