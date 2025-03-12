import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => (
    <input
        ref={ref}
        type={type}
        className={cn(["flex rounded-sm h-10 w-full border border-red-950 bg-background text-base px-3 py-2",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 ring-offset-background focus-visible:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50"],
            className)}
        {...props}
    />
))
Input.displayName = "Input"

export { Input }