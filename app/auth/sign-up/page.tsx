"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/loading-button";
import ErrorMessage from "@/components/error-message";
import { signUpSchema } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";

export default function SignUpForm() {
  const [signUpError, setSignUpError] = useState<string>("");

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    debugger;
    try {
      const response = await axios.post<ApiResponse>("/api/auth/sign-up", data);

      toast({
        title: "Success",
        description: response.data.message,
      });

      router.replace("/auth/sign-in");
      //we can use redirect
      // router.replace(`/verify/${username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      // Default error message
      let errorMessage =
        axiosError.response?.data.message ||
        "There was a problem with your sign-up. Please try again.";

      setSignUpError(errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-lightGreen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Tamo cloud kitchen
          </h1>
          <p className="mb-4">
            Signup to discover delicious, healthy food options near you.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input placeholder="username" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <Input placeholder="email/username" {...field} />
                  <p className="text-muted text-gray-400 text-sm">
                    We will send you a verification code
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} placeholder="password" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton
              pending={form.formState.isSubmitting}
              label="Sign up"
            />
          </form>
          {signUpError && <ErrorMessage error={signUpError} />}
        </Form>

        <span className="text-sm text-gray-500 text-center block my-2">or</span>

        <div className="text-center mt-4">
          Already a member?{" "}
          <Link
            href="/auth/sign-in"
            className="text-gray-600 hover:text-gray-800 pl-2"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
