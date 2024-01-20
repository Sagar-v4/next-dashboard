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
      <div className="flex w-full flex-col">
        <div className="flex items-center space-x-2">
          {/* <Icons.logo className="h-6 w-6" /> */}
          <h1 className="inline-block font-bold">{label}</h1>
        </div>
      </div>
    </>
  );
};
