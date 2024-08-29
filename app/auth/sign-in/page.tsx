"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/schemas/signInSchema";
import LoadingButton from "@/components/loading-button";
import ErrorMessage from "@/components/error-message";

export default function SignInForm() {
  const router = useRouter();
  const [signInError, setSignInError] = useState<string>("");

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onGoogleAuth() {
    const result = await signIn("google", { redirect: false });
    if (result?.error) {
      setSignInError(result.error);
    } else if (result?.url) {
      // router.replace(result.url); // Redirect to the specified URL after successful sign-in
      router.push("/");
    }
  }

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        const errorMessage =
          result.error === "CredentialsSignin"
            ? "Invalid credentials"
            : `Error: ${result.error}`;

        setSignInError(errorMessage);
        return { message: errorMessage };
      }
      if (result?.url) {
        //router.replace("/"); // Redirect to the specified URL after successful sign-in
        router.push("/");
      }
    } catch (error: any) {
      setSignInError(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-400 to-lightGreen">
      <div className="w-full max-w-md p-10 space-y-8 bg-white rounded-2xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight lg:text-6xl text-gray-800 mb-6">
            Tamo Cloud Kitchen
          </h1>
          <p className="mb-6 text-lg text-gray-600">
            Log in to discover delicious, healthy food options near you.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Email/Username
                  </FormLabel>
                  <Input
                    placeholder="Enter your email/username"
                    {...field}
                    className="border-gray-300 focus:ring-2 focus:ring-green-500"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Password
                  </FormLabel>
                  <Input
                    type="password"
                    {...field}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="border-gray-300 focus:ring-2 focus:ring-green-500"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton
              pending={form.formState.isSubmitting}
              label="Sign in"
              className="w-full bg-green-500 text-white py-2 rounded-lg shadow hover:bg-green-600 transition duration-150 ease-in-out"
            />
          </form>
          {signInError && <ErrorMessage error={signInError} />}
        </Form>

        <span className="text-sm text-gray-500 text-center block my-4">or</span>

        <div className="google-auth-container">
          <Button
            variant="outline"
            className="w-full border border-gray-300 text-gray-600 hover:bg-gray-50 py-2 rounded-lg shadow"
            onClick={onGoogleAuth}
          >
            <Image
              src="/assets/images/google-logo.svg"
              alt="Google icon"
              width={20}
              height={20}
              className="mr-3"
            />
            Sign in with Google
          </Button>
        </div>

        <div className="w-full flex mt-6 justify-between items-center">
          <div className="text-gray-600">
            Already a member?{" "}
            <Link
              href="/auth/sign-up"
              className="text-green-500 hover:text-green-700 font-semibold pl-1"
            >
              Sign up
            </Link>
          </div>
          <Link
            href="/"
            className="text-green-500 hover:text-green-700 font-semibold"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
