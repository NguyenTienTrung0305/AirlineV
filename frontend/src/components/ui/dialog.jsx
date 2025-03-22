import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

// Thành phần gốc chứa toàn bộ logic của Dialog.
const Dialog = DialogPrimitive.Root

// Nút hoặc phần tử dùng để kích hoạt (mở) Dialog.
const DialogTrigger = DialogPrimitive.Trigger

// Dùng để đưa nội dung Dialog ra ngoài cây DOM hiện tại, thường là vào <body> để tránh các vấn đề về z-index hoặc kiểu dáng
const DialogPortal = DialogPrimitive.Portal


// Lớp phủ (thường là một div mờ) che phủ nội dung phía dưới khi Dialog mở, giúp tập trung sự chú ý vào Dialog
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => {
    return (
        <DialogPrimitive.Overlay
            ref={ref}
            className={cn("fixed inset-0 bg-black/70", className)}
            {...props}
        />
    )
})
DialogOverlay.displayName = 'DialogOverlay';


const DialogContent = React.forwardRef(({ className, ...props }, ref) => {
    return (
        <DialogPrimitive.Content
            ref={ref}
            className={
                cn(
                    "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2", // căn giữa hộp thoại
                    "w-full max-w-lg gap-4 bg-white p-6 rounded-lg border-2 border-border shadow-lg",
                    "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-150",
                    "data-[state=closed]:slide-out-to-left-1/2",
                    className
                )}
            {...props}
        />
    )
})


const DialogTitle = React.forwardRef(({ className, ...props }, ref) => {
    return (
        <DialogPrimitive.Title
            ref={ref}
            className={cn("text-2xl font-bold text-teal-700 tracking-tighter", className)}
            {...props}
        />
    )
})

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => {
    return (
        <DialogPrimitive.Description
            ref={ref}
            className={cn("text-sm text-teal-600 leading-6", className)}
            {...props}
        />
    )
})

const DialogClose = React.forwardRef(({ className, ...props }, ref) => {
    return (
        <DialogPrimitive.Close
            ref={ref}
            className={cn("absolute right-4 top-4 rounded-sm ring-offset-background border-2 border-ring data-[state=open]:bg-accent", className)}
            {...props}
        >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
    )
})


export { Dialog, DialogTrigger, DialogPortal, DialogClose, DialogOverlay, DialogContent, DialogTitle, DialogDescription }