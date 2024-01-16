export const emailComponents = /^(.+)@(.+)\.(.+)$/;
export const emailTagComponents = /^(.+)\+(.+)@(.+)\.(.+)$/;

// [_, username, domain, ltd]
export const splitEmailComponents = (email: string): string[] => {
  return email.split(emailComponents);
};

// [_, username, tag, domain, ltd]
export const splitEmailTagComponents = (email: string): string[] => {
  return email.split(emailTagComponents);
};

// regex /^username\+.*@example.com$/
export const emailWithoutTagRegex = (email: string): RegExp => {
  const [user, domain] = email.split("@");
  const [userName, tag] = user.split("+");

  return new RegExp(`^${userName}\+.*@${domain}$`);
};
