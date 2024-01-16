export type SiteConfig = typeof siteConfig;

export interface keyValue {
  [key: string]: string;
}

export interface objectKeyValue {
  [key: string]: keyValue;
}

export const siteConfig: keyValue = {
  name: "Next Level",
  description: "Next level creation.",
};

// user
export const homeLink: keyValue = {
  title: "Home",
  href: "/home",
  description: "Home page",
};

export const profileLink: keyValue = {
  title: "Profile",
  href: "/profile",
  description: "Profile page",
};

export const portfolioLink: keyValue = {
  title: "Portfolio",
  href: "/portfolio",
  description: "Portfolio page",
};

export const watchListLink: keyValue = {
  title: "Watchlist",
  href: "/watchlist",
  description: "Watchlist page",
};

export const settingLink: keyValue = {
  title: "Settings",
  href: "/settings",
  description: "Settings page",
};

// authentication
export const loginLink: keyValue = {
  title: "Login",
  href: "/login",
  description: "Login page",
};

export const registerLink: keyValue = {
  title: "Register",
  href: "/register",
  description: "Registration page",
};

export const resetLink: keyValue = {
  title: "Reset",
  href: "/reset",
  description: "Reset password page",
};

export const createLink: keyValue = {
  title: "Create",
  href: "/create",
  description: "Create password page",
};

export const twoFactorAuthLink: keyValue = {
  title: "Two Factor Authentication",
  href: "/2fa",
  description: "Two Factor Authentication page",
};

export const errorLink: keyValue = {
  title: "Profile page",
  href: "/auth-error",
  description:
    "If user login with same emailid with multiple oath providers, this error page will be shown rather than default error page",
};

export const authLinks: objectKeyValue = {
  login: loginLink,
  register: registerLink,
  reset: resetLink,
  create: createLink,
  twoFactorAuth: twoFactorAuthLink,
  error: errorLink,
};

export const mainNavLinks: objectKeyValue = {
  home: homeLink,
  watchList: watchListLink,
  portfolio: portfolioLink,
};

export const userDropDownLinks: objectKeyValue = {
  profile: profileLink,
  settings: settingLink,
};
