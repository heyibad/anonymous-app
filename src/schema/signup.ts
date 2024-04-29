import { verify } from "crypto";
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
    .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Email must contain only letters and numbers",
    });

export const SignValidation = z.object({
    username: userNameValidation,
    email: emailValidation,
    password: z
        .string()
        .min(6, "Password minimum length is 6")
        .max(16, "Password maximum length is 16"),
});
