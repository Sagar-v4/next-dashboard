import { Metadata } from "next";

import { profileLink, siteConfig } from "@/config/site";
import { ChangePasswordForm } from "@/components/auth/form/password/change";

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
      <ChangePasswordForm />
    </>
  );
};

export default ThemesPage;
