import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const messageSchema: Schema<Message> = new Schema({
    content: { type: String, required: [true, "Message is required"] },
    createdAt: { type: Date, default: Date.now, required: true },
});

interface User extends Document {
    username: string;
    email: string;
    password: string;
    messages: Message[];
    isAcceptingMassages: boolean;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
}

const userSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    password: { type: String, required: [true, "Password is required"] },
    messages: [messageSchema],
    isAcceptingMassages: { type: Boolean, default: true },
    verifyCode: { type: String },
    verifyCodeExpiry: { type: Date },
    isVerified: { type: Boolean, default: false },
});

export const User =
    mongoose.model<User>("User", userSchema) ||
    (mongoose.models.User as mongoose.Model<User>);
