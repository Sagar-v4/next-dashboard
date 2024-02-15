import { Logger } from "@/logger/logger";
import { sendSMTPMail } from "@/lib/relay/email/smtp-email";

export const sendRegistrationEmail = async (
  email: string,
  link: string
): Promise<boolean> => {
  try {
    await sendSMTPMail({
      to: email,
      subject: "New Registration",
      body: `<a href="${link}">click here</a> to get started`,
    });
    return true;
  } catch (error) {
    Logger.fatal({
      message: "sendRegistrationEmail catch!",
      error: (error as Error).message,
    });

    return false;
  }
};

export const sendResetEmail = async (
  email: string,
  link: string
): Promise<boolean> => {
  try {
    await sendSMTPMail({
      to: email,
      subject: "Forgot Password",
      body: `<a href="${link}">click here</a> to reset password`,
    });
    return true;
  } catch (error) {
    Logger.fatal({
      message: "sendResetEmail catch!",
      error: (error as Error).message,
    });

    return false;
  }
};

export const send2FAEmail = async (
  email: string,
  code: string
): Promise<boolean> => {
  try {
    await sendSMTPMail({
      to: email,
      subject: "2FA",
      body: `<p>Your 2FA Code is: <strong>${code}</strong></p>`,
    });
    return true;
  } catch (error) {
    Logger.fatal({
      message: "send2FAEmail catch!",
      error: (error as Error).message,
    });

    return false;
  }
};
