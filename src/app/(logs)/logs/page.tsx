import { Metadata } from "next";
import LogsDataTable from "@/components/logs/logs";
import { logsLink, siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: {
    default: logsLink.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

const LogsPage = () => {
  return (
    <>
      <LogsDataTable />
    </>
  );
};

export default LogsPage;
