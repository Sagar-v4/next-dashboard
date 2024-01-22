import { NextResponse } from "next/server";

import { get2FA } from "@/actions/auth/2fa-toggle";

export async function GET(req: Request) {
  const parsedUrl = new URL(req.url);
  const params = new URLSearchParams(parsedUrl.search);
  const id: string | null = params.get("id");

  const date = await get2FA(id ?? "");

  return NextResponse.json({
    date: date,
  });
}
