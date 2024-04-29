import { z } from "zod";
import { emailValidation,passwordValidation } from "./signup";



export const LoginValidation = z.object({
    email: emailValidation,
    password: passwordValidation,
});
