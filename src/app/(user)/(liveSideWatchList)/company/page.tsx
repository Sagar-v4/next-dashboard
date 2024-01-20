import { Metadata } from "next";

import { homeLink, siteConfig } from "@/config/site";
import SessionLogout from "@/components/auth/session-logout";

export const metadata: Metadata = {
  title: {
    default: homeLink.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

const CompanyPage = () => {
  return (
    <>
      <h1 className="mt-20 text-center text-4xl">Company Page</h1>
      <SessionLogout />
    </>
  );
};

export default CompanyPage;
