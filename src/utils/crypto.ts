import crypto from "crypto";

export const encrypt = (text: string) => {
  const algorithm = "aes-256-cbc";
  // const key = crypto.randomBytes(10);
  const key = crypto
    .createHash("sha256")
    .update(String("secret"))
    .digest("base64")
    .substr(0, 32);
  // const key = Buffer.from(buffer);
  // const key = crypto.scryptSync("encryptedText", "GfG", 24);
  const iv = Buffer.alloc(16, 0);

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

export const decrypt = (encryptedText: string) => {
  const algorithm = "aes-256-cbc";
  const key = crypto.scryptSync(encryptedText, "GfG", 24);
  const iv = Buffer.alloc(16, 0);

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};
