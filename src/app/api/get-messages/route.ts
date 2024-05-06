import { getServerSession, User } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import { User as UserModel } from "@/models/user.model";
import { NextAuthOption } from "../auth/[...nextauth]/options";
import { NextRequest } from "next/server";
import mongoose from "mongoose";

export default async function GET(req: NextRequest) {
    await dbConnect();
    try {
        const session = await getServerSession(NextAuthOption);
        const _user: User = session?.user as User;
        if (!session || !_user) {
            return Response.json(
                { message: "Unauthorized", status: false },
                { status: 401 }
            );
        }
        const user_id = new mongoose.Types.ObjectId(_user.id);
        const user = await UserModel.aggregate([
            { $match: { _id: user_id } }, // match the user
            { $unwind: "$messages" }, // unwind the messages array and create a new document for each message
            { $sort: { "messages.createdAt": -1 } }, // sort the messages by createdAt in descending order
            {
                $group: {
                    _id: "$_id",
                    messages: { $push: "$messages" }, // push the messages into an array
                },
            },
        ]);
        if (!user || user.length === 0) {
            return Response.json(
                { message: "No user found", status: false },
                { status: 404 }
            );
        }
        return Response.json(
            { messages: user[0].messages, status: true },
            { status: 200 }
        );
    } catch (error) {
        console.log("Error while accepting message status: ", error);
        return Response.json(
            { message: "Error while accepting message status", status: false },
            { status: 500 }
        );
    }
}
