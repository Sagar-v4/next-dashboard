import { LockKeyhole } from "lucide-react";

import { Card } from "@/components/ui/card";
import { profileSecurity } from "@/config/site";
import { SideCard } from "@/components/side-card/side-card";

const logo = (): JSX.Element => {
  return <LockKeyhole />;
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <section className="container flex w-screen gap-2 border-2 border-red-500">
        <div className="my-2 w-[25%] space-y-4 p-1 pb-1">
          <SideCard
            logo={logo()}
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
