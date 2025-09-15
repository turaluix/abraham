import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-neutral-300",
  {
    variants: {
      variant: {
        default:
          "bg-primary-700 text-white hover:bg-primary-800 dark:bg-primary-300 dark:text-primary-950 dark:hover:bg-primary-400",
        destructive:
          "bg-red-500 text-neutral-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/90",
        outline:
          "border border-gray-300 bg-white hover:bg-gray-50 dark:border-white/20 dark:bg-transparent dark:hover:bg-white/10 dark:hover:text-gray-100",
        secondary:
          "bg-primary-100 text-primary-900 hover:bg-primary-100/80 dark:bg-primary-950 dark:text-primary-50 dark:hover:bg-primary-800/80",
        ghost:
          "hover:bg-primary-100 hover:text-primary-900 dark:hover:bg-primary-950 dark:hover:text-primary-50",
        link: "text-primary-600 underline-offset-4 hover:underline dark:text-primary-400",
        "link@button": "text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants }; 