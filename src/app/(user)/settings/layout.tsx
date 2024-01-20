// import ProfileSidebar from "@/components/ui/profile-sidebar";

import SessionLogout from "@/components/auth/session-logout";
import { SystemSettingsCard } from "@/components/settings/system-settings-card";
import { Card } from "@/components/ui/card";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <section className="container flex w-screen gap-2 border-2 border-red-500">
        <div className="my-2 w-[25%] p-1 pb-1">
          <SystemSettingsCard />
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
