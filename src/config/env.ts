interface keyValue {
  [key: string]: string;
}

export const smtpMail: keyValue = {
  SMTP_EMAIL: String(process.env.SMTP_EMAIL),
  SMTP_PASSWORD: String(process.env.SMTP_PASSWORD),
};

export const db: keyValue = {
  MONGODB_URI: String(process.env.MONGODB_URI),
  DATABASE_NAME: String(process.env.DATABASE_NAME),
};
