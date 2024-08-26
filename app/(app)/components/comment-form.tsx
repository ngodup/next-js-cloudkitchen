"use client";

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
import { cn } from "@/lib/utils";

interface CommentFormProps {
  existingComment?: string;
  onSubmit: (data: { comment: string }) => void;
  submitLabel?: string;
  placeholder?: string;
  className?: string;
}

export default function CommentForm({
  existingComment = "",
  onSubmit,
  submitLabel = "Submit Comment",
  placeholder = "Add your comment...",
  className,
}: CommentFormProps) {
  // Use React Hook Form
  const formMethods = useForm({
    defaultValues: { comment: existingComment },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = formMethods;

  // Form submission handler
  const handleFormSubmit = (data: { comment: string }) => {
    onSubmit(data);
  };

  return (
    <div className={cn("mt-4 w-full", className)}>
      <Form {...formMethods}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <FormField
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comment</FormLabel>
                <FormControl>
                  <Textarea
                    {...register("comment", {
                      required: "Comment is required",
                      minLength: {
                        value: 5,
                        message: "Comment must be at least 5 characters long",
                      },
                    })}
                    placeholder={placeholder}
                    className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500"
                    rows={4}
                    {...field} // Connects the form field to React Hook Form
                  />
                </FormControl>
                {errors.comment && (
                  <FormMessage>{errors.comment.message}</FormMessage>
                )}
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
