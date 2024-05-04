import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import { User } from "@/models/user.model";
import { verify } from "@/schema/verify";
import { NextRequest } from "next/server";


const verifySchema = z.object({
    verifyCode: verify,
});

export async function POST(request: NextRequest) {

    await dbConnect();
    
    try {
        const {code,username}= await request.json()
        const decodedUsername= decodeURI(username)
        const result = verifySchema.safeParse({ verifyCode: code });
        if (!result.success) {
            const verifyErrors = result.error.format().verifyCode?._errors || [];

            return Response.json(
                {
                    message: "Invalid verification code",
                    status: "false",
                    error: verifyErrors,
                },
                {
                    status: 400,
                }
            );
        }
        const  {verifyCode} = result.data.verifyCode;
         
        const userInDatabase = await User.findOne({
            username: decodedUsername,
        });
        if (!userInDatabase) {
            return Response.json(
                {
                    message: "Invalid user not found",
                    status: "false",
                },
                {
                    status: 400,
                }
            );
        }
        const codeValid= userInDatabase.verifyCode===verifyCode
        const timeValid= new Date(userInDatabase.verifyCodeExpiry) > new Date()
        if (!codeValid || !timeValid) {
            return Response.json(
                {
                    message: "Invalid verification code Or Expired code",
                    status: "false",
                },
                {
                    status: 400,
                }
            );
        }
        userInDatabase.isVerified = true;
        await userInDatabase.save();

    
        return Response.json(
            {
                message: "User verified successfully",
                status: "true",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.log("Error on vefication of user ;", error);

        return Response.json(
            {
                message: " Error on vefication of user",
                status: "false",
            },
            {
                status: 500,
            }
        );
    }
}
