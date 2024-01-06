"use server";

import nodemailer from "nodemailer";
import { config } from "@/config/config";
// import * as handlebars from "handlebars";
// import { welcomeTemplate } from "./templates/welcome";

interface Mail {
  to: string;
  name: string;
  subject: string;
  body: string;
}

export const sendMail = async ({
  to,
  name,
  subject,
  body,
}: Mail): Promise<boolean> => {
  try {
    const { SMTP_EMAIL, SMTP_PASSWORD } = config;

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASSWORD,
      },
    });
    console.log("🚀 ~ file: mail.ts:26 ~ sendMail ~ transport:", transport);
    const testResult = await transport.verify();
    console.log("🚀 ~ file: mail.ts:28 ~ sendMail ~ testResult:", testResult);

    const sendResult = await transport.sendMail({
      from: SMTP_EMAIL,
      to,
      subject,
      html: body,
    });
    console.log("🚀 ~ file: mail.ts:37 ~ sendMail ~ sendResult:", sendResult);
    return sendResult.response.includes("2.0.0 OK");
  } catch (error) {
    console.log("🚀 ~ file: mail.ts:39 ~ sendMail ~ error:", error);
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
