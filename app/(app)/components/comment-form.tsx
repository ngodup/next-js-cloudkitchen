"use client";

import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface CommentFormProps {
  existingComment?: string;
  onSubmit: (data: { comment: string }) => void;
  submitLabel?: string;
  placeholder?: string;
  className?: string;
  isUserLoggedIn: boolean;
}

export default function CommentForm({
  existingComment = "",
  onSubmit,
  submitLabel = "Submit Comment",
  placeholder = "Add your comment...",
  isUserLoggedIn,
  className,
}: CommentFormProps) {
  const { toast } = useToast();
  const form = useForm({
    defaultValues: { comment: existingComment },
  });

  // Form submission handler
  const handleFormSubmit = (data: { comment: string }) => {
    if (!isUserLoggedIn) {
      toast({
        variant: "destructive",
        description: "Please login to add a comment",
      });
      return;
    }
    onSubmit(data);
    form.reset(); // Reset the form after successful submission
  };

  return (
    <div className={cn("mt-4 w-full", className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <FormField
            control={form.control}
            name="comment"
            rules={{
              required: "Comment is required",
              minLength: {
                value: 5,
                message: "Comment must be at least 5 characters long",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comment</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={placeholder}
                    className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-primary mt-4 text-primary-foreground px-2 py-2 rounded-md text-sm"
            >
              {submitLabel}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
