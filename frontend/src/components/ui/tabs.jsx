import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

// Tabs là container chứa tất cả các phần tử
const Tabs = TabsPrimitive.Root

// Tabslist là container chứa các TabTrigger
const TabsList = React.forwardRef(({ className, ...props }, ref) => (
    <TabsPrimitive.List
        ref={ref}
        className={cn("inline-flex h-10 items-center", className)}
        {...props}
    />
))
TabsList.displayName = TabsPrimitive.List.displayName

// TabTrigger là nút bấm để chọn tab trong Tabslist
const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
        ref={ref}
        className={cn(["items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all",
            "ring-offset-background transition-all data-[state=active]:outline-none data-[state=active]:ring-2 data-[state=active]:ring-ring data-[state=active]:ring-offset-2"],
            className
        )}
        {...props}
    />
))

// TabContent là nội dung của TagTrigger
const TabsContent = React.forwardRef(({ className, ...probs }, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        className={cn("mt-4 w-full", className)}
        {...probs}
    />
))

export { Tabs, TabsList, TabsTrigger, TabsContent }