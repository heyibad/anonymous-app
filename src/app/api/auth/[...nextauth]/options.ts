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
        callbacks:{
            async jwt({token, user}){
                if(user){
                    token._id = user._id?.toString();
                    token.username = user.username;
                    token.email = user.email;
                    token.isVerified = user.isVerified;
                    token.isAcceptingMassages = user.isAcceptingMassages;
                }
                return token;
            },
            async session({session, token}){
                if(token){
                session.user._id = token._id;
                session.user.username = token.username;
                session.user.email = token.email;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMassages = token.isAcceptingMassages;
                }
                return session;
            }
        }
    };
