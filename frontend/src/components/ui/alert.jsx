import * as React from 'react'
import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'

const alertVariants = cva(
    [
        "relative w-full rounded-lg border p-4",
        "[&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground"
    ],
    {
        variants: {
            variant: {
                default: "bg-background text-foreground",
                destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
            }
        },
        defaults: {
            variant: "default",
        }
    }
)

const Alert = React.forwardRef(({ variant, className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(alertVariants({ variant }), className)}
        {...props}
    />
))


const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
    <div 
        ref={ref}
        className={cn("text-sm [&_p]:leading-relaxed", className)}
        {...props}
    />
))

export { Alert, AlertDescription }

