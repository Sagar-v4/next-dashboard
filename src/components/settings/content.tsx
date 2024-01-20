"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface ContentProps {
  items: any;
}

export const Content = ({ items }: ContentProps) => {
  const path = usePathname();
  return (
    <>
      <div key={"fdsfds"} className="w-full py-2">
        {items
          ? items.map((item: any, index: number) => {
              return (
                <Link
                  href={item.href}
                  key={index}
                  className={cn(
                    "flex w-full cursor-pointer rounded-sm pl-2 hover:bg-secondary",
                    path.includes(item.href) &&
                      "bg-secondary text-secondary-foreground"
                  )}
                >
                  {item.title}
                </Link>
              );
            })
          : null}
      </div>
    </>
  );
};
