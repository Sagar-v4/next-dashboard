import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";

import "@/styles/globals.css";
import { auth } from "@/auth";
import { cn } from "@/lib/utils";
import { fontSans } from "@/lib/fonts";
import { siteConfig } from "@/config/site";
import { SiteHeader } from "@/components/navbar/site-header";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout = async ({ children }: UserLayoutProps) => {
  const session = await auth();
  return (
    <>
      <SessionProvider session={session}>
        <main
          className={cn(
            "min-h-screen border-2 border-blue-500 bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <div className="flex-1">{children}</div>
          </div>
        </main>
      </SessionProvider>
    </>
  );
};

export default UserLayout;
