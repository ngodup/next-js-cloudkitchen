import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";

const editCommentSchema = z.object({
  content: z.string().min(1, "Comment content is required"),
  rating: z.number().min(1).max(5).nullable(),
});

type EditCommentFormData = z.infer<typeof editCommentSchema>;

interface EditCommentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (content: string, rating: number | null) => void;
  initialContent: string;
  initialRating: number | null | undefined;
}

const EditCommentDialog: React.FC<EditCommentDialogProps> = ({
  isOpen,
  onClose,
  onEdit,
  initialContent,
  initialRating,
}) => {
  const form = useForm<EditCommentFormData>({
    resolver: zodResolver(editCommentSchema),
    defaultValues: {
      content: initialContent,
      rating: initialRating,
    },
  });

  const onSubmit = (data: EditCommentFormData) => {
    onEdit(data.content, data.rating);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Comment</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment Content</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : null
                        )
                      }
                      className="w-full p-2 border rounded"
                      value={field.value ?? ""}
                    >
                      <option value="">No rating</option>
                      {[1, 2, 3, 4, 5].map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Update Comment</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCommentDialog;
