import * as React from "react"

import { cn } from "@/lib/utils" 

// Mục đích của forwardRef => Cho phép truyền ref từ component cha xuống component con.
// React.forwardRef() giúp component Card nhận một ref (tham chiếu) từ component cha
// ref={ref} gán ref vào phần tử <div>, giúp component cha có thể tham chiếu trực tiếp đến Card
// { className, ...props } dùng destructuring để lấy className và các props khác, className có thể là undefined, "p-4" hoặc "bg-red-500" tùy thuộc vào nơi sử dụng
// Gộp class bằng cn()
// "rounded-lg border bg-card text-card-foreground shadow-sm" → Class mặc định.
// className → Class bổ sung từ props (nếu có).
// cn() giúp kết hợp class mà không tạo class trùng hoặc lỗi CSS
// 4️⃣ Gán thêm ...props cho <div>
// {...props} giúp Card nhận tất cả props khác mà component cha truyền vào.
// Ví dụ: onClick, data-id, aria-label, v.v.
// displayName giúp React Developer Tools hiển thị tên Card thay vì "Anonymous" khi debug.
// vd
{/* <Card className="p-6 bg-blue-500">
  Nội dung thẻ Card
</Card> */}
// 📌 Kết quả class của <div> sau khi cn() xử lý
// <div class="rounded-lg border bg-blue-500 text-card-foreground shadow-sm p-6">
//   Nội dung thẻ Card
// </div>
const Card = React.forwardRef(({ clasName, ...probs }, ref) => (
    <div
        ref={ref}
        clasName={cn("rounded-lg border bg-card text-card-foreground shadow-sm", clasName)}
        {...probs}
    />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props} />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props} />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props} />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }