import { getServerSession, User } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import { User as UserModel } from "@/models/user.model";
import { NextAuthOption } from "../auth/[...nextauth]/options";
import { NextRequest } from "next/server";

export default async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const session = await getServerSession(NextAuthOption);
        const user: User = session?.user as User;
        if (!session || !user) {
            return Response.json(
                { message: "Unauthorized", status: false },
                { status: 401 }
            );
        }
        const user_id = user._id;
        const { acceptingMassages } = await req.json();
        const userFind = await UserModel.findByIdAndUpdate(
            user_id,
            { isAcceptingMassages: acceptingMassages },
            { new: true }
        );
        if (!userFind) {
            return Response.json(
                { message: "User Not Found", status: false },
                { status: 404 }
            );
        }
        return Response.json(
            { message: "Message status accepted", status: true },
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

export async function GET(req: NextRequest) {
    await dbConnect();
    try {
        const session = await getServerSession(NextAuthOption);
        const user: User = session?.user as User;
        if (!session || !user) {
            return Response.json(
                { message: "Unauthorized", status: false },
                { status: 401 }
            );
        }
        const user_id = user._id;
        const userFind = await UserModel.findById(user_id);
        if (!userFind) {
            return Response.json(
                { message: "User Not Found", status: false },
                { status: 404 }
            );
        }
        return Response.json(
            { acceptingMassages: userFind.isAcceptingMassages, status: true },
            { status: 200 }
        );
    } catch (error) {
        console.log("Error while getting message status: ", error);
        return Response.json(
            { message: "Error while getting message status", status: false },
            { status: 500 }
        );
    }
}
