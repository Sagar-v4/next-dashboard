"use server";

import { signOut } from "@/auth";

export const logout = async () => {
  // TODO: add any important task on server befor logout

  await signOut();
};
