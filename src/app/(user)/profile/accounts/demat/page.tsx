import { Metadata } from "next";

import { profileLink, siteConfig } from "@/config/site";
import { DematAccounts } from "@/components/accounts/demat-accounts";

export const metadata: Metadata = {
  title: {
    default: profileLink.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

const DematAccountsPage = () => {
  return (
    <>
      <DematAccounts />
    </>
  );
};

export default DematAccountsPage;
