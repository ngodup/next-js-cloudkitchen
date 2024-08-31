import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LoadingButtonProps {
  pending: boolean;
  label: string;
  className?: string;
}
export default function LoadingButton({
  pending,
  label,
  className,
}: LoadingButtonProps) {
  return (
    <Button
      className={cn(
        "w-full py-2 rounded-lg shadow-lg transition duration-200 ease-in-out font-semibold text-white",
        {
          "bg-gray-400 cursor-not-allowed": pending,
          "bg-green-500 hover:bg-green-600": !pending,
        },
        className // Add any custom className passed as a prop
      )}
      type="submit"
      disabled={pending}
    >
      {pending ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5 text-white mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="7"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          Loading...
        </div>
      ) : (
        <p>{label}</p>
      )}
    </Button>
  );
}
