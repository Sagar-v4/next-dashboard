import { Metadata } from "next";
import { settingLink, siteConfig } from "@/config/site";
import SessionLogout from "@/components/auth/session-logout";

export const metadata: Metadata = {
  title: {
    default: settingLink.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

const SettingsPage = () => {
  return (
    <>
      <h1 className="mt-20 text-center text-4xl">Settings Page</h1>
      <SessionLogout />
    </>
  );
};

export default SettingsPage;
