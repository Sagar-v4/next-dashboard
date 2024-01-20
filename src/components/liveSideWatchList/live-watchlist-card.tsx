import { Content } from "./content";
import { uiSettings } from "@/config/site";
import { CardWrapper } from "@/components/liveSideWatchList/card-wrapper";

export const LiveWatchListCard = () => {
  return (
    <CardWrapper
      headerLabel="Watchlist Name"
      // backButtonHref={authLinks.login.href}
      // backButtonLabel="Back to login"
    >
      <Content items={Object.values(uiSettings)} />
    </CardWrapper>
  );
};
