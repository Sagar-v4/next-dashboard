import { LockKeyhole, Users } from "lucide-react";

import { Card } from "@/components/ui/card";
import { SideCard } from "@/components/side-card/side-card";
import { profileAcccount, profileSecurity } from "@/config/site";

const accountsLogo = (): JSX.Element => {
  return <Users className="w-5" />;
};

const securityLogo = (): JSX.Element => {
  return <LockKeyhole className="w-5" />;
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <section className="container flex w-screen gap-2 border-2 border-red-500">
        <div className="my-2 h-[calc(100vh-89px)] w-[25%] space-y-4 overflow-auto p-1">
          <SideCard
            logo={accountsLogo()}
            headerLabel="Accounts"
            list={profileAcccount}
          />
          <SideCard
            logo={securityLogo()}
            headerLabel="Security"
            list={profileSecurity}
          />
        </div>
        <div className="my-2 w-[75%] p-1 pb-1">
          <Card className="h-[calc(100vh-89px)] overflow-auto rounded-sm shadow-none">
            {children}
          </Card>
        </div>
      </section>
    </main>
  );
}
