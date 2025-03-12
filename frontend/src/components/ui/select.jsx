import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

// Đây là phần bao bọc toàn bộ menu select
// root => trigger (icon and value on trigger) => content => group => label and item 
const Select = SelectPrimitive.Root

// Nhóm các mục liên quan lại với nhau
const SelectGroup = SelectPrimitive.Group

// Hiển thị giá trị hiện tại của menu chọn (giá trị đã được người dùng chọn) hoặc placeholder khi chưa có lựa chọn nào
const SelectValue = SelectPrimitive.Value

// Select.Trigger: Là nút hoặc phần tử mà người dùng nhấp vào để mở menu chọn
// Trong Tailwind CSS, & đại diện cho phần tử mẹ (hay còn gọi là phần tử chứa lớp này). Ví dụ: Nếu bạn áp dụng lớp này cho một <div>, thì & sẽ trỏ đến chính <div> đó
// Ký hiệu > là bộ chọn con trực tiếp trong CSS, nghĩa là chỉ áp dụng kiểu dáng cho các phần tử <span> nằm ngay dưới phần tử mẹ (không áp dụng cho các <span> lồng sâu hơn).
//Kết hợp với &, [&>span] có nghĩa là "tất cả <span> là con trực tiếp của phần tử mẹ"
// line-clamp-1: Giá trị 1 nghĩa là văn bản sẽ bị giới hạn ở 1 dòng, và phần dư sẽ bị cắt bỏ
const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
    <SelectPrimitive.Trigger
        ref={ref}
        className={
            cn([
                "flex items-center h-10 rounded-md w-full border border-input bg-background px-3 py-2 text-sm lg:justify-start justify-between",
                "ring-offset-background focus:ring-2 focus:ring-ring focus:outline-none focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                "[&>span]:truncate" // <=> overflow-hidden text-overflow:ellipsis white-space:nowrap

            ], className)}
        {...props}
    >
        {children}

        {/*SelectPrimitive.Icon =>  Hiển thị biểu tưởng bên trong trigger */}
        <SelectPrimitive.Icon >
            <ChevronDown className="h-4 w-4" />
        </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
))

// nút cuộn lên (scroll up button) xuất hiện trong danh sách tùy chọn khi nội dung vượt quá chiều cao tối đa
const SelectScrollUpButton  = React.forwardRef(({ className, ...props }, ref) => (
    <SelectPrimitive.ScrollUpButton
        ref={ref}
        className={cn("flex items-center justify-center py-1", className)}
        {...props}
    >
        <ChevronUp className="h-4 w-4" />
    </SelectPrimitive.ScrollUpButton>
))

// cuộng xuống
const SelectScrollDownButton  = React.forwardRef(({ className, ...props }, ref) => (
    <SelectPrimitive.ScrollDownButton
        ref={ref}
        className={cn("flex items-center justify-center py-1")}
        {...props}
    >
        <ChevronDown className="h-4 w-4" />
    </SelectPrimitive.ScrollDownButton>
))



// Nội dung của Trigger, chứa các group
const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => (
    <SelectPrimitive.Portal>
        <SelectPrimitive.Content
            ref={ref}
            className={
                cn(["relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-input bg-popover text-base",
                    "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                    "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", // hiệu ứng khi scroll
                    position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
                ], className)}
            position={position}
            {...props}
        >
            <SelectScrollUpButton />
            {/*
                + Đại diện cho khu vực hiển thị các mục tùy chọn trong menu chọn
                + Chứa các Select.Item (mục tùy chọn)
                + Hỗ trợ cuộn nếu nội dung vượt quá chiều cao tối đa của Select.Content
            */}
            <SelectPrimitive.Viewport
                className={cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]")}
            >
                {children}
            </SelectPrimitive.Viewport>

            <SelectScrollDownButton />
        </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
))


const SelectLabel = React.forwardRef(({ className, children, ...props }, ref) => (
    <SelectPrimitive.Label
        ref={ref}
        className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
        {...props}>
        {children}
    </SelectPrimitive.Label>
))
SelectLabel.displayName = SelectPrimitive.Label.displayName


const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => (
    <SelectPrimitive.Item
        ref={ref}
        className={cn("flex w-full py-1.5 px-8 hover:bg-gray-100 relative cursor-default outline-none hover:bg-gray rounded-md", className)}
        {...props}
    >
        {/* Indicator của item, hường là một dấu kiểm (✔), dấu chấm, hoặc bất kỳ biểu tượng nào khác để đánh dấu item được chọn */}
        <span className="absolute left-2 flex py-3 items-center justify-center h-3.5 w-3.5">
            <SelectPrimitive.ItemIndicator>
                <Check className="h-4 w-4" />
            </SelectPrimitive.ItemIndicator>
        </span>

        {/* Nội dung item */}
        <SelectPrimitive.ItemText>
            {children}
        </SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
))

const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => (
    <SelectPrimitive.Separator
        ref={ref}
        className={cn("-mx-1 my-1 h-px bg-muted", className)}
        {...props} />
))

export {
    Select,
    SelectGroup,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectLabel,
    SelectItem,
    SelectSeparator,
    SelectScrollUpButton,
    SelectScrollDownButton,
}