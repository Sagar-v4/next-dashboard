export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Next Level",
  description:
    "Beautifully designed components built with Radix UI and Tailwind CSS.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Login",
      href: "/login",
    },
    {
      title: "Register",
      href: "/register",
    },
  ],
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/ui",
    docs: "https://ui.shadcn.com",
  },
};

export const authLinks = {
  login: {
    title: "Login",
    href: "/login",
  },
  register: {
    title: "Register",
    href: "/register",
  },
  reset: {
    title: "Reset",
    href: "/reset",
  },
  create: {
    title: "Create",
    href: "/create",
  },
};
