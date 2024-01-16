"use server";

import nodemailer from "nodemailer";
import { smtpMail } from "@/config/env";
// import * as handlebars from "handlebars";
// import { welcomeTemplate } from "./templates/welcome";

/**
 * YT Link: https://www.youtube.com/watch?v=81lt0qcXtHE
 */

interface Mail {
  to: string;
  subject: string;
  body: string;
  name?: string;
}

export const sendSMTPMail = async ({ to, subject, body, name }: Mail) => {
  try {
    const { SMTP_EMAIL, SMTP_PASSWORD } = smtpMail;

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASSWORD,
      },
    });
    const testResult = await transport.verify();

    const sendResult = await transport.sendMail({
      from: SMTP_EMAIL,
      to,
      subject,
      html: body,
    });
    return sendResult.response.includes("2.0.0 OK") as boolean;
  } catch (error) {
    return false;
  }
};

// export function compileWelcomeTemplate(name: string, url: string) {
//   const template = handlebars.compile(welcomeTemplate);
//   const htmlBody = template({
//     name: name,
//     url: url,
//   });
//   return htmlBody;
// }
