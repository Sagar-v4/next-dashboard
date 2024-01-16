export type SiteConfig = typeof siteConfig;

export const homeLink = {
  title: "Home",
  href: "/home",
  description: "Home page",
};

export const profileLink = {
  title: "Profile",
  href: "/profile",
  description: "Profile page",
};

export const loginLink = {
  title: "Login",
  href: "/login",
  description: "Login page",
};

export const registerLink = {
  title: "Register",
  href: "/register",
  description: "Registration page",
};

export const resetLink = {
  title: "Reset",
  href: "/reset",
  description: "Reset password page",
};

export const createLink = {
  title: "Create",
  href: "/create",
  description: "Create password page",
};

export const twoFactorAuthLink = {
  title: "Two Factor Authentication",
  href: "/2fa",
  description: "Profile page",
};

export const errorLink = {
  title: "Profile page",
  href: "/auth-error",
  description:
    "If user login with same emailid with multiple oath providers, this error page will be shown rather than default error page",
};

export const siteConfig = {
  name: "Next Level",
  description:
    "Beautifully designed components built with Radix UI and Tailwind CSS.",
  mainNav: [homeLink, loginLink, registerLink],
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/ui",
    docs: "https://ui.shadcn.com",
  },
};

export const authLinks = {
  login: loginLink,
  register: registerLink,
  reset: resetLink,
  create: createLink,
  twoFactorAuth: twoFactorAuthLink,
  error: errorLink,
};
