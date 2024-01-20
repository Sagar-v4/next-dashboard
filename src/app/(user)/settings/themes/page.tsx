import { Metadata } from "next";
import { profileLink, siteConfig } from "@/config/site";
import { ThemeSwitcher } from "@/components/themes/theme-switcher";

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
      <ThemeSwitcher />
    </>
  );
};

export default ThemesPage;
