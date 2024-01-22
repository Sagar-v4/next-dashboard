import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/side-card/header";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface CardWrapperProps {
  logo?: JSX.Element;
  headerLabel: string;
  children: React.ReactNode;
}

export const CardWrapper = ({
  logo,
  children,
  headerLabel,
}: CardWrapperProps) => {
  return (
    <>
      <Card className="w-full rounded-sm shadow-none">
        <CardHeader className="rounded-t-sm bg-card-foreground p-3 text-card">
          <Header label={headerLabel} logo={logo} />
        </CardHeader>
        <Separator />
        <CardContent className="m-0 px-1 py-0">{children}</CardContent>
      </Card>
    </>
  );
};
