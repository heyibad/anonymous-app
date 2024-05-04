import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import { User } from "@/models/user.model";
import { userNameValidation } from "@/schema/signup";
import { NextRequest } from "next/server";

const userCheckSchema = z.object({
    username: userNameValidation,
});

export async function GET(request: NextRequest) {

    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get("username"),
        };
        const result = userCheckSchema.safeParse(queryParam);

        if (!result.success) {
            const userErrors = result.error.format().username?._errors || [];

            return Response.json(
                {
                    message: "Invalid username",
                    status: "false",
                    error: userErrors,
                },
                {
                    status: 400,
                }
            );
        }
        const { username } = result.data;
        const userInDatabase = await User.findOne({
            username,
            isVerified: true,
        });
        if (userInDatabase) {
            return Response.json(
                {
                    message: "Username is already taken by another user",
                    status: "false",
                },
                {
                    status: 400,
                }
            );
        }
        return Response.json(
            {
                message: "Username is available",
                status: "true",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.log("Error on username checking ;", error);

        return Response.json(
            {
                message: " Error on username check",
                status: "false",
            },
            {
                status: 500,
            }
        );
    }
}
