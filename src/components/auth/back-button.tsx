"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  href: string;
  label: string;
  clickFunction?: () => void;
}

export const BackButton = ({ href, label, clickFunction }: BackButtonProps) => {
  return (
    <>
      <Button
        onClick={clickFunction}
        variant="link"
        className="w-full font-normal"
        size="sm"
        asChild
      >
        <Link href={href}>{label}</Link>
      </Button>
    </>
  );
};
