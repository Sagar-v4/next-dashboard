import { objectKeyValue } from "@/config/site";
import { Content } from "@/components/side-card/content";
import { CardWrapper } from "@/components/side-card/card-wrapper";

interface SideCardProps {
  headerLabel: string;
  logo?: JSX.Element;
  list: objectKeyValue;
}

export const SideCard = ({ logo, list, headerLabel }: SideCardProps) => {
  return (
    <CardWrapper logo={logo} headerLabel={headerLabel}>
      <Content items={Object.values(list)} />
    </CardWrapper>
  );
};
