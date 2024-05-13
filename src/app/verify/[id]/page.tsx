"use client"
import { verify } from "@/schema/verify";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { useRouter,useParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";


const Page = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const param = useParams<{ id: string }>();
    const { toast } = useToast();
    const form = useForm<z.infer<typeof verify>>({
        resolver: zodResolver(verify),
        defaultValues: {
            verifyCode: "",
        },
    });
    const submit = async (data: z.infer<typeof verify>) => {
        try {
            setLoading(true);
            const req = await axios.post("/api/verify", {
                code: data.verifyCode,
                username: param.id,
            });
            if (req.data.success) {
                toast({
                    description: req.data.message ?? "Successfully Verified",
                    title: "Success",
                    variant: "default",
                });
                router.push("/login");
                setLoading(false);
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            setLoading(false);
            toast({
                title: "Verify Unsuccesfull",
                description:
                    axiosError.response?.data.message ??
                    "Something went wrong, While verifying",
                variant: "destructive",
            });
            console.log(" Error while verify ", error);
        }
    };
    return    <div className=" flex justify-center min-h-screen items-center bg-gray-800">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
Verification            </h1>
            <p className="mb-4">
                verify to continue your secret conversations
            </p>
        </div>
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(submit)}
                className="space-y-6"
            >
                <FormField
                    control={form.control}
                    name="verifyCode"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    placeholder="Enter your verification code"
                                    {...field}
                                    type="number"
        
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    disabled={loading}
                    className=" w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" /> <p className="ml-2">
                            Please wait
                                </p>
                        </>
                    ) : (
                        "Verify"
                    )}
                </Button>
            </form>
        </Form>
        <div className="text-center mt-4">
            <p>
                If you are already verified! {" "}
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
};

export default Page;
