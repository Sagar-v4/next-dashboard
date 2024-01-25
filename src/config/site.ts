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

// Settings
export const themesLink: keyValue = {
  title: "Themes",
  href: "/settings/themes",
  description: "Theme page",
};

// Profile > Security
export const securityChangePasswordLink: keyValue = {
  title: "Change Password",
  href: "/profile/security/change",
  description: "Change password page",
};

export const securityForgotPasswordLink: keyValue = {
  title: "Forgot Password",
  href: "/profile/security/forgot",
  description: "Forgot password page",
};

export const securityTwoFactorAuthLink: keyValue = {
  title: "2FA",
  href: "/profile/security/2fa",
  description: "Two factor authentication page",
};

// Profile > Accounts
export const accountsDematAccountLink: keyValue = {
  title: "Demat Accounts",
  href: "/profile/accounts/demat",
  description: "Demat Accounts page",
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

export const uiSettings: objectKeyValue = {
  themes: themesLink,
};

export const profileSecurity: objectKeyValue = {
  change: securityChangePasswordLink,
  forgot: securityForgotPasswordLink,
  "2fa": securityTwoFactorAuthLink,
};

export const profileAcccount: objectKeyValue = {
  demate: accountsDematAccountLink,
};
