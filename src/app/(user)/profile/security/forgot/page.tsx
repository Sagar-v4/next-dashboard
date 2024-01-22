import { Metadata } from "next";

import { profileLink, siteConfig } from "@/config/site";
import { ForgotPasswordForm } from "@/components/auth/form/password/forgot";

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
      <ForgotPasswordForm />
    </>
  );
};

export default ThemesPage;
