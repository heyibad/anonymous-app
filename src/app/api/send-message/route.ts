import dbConnect from "@/lib/dbConnect";
import { User, Message } from "@/models/user.model";
import { NextRequest } from "next/server";

export async function name(req: NextRequest) {
    await dbConnect();
    const { username, content } = await req.json();
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return Response.json(
                { message: "User not found", status: false },
                { status: 404 }
            );
        }
        if (!user.isAcceptingMassages) {
            return Response.json(
                { message: "User is not accepting messages", status: false },
                { status: 400 }
            );
        }
        const message = { content, createdAt: new Date() };
        user.messages.push(message as Message);
        await user.save();
        return Response.json(
            { message: "Message sent successfully", status: true },
            { status: 200 }
        );
    } catch (error) {
        return Response.json(
            { message: "Internal server error || Message Failed", status: false },
            { status: 500 }
        );
    }
}
