"use client";

import Link from "next/link";
import * as React from "react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { keyValue } from "@/config/site";

interface RightNavProps {
  items?: keyValue[];
}

export function RightNav({ items }: RightNavProps) {
  const path = usePathname();
  return (
    <>
      {items?.length ? (
        <nav className="flex">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:underline",
                    item.disabled && "cursor-not-allowed opacity-80",
                    path === item.href &&
                      "text-primary-background rounded-sm bg-secondary"
                  )}
                >
                  {item.title}
                </Link>
              )
          )}
        </nav>
      ) : null}
    </>
  );
}
