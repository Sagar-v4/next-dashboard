"use client";

import { logout } from "@/actions/auth/logout";
import { useCurrentUser } from "@/hooks/use-current-user";

const HomePage = () => {
  const user = useCurrentUser();
  const onClick = async () => {
    await logout();
  };
  return (
    <>
      <h1>Home Page</h1>
      <h1>{JSON.stringify(user)}</h1>
      <button onClick={onClick} type="submit">
        Sign Out
      </button>
    </>
  );
};

export default HomePage;
