import { Settings } from "lucide-react";

import { uiSettings } from "@/config/site";
import { Card } from "@/components/ui/card";
import { SideCard } from "@/components/side-card/side-card";

const logo = (): JSX.Element => {
  return <Settings />;
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <section className="container flex w-screen gap-2 border-2 border-red-500">
        <div className="my-2 w-[25%] p-1 pb-1">
          <SideCard logo={logo()} list={uiSettings} headerLabel="Settings" />
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
