import { useSession } from "next-auth/react";

export const useCurrentUser = (): any => {
  const session = useSession();

  return session.data?.user;
};
