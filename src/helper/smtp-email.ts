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
