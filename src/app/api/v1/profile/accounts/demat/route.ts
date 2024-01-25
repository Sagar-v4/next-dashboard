import { NextResponse } from "next/server";

import { getDematAccounts } from "@/actions/account/table-demat";

export async function GET(req: Request) {
  const parsedUrl = new URL(req.url);
  const params = new URLSearchParams(parsedUrl.search);
  const id: string | null = params.get("id");

  const accounts = await getDematAccounts(id ?? "");

  return NextResponse.json({
    accounts: accounts,
  });
}
