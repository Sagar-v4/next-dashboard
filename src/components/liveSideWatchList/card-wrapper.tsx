"use client";

import {
  Card,
  CardFooter,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { Header } from "@/components/liveSideWatchList/header";
import { Social } from "@/components/auth/social";
import { BackButton } from "@/components/auth/back-button";
import { Separator } from "@/components/ui/separator";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel?: string;
  backButtonHref?: string;
  showSocial?: boolean;
  onClickBackButton?: () => void;
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
  onClickBackButton,
}: CardWrapperProps) => {
  return (
    <>
      <Card className="w-full rounded-sm shadow-none">
        <CardHeader className="p-4">
          <Header label={headerLabel} />
        </CardHeader>
        <Separator />
        <CardContent className="py-0">{children}</CardContent>
      </Card>
    </>
  );
};
