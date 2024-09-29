import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Rating from "../products/Rating";

interface CommentEditFormProps {
  initialContent: string;
  initialRating: number | null;
  onSubmit: (content: string, rating: number | null) => void;
  onCancel: () => void;
}

const CommentEditForm: React.FC<CommentEditFormProps> = ({
  initialContent,
  initialRating,
  onSubmit,
  onCancel,
}) => {
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: { content: initialContent, rating: initialRating },
  });

  const handleFormSubmit = (data: {
    content: string;
    rating: number | null;
  }) => {
    onSubmit(data.content, data.rating);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-2">
      <Textarea
        {...register("content", { required: true })}
        className="w-full mb-2"
      />
      <Rating
        value={initialRating || 0}
        onRatingChange={(newRating: number) => setValue("rating", newRating)}
      />
      <div className="mt-2 space-x-2">
        <Button type="submit" variant="outline" size="sm">
          Update
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default CommentEditForm;
