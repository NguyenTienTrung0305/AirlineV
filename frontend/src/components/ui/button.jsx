import * as React from "react"

import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"; // Tạo class linh hoạt cho button

import { Slot } from "@radix-ui/react-slot";


const ButtonVariances = cva(
    ["inline-flex items-center justify-center gap-2 rounded-md", // căn giữa theo chiều ngang
        "text-sm front-medium",
        "ring-offet-background",
        "transition-colors",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
        "disabled:pointer-events-none disabled:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0" // Nếu có icon SVG bên trong button, nó không bị ảnh hưởng bởi click và có kích thước chuẩn
    ],

    // định nghĩa các kiểu button khác nhau
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90",
                destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                orange: "bg-orange text-white hover:bg-red-900",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            }
        },
        defaults: {
            variant: "default",
            size: "default"
        }
    }
)

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => (
    <button
        ref={ref}
        className={cn(ButtonVariances({ variant, size, className }))}
        {...props}
    />
))
Button.displayName = "Button"

export { Button, ButtonVariances }