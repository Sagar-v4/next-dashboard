import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { uiSettings } from "@/config/site";
import { Content } from "@/components/profile/content";
import { CardWrapper } from "@/components/profile/card-wrapper";

export const ProfileCard = () => {
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
