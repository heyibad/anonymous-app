"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
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
import { LoginValidation } from "@/schema/login";
import { signIn } from "next-auth/react";

const Page = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const form = useForm<z.infer<typeof LoginValidation>>({
        resolver: zodResolver(LoginValidation),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onsubmit = async (data: z.infer<typeof LoginValidation>) => {
        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: data.email,
                password: data.password,
          
            });
            console.log(result);
            if (result?.error) {
                toast({
                    title: "Error",
                    description: result.error ?? "An error occurred",
                    variant: "destructive",
                });
            }

           toast(
                {
                    title: "Success",
                    description: "Login successful",
                    variant: "default",
                }
           )
            router.push("/dashboard");

            
        } catch (error:any) {
            toast({
                title: "Error",
                description: error.message ?? "An error occurred",
                variant: "destructive",
            });
            console.log( "An error occurred",error)
        }
    };

    return (
        <div className=" flex justify-center min-h-screen items-center bg-gray-800 bg">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Login to True Feedback
                    </h1>
                    <p className="mb-4">
                        Login to continue your secret conversations
                    </p>
                </div>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onsubmit)}
                        className="space-y-6"
                    >
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
                                    <Loader2 className="animate-spin" />{" "}
                                    <p className="ml-2">Please wait</p>
                                </>
                            ) : (
                                "Login"
                            )}
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Not have any account?{" "}
                        <Link
                            href="/signup"
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Signup
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Page;
