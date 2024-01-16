import NextAuth from "next-auth";

import {
  authRoutes,
  publicRoutes,
  apiAuthPrefix,
  DEFAULT_LOGIN_REDIRECT,
} from "@/routes";
import authConfig from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);

  if (isApiAuthRoute) return null;
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL(`/login`, nextUrl));
    // let callbackUrl = nextUrl.pathname;
    // if (nextUrl.search) {
    //   callbackUrl += nextUrl.search;
    // }

    // const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    // return Response.redirect(
    //   new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    // );
  }
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  // default
  // matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],

  // https://clerk.com/docs/references/nextjs/auth-middleware#usage
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
