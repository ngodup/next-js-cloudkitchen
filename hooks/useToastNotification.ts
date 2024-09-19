import { useToast } from "@/components/ui/use-toast";

export function useToastNotification() {
  const { toast } = useToast();

  const showToast = (
    variant: "default" | "destructive",
    title: string,
    description: string
  ) => {
    toast({
      variant,
      title,
      description,
      className:
        variant === "destructive"
          ? "bg-destructive text-destructive-foreground"
          : "bg-primary text-primary-foreground",
    });
  };

  return {
    successToast: (title: string, description: string) =>
      showToast("default", title, description),
    errorToast: (title: string, description: string) =>
      showToast("destructive", title, description),
    infoToast: (title: string, description: string) =>
      showToast("default", title, description),
  };
}
