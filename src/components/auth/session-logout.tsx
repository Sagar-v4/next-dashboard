"use client";

import { logout } from "@/actions/auth/logout";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "../ui/button";

const SessionLogout = () => {
  const user = useCurrentUser();
  const onClick = async () => {
    await logout();
  };
  return (
    <div className="mx-60 mt-[20%] space-y-2 rounded-3xl bg-accent p-2 text-center">
      <p>{JSON.stringify(user)}</p>
      <Button onClick={onClick}>Log Out</Button>
    </div>
  );
};

export default SessionLogout;
