import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

// track container chứa range
// range (phạm vi chỉ nằm trong track)
// thumb (nút kéo range)
const Slider = React.forwardRef(({ className, ...props }, ref) => (
    <SliderPrimitive.Root
        ref={ref}
        className={cn("relative flex w-full touch-none select-none items-center", className)}
        {...props}>
        <SliderPrimitive.Track
            className="relative h-2 w-full grow overflow-hidden rounded-full bg-orange">
            <SliderPrimitive.Range className="absolute h-full bg-stone-400" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
            className="block h-5 w-5 rounded-full border-2 border-primary bg-background"
        />
    </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }