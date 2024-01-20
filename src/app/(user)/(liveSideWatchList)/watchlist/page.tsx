import { Metadata } from "next";

import { siteConfig, watchListLink } from "@/config/site";
import SessionLogout from "@/components/auth/session-logout";

export const metadata: Metadata = {
  title: {
    default: watchListLink.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

const WatchListPage = () => {
  return (
    <>
      <h1 className="mt-20 text-center text-4xl">WatchList Page</h1>
      <SessionLogout />
    </>
  );
};

export default WatchListPage;
