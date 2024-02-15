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
  MONGODB_CONFIG: String(process.env.MONGODB_CONFIG ?? ""),
};

export const github: keyValue = {
  GITHUB_CLIENT_ID: String(process.env.GITHUB_CLIENT_ID),
  GITHUB_CLIENT_SECRET: String(process.env.GITHUB_CLIENT_SECRET),
};

export const google: keyValue = {
  GOOGLE_CLIENT_ID: String(process.env.GOOGLE_CLIENT_ID),
  GOOGLE_CLIENT_SECRET: String(process.env.GOOGLE_CLIENT_SECRET),
};

export const logger: keyValue = {
  LOG_LEVEL: String(process.env.LOG_LEVEL),
  LOCAL_LOG: String(process.env.LOCAL_LOG),
  DATABASE_LOG: String(process.env.DATABASE_LOG),
  LOG_FILE_NAME: String(process.env.LOG_FILE_NAME),
};
