export const generateRandomId = (): string => {
  return Math.random().toString(36).substring(2, 9); // Generate 7-character string
};
