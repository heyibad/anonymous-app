import dbConnect from "../../../../lib/dbConnect";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "../../../../models/user.model";
import bcrypt from "bcrypt";

    export const NextAuthOption: NextAuthOptions = {
        providers: [
            CredentialsProvider({
                id: "credentials",
                name: "Credentials",
                credentials: {
                    email: { label: "Email", type: "text" },
                    password: { label: "Password", type: "password" },
                },
                async authorize(credentials: any): Promise<any> {
                    await dbConnect();
                    try {
                        const user = await User.findOne({
                            $or: [
                                { username: credentials.username },
                                { email: credentials.email },
                            ],
                        });
                        if (!user) {
                            throw new Error("User Not Found || Oauth");
                        }
                        if (!user.isVerified) {
                            throw new Error("User is Not Verified || Oauth");
                        }
                        const chkPass = await bcrypt.compare(
                            credentials.password,
                            user.password
                        );
                        if (!chkPass) {
                            throw new Error("User Not Found || Oauth");
                        } else {
                            return user;
                        }
                    } catch (error) {
                        console.log("Error while Oauth", error);
                        throw new Error("Error while Oauth");
                    }
                },
            }),
        ],
        pages:{
            signIn: '/login',
        
        },
        session:{
            strategy: 'jwt',
        },
        secret: process.env.SECRET,
    };
