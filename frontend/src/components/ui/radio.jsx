import * as React from 'react';
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { cn } from '@/lib/utils';
import { Circle } from "lucide-react"

const RadioGroup = RadioGroupPrimitive.Root
const RadioGroupItem = React.forwardRef(({ className, ...props }, ref) => (
    <RadioGroupPrimitive.Item
        ref={ref}
        className={cn("aspect-square flex justify-center w-4 h-4 rounded-full border-2 border-primary", className)}
        {...props}
    >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
            <Circle className="h-2.5 w-2.5 fill-purple-600 text-orange" />
        </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
))

export { RadioGroup, RadioGroupItem } 