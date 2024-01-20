"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function ThemeSwitcher() {
  const { setTheme: setMode, resolvedTheme: mode } = useTheme();

  return (
    <>
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex gap-4">
          <Button
            variant={"outline"}
            size="sm"
            onClick={() => setMode("light")}
            className={cn(
              mode === "light" && "border-2 border-primary",
              "h-40 w-40 text-xl"
            )}
          >
            <Sun className="mr-1 -translate-x-1 scale-125" />
            Light
          </Button>
          <Button
            variant={"outline"}
            size="sm"
            onClick={() => setMode("dark")}
            className={cn(
              mode === "dark" && "border-2 border-primary",
              "h-40 w-40 text-xl"
            )}
          >
            <Moon className="mr-1 -translate-x-1 scale-125" />
            Dark
          </Button>
        </div>
      </div>
    </>
  );
}
