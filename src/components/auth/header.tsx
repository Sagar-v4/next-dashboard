import Link from "next/link";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { siteConfig } from "@/config/site";

interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <>
      <div className="flex w-full flex-col items-center justify-center gap-y-4">
        {/* <h1 className={cn("text-3xl font-semibold")}>🔐 Auth</h1> */}
        <Link href="/" className="flex scale-125 items-center space-x-2">
          <Icons.logo className="h-6 w-6" />
          <h1 className="inline-block  font-bold">{siteConfig.name}</h1>
        </Link>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </>
  );
};
