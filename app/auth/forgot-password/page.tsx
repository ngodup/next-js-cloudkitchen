"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authService } from "@/services/authService";
import { useToastNotification } from "@/hooks/useToastNotification";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const { successToast } = useToastNotification();
  const router = useRouter();

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    try {
      const response = await authService.forgotPassword(data.email);
      successToast("Success", response);
      router.push("/auth/sign-in");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "An error occurred. Please try again later."
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-400 to-lightGreen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email to receive a password reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Send Reset Link
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          {status === "error" && (
            <Alert variant="destructive" className="w-full">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
