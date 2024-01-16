import { Metadata } from "next";
import { profileLink, siteConfig } from "@/config/site";
import SessionLogout from "@/components/auth/session-logout";

export const metadata: Metadata = {
  title: {
    default: profileLink.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

const ProfilePage = () => {
  return (
    <>
      <h1 className="mt-20 text-center text-4xl">Profile Page</h1>
      <SessionLogout />
    </>
  );
};

export default ProfilePage;
