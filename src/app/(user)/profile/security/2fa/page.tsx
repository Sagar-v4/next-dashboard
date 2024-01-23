import { Metadata } from "next";

import { profileLink, siteConfig } from "@/config/site";
import { TwoFactorToggleSwitch } from "@/components/auth/form/2fa-toggle";

export const metadata: Metadata = {
  title: {
    default: profileLink.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

const ThemesPage = () => {
  return (
    <>
      <TwoFactorToggleSwitch />
    </>
  );
};

export default ThemesPage;
