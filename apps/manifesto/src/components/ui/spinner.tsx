import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "size-4",
  default: "size-5",
  lg: "size-6",
  xl: "size-8",
} as const;

function Spinner({
  className,
  size = "default",
  ...props
}: Omit<React.ComponentProps<typeof ArrowPathIcon>, "size"> & {
  size?: keyof typeof sizeClasses;
}) {
  return (
    <ArrowPathIcon
      aria-label="Loading"
      className={cn("animate-spin", sizeClasses[size], className)}
      role="status"
      {...props}
    />
  );
}

export { Spinner };
