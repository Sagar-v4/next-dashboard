import { Metadata } from "next";

import { portfolioLink, siteConfig } from "@/config/site";
import SessionLogout from "@/components/auth/session-logout";

export const metadata: Metadata = {
  title: {
    default: portfolioLink.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

const PortfolioPage = () => {
  return (
    <>
      <h1 className="mt-20 text-center text-4xl">Portfolio Page</h1>
      <SessionLogout />
    </>
  );
};

export default PortfolioPage;
