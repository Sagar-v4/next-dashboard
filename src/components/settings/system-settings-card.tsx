import { uiSettings } from "@/config/site";
import { Content } from "@/components/settings/content";
import { CardWrapper } from "@/components/settings/card-wrapper";

export const SystemSettingsCard = () => {
  return (
    <CardWrapper
      headerLabel="UI"
      // backButtonHref={authLinks.login.href}
      // backButtonLabel="Back to login"
    >
      <Content items={Object.values(uiSettings)} />
    </CardWrapper>
  );
};
