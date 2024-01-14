interface keyValue {
  [key: string]: string;
}

export enum temporaryTypes {
  FORGOT = "FORGOT PASSWORD",
  REGISTRATION = "REGISTRATION",
  "2FA" = "TWO FACTOR AUTHENTICATION",
}

export enum TokenTypes {
  FORGOT = "FORGOT PASSWORD",
  REGISTRATION = "REGISTRATION",
  "2FA" = "TWO FACTOR AUTHENTICATION",
}

export enum userRoles {
  USER = "USER",
  ADMIN = "ADMIN",
}
