import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.string().min(6, { message: "It should be 6 numbers" }).optional(),
});
// .refine((data) => !/[^\d]/.test(data?.code as string), {
//   message: "It should be numbers only",
//   path: ["code"],
// });

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  firstName: z.string().min(1, {
    message: "First name is required",
  }),
  lastName: z.string().min(1, {
    message: "Last name is required",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const CreatePasswordSchema = z
  .object({
    password: z.string().min(6, {
      message: "Password should be at least 6 characters",
    }),
    confirmPassword: z.string().min(6, {
      message: "Password should be at least 6 characters",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const TwoFactorAuthSchema = z
  .object({
    code: z.string().min(6, { message: "It should be 6 numbers" }),
  })
  .refine((data) => !/[^\d]/.test(data.code.trim()), {
    message: "It should be numbers only",
    path: ["code"],
  });

export const TwoFactorToggleSchema = z.object({
  id: z.string(),
  toggle: z.boolean(),
});

export const ChangePasswordSchema = z
  .object({
    id: z.string(),
    currentPassword: z.string().min(6, {
      message: "Password should be at least 6 characters",
    }),
    newPassword: z.string().min(6, {
      message: "Password should be at least 6 characters",
    }),
    confirmPassword: z.string().min(6, {
      message: "Password should be at least 6 characters",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const ForgotPasswordSchema = z.object({
  id: z.string(),
  email: z.boolean(),
  sms: z.boolean().optional(),
  whatsapp: z.boolean().optional(),
});
