import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { authLinks } from "@/config/site";
import { CardWrapper } from "@/components/auth/card-wrapper";

export const AuthErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="Oops! Something went wrong!"
      backButtonHref={authLinks.login.href}
      backButtonLabel="Back to login"
    >
      <div className="flex w-full items-center justify-center">
        <ExclamationTriangleIcon className="text-destructive" />
      </div>
    </CardWrapper>
  );
};
