"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDebounceCallback } from "usehooks-ts";
import { signUpSchema } from "@/schemas/signUpSchema";
import { authService } from "@/services/authService";
import { Loader2 } from "lucide-react";
import { useToastNotification } from "@/hooks/useToastNotification";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/shared/LoadingButton";
import ErrorMessage from "@/components/shared/ErrorMessage";

export default function SignUpForm() {
  const [signUpError, setSignUpError] = useState<string>("");
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const { successToast, errorToast } = useToastNotification();

  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const debounced = useDebounceCallback(setUsername, 300);

  const checkUsernameUnique = useCallback(async () => {
    if (username) {
      setIsCheckingUsername(true);
      setUsernameMessage(""); // Reset message
      try {
        const message = await authService.checkUsernameUnique(username);
        setUsernameMessage(message);
      } catch (error) {
        setUsernameMessage(
          error instanceof Error ? error.message : "Error checking username"
        );
      } finally {
        setIsCheckingUsername(false);
      }
    }
  }, [username]);

  useEffect(() => {
    checkUsernameUnique();
  }, [username, checkUsernameUnique]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    try {
      const response = await authService.signUp(data);
      successToast("Success", response.message);
      router.replace("/auth/sign-in");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      errorToast("Error", errorMessage);
      setSignUpError(errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-lightGreen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Tamo Cloud Kitchen
          </h1>
          <p className="mb-4">
            Sign up to discover delicious, healthy food options near you.
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
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }}
                  />
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage === "Username is unique"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                      aria-live="polite"
                    >
                      {usernameMessage}
                    </p>
                  )}
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
