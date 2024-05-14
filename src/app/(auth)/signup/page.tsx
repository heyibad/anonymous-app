"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { SignValidation } from "@/schema/signup";
import { ApiResponse } from "@/types/ApiResponse";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const Page = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [userNameMassg, SetUserNameMassg] = useState("");
    const [username, setUsername] = useState("");
    const [isUserCheck, setIsUserCheck] = useState(false);
    const debounceValue = useDebounceCallback(setUsername, 3000);
    const { toast } = useToast();
    const form = useForm<z.infer<typeof SignValidation>>({
        resolver: zodResolver(SignValidation),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        const checkUsername = async () => {
            if (username) {
                setIsUserCheck(true);
                SetUserNameMassg("");
                try {
                    const { data } = await axios.get(
                        `api/user-check?username=${username}`
                    );
                    SetUserNameMassg(data.message);
                    console.log(data);
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    SetUserNameMassg(
                        axiosError.response?.data.message ??
                            "Something went wrong || While checking username"
                    );
                } finally {
                    setIsUserCheck(false);
                }
            }
        };
        checkUsername();
    }, [username]);
    const onsubmit = async (data: z.infer<typeof SignValidation>) => {
        setLoading(true);
        setError("");
        try {
            const response = await axios.post<ApiResponse>("/api/signup", data);
            toast({ description: response.data.message, title: "Success" });
            router.replace(`/verify/${username}`);
            setLoading(false);
            toast({
                title: "Signup Successfully",
                description: response.data.message,
                variant: "default"
            
            })
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            setError(
                axiosError.response?.data.message ?? "Something went wrong"
            );
            toast({
                title: "Login Unsuccesfull",
                description:
                    axiosError.response?.data.message ??
                    "Something went wrong, While login",
                variant: "destructive",
            });
            console.log(" Error while login ", error);
            setLoading(false);
        }
    };

    return (
        <div className=" flex justify-center min-h-screen items-center bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join to True Feedback
                    </h1>
                    <p className="mb-4">
                        Sign up to continue your secret conversations
                    </p>
                </div>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onsubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your username"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                debounceValue(e.target.value);
                                            }}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your email"
                                            {...field}
                                            type="email"
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your password"
                                            {...field}
                                            type="password"
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            disabled={loading}
                            className=" w-full "
                            type="submit"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" />  <p className="ml-2">
                                    Please wait
                                    </p>
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Page;
