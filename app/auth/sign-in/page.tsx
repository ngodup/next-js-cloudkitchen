"use client";

import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

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
import { handleCredentialSignin } from "@/actions/authActions";
import ErrorMessage from "@/components/error-message";

export default function SignInForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [signInError, setSignInError] = useState<string>("");

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

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
    } else {
      router.replace("/");
    }
  }

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      const result = await handleCredentialSignin(data);
      if (result?.message) {
        setSignInError(result.message);
      }
    } catch (error) {
      setSignInError("Error occurs while signing in");
    }
  };

  // if (status === "loading") {
  //   return <div>Loading...</div>;
  // }
  return (
    <div className="flex justify-center items-center min-h-screen bg-lightGreen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Tamo cloud kitchen
          </h1>
          <p className="mb-4">
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
            <LoadingButton pending={form.formState.isSubmitting} />
          </form>
          {signInError && <ErrorMessage error={signInError} />}
        </Form>

        <span className="text-sm text-gray-500 text-center block my-2">or</span>

        <div className="google-auth-container">
          <Button variant="outline" className="w-full" onClick={onGoogleAuth}>
            <Image
              src="/assets/images/google-logo.svg"
              alt="Google icon"
              width={40}
              height={40}
              className="pr-4"
            />
            Sign in with Google account
          </Button>
          {signInError && <div>{signInError}</div>}
        </div>

        <div className="text-center mt-4">
          Already a member?{" "}
          <Link
            href="/sign-in"
            className="text-gray-600 hover:text-gray-800 pl-2"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
