interface Config {
  [key: string]: string;
}

export const config: Config = {
  SMTP_EMAIL: String(process.env.SMTP_EMAIL),
  SMTP_PASSWORD: String(process.env.SMTP_PASSWORD),
};
