import { resend } from "@/lib/resend";
import VerificationEmail from "../../templates/VerificationEmailTemplate";
import { ApiResponse } from "@/types/ApiResponse";

export async function emailHelper(
    username:string,
    email:string,
    verifyCode:string
):Promise<ApiResponse>{
    try {
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Verification Code',
            react: VerificationEmail({ username,otp:verifyCode }),
          });
        return {success:true, message:"Email send Successfully"}

    } catch (error) {
        console.error("Error while sending an email")
        return {success:false, message:"Failed to send Email"}
    }
    
}