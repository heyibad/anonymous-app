import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/user.model";
import { emailHelper } from "@/helpers/emailHelper";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();
        const existingUserByUsername = await User.findOne({
            username,
            isVerified: true,
        });
        if (existingUserByUsername) {
            return Response.json(
                {
                    status: false,
                    message: "User already exist with user name and verified",
                },
                { status: 400 }
            );
        }
        const existingUserByEmail = await User.findOne({ email });
        const verifyCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        status: false,
                        message: "User already exist with email and verified",
                    },
                    { status: 400 }
                );
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(
                    Date.now() + 3600000
                );
                await existingUserByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);

            const expiryHours = new Date();
            expiryHours.setHours(expiryHours.getHours() + 1);

            if (!hashedPassword) {
                return Response.json(
                    { status: false, message: "Error while hashing password" },
                    { status: 400 }
                );
            }

            const user = await User.create({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryHours,
                isAcceptingMassages: true,
                messages: [],
            });
            
            if (!user) {
                return Response.json(
                    { status: false, message: "Error while creating user" },
                    { status: 400 }
                );
            }
            const emailResponse = await emailHelper(
                username,
                email,
                verifyCode
            );
            if (!emailResponse.success) {
                return Response.json(
                    { status: false, message: "Error while email sending" },
                    { status: 502 }
                );
            }
            return Response.json(
                {
                    status: true,
                    message: "User created successfully, so verify it by email",
                },
                { status: 200 }
            );
        }
    } catch (error) {
        console.error("Error while registering user", error);
        return Response.json(
            { status: false, message: "Error while registering user" },
            { status: 500 }
        );
    }
}
