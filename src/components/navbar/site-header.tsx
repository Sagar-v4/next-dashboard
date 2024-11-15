import { mainNavLinks } from "@/config/site";
import { MainNav } from "@/components/navbar/main-nav";
import { RightNav } from "@/components/navbar/right-nav";
import { DropdownProfileMenu } from "@/components/navbar/user-icon/user-drop-down";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <RightNav items={Object.values(mainNavLinks)} />
          <nav className="flex items-center space-x-1">
            <DropdownProfileMenu />
          </nav>
        </div>
      </div>
    </header>
  );
}
