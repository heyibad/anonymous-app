import { z } from "zod";

export const userNameValidation = z
    .string()
    .min(5, { message: "Username must be at least 5 characters long" })
    .max(20, { message: "Username must be at most 20 characters long" })
    .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Username must contain only letters and numbers",
    });

export const emailValidation = z
    .string()
    .email()
  ;
export const passwordValidation = z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(16, { message: "Password must be at most 16 characters long" });

export const SignValidation = z.object({
    username: userNameValidation,
    email: emailValidation,
    password: passwordValidation,
});
