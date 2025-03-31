import * as React from 'react'
import { cn } from '@/lib/utils';

const TextArea = React.forwardRef((({ className, ...props }, ref) => {
    return (
        <textarea
            ref={ref}
            className={cn("flex min-h-[80px] border-2 border-border p-2 px-3 text-base bg-background w-full rounded-lg",
                "ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className)}
            {...props}
        />
    )
}))

export { TextArea }