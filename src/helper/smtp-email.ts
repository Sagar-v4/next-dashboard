import { sendSMTPMail } from "@/lib/relay/email/smtp-email";

export const sendVerificationEmail = async (
  email: string,
  link: string
): Promise<boolean> => {
  try {
    await sendSMTPMail({
      to: email,
      subject: "New Registration Verification",
      body: `<a href="${link}">click here</a> to get started`,
    });
    return true;
  } catch (error) {
    console.log("🚀 ~ error:", error);
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
    console.log("🚀 ~ error:", error);
    return false;
  }
};
