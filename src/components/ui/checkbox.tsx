import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded border border-neutral-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary-700 data-[state=checked]:text-neutral-50 dark:border-neutral-800 dark:focus-visible:ring-neutral-300 dark:data-[state=checked]:bg-primary-600",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
      <Check className="h-3 w-3" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

// Custom badge-like checkbox with required label
interface BadgeCheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label: string
}

const BadgeCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  BadgeCheckboxProps
>(({ className, label, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "group peer inline-flex w-fit items-center justify-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold transition-colors hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary-700 data-[state=checked]:text-white dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:data-[state=checked]:bg-primary-300 dark:data-[state=checked]:text-primary-950",
      className
    )}
    {...props}
  >
    <div className="flex items-center">
      <div className="relative mr-1.5 h-3 w-3">
        <Plus className="absolute h-3 w-3 transition-opacity group-data-[state=checked]:opacity-0" />
        <CheckboxPrimitive.Indicator>
          <Check className="absolute h-3 w-3" />
        </CheckboxPrimitive.Indicator>
      </div>
      <span>{label}</span>
    </div>
  </CheckboxPrimitive.Root>
))
BadgeCheckbox.displayName = "BadgeCheckbox"

export { Checkbox, BadgeCheckbox } 