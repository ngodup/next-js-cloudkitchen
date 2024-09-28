import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { ICommentUser } from "./CommentsTable";

const editCommentSchema = z.object({
  content: z.string().min(1, "Comment content is required"),
  rating: z.number().min(1).max(5).optional(),
});

type EditCommentFormData = z.infer<typeof editCommentSchema>;

interface EditCommentModalProps {
  comment: ICommentUser;
  onClose: () => void;
  onEdit: (
    commentId: string,
    updatedData: Partial<EditCommentFormData>
  ) => void;
}

const EditCommentModal: React.FC<EditCommentModalProps> = ({
  comment,
  onClose,
  onEdit,
}) => {
  const form = useForm<EditCommentFormData>({
    resolver: zodResolver(editCommentSchema),
    defaultValues: {
      content: comment.content,
      rating: comment.rating || undefined,
    },
  });

  const onSubmit = (data: EditCommentFormData) => {
    const updatedData: Partial<EditCommentFormData> = { content: data.content };
    if (data.rating !== undefined) {
      updatedData.rating = data.rating;
    }
    onEdit(comment._id!, updatedData);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
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
                  <FormLabel>Rating (Optional)</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          value === "" ? undefined : parseInt(value)
                        );
                      }}
                      className="w-full p-2 border rounded"
                      value={field.value || ""}
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

            <Button type="submit">Update Comment</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCommentModal;
