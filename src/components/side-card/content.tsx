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
      <div className="w-full py-1">
        {items
          ? items.map((item: any, index: number) => {
              return (
                <Link
                  href={item.href}
                  key={index}
                  className={cn(
                    "flex w-full cursor-pointer rounded-sm px-2 py-1.5 text-sm font-medium text-muted-foreground hover:underline",
                    path.includes(item.href) &&
                      "text-primary-background bg-secondary"
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
