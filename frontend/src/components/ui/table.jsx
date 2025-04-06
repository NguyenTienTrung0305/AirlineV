import * as React from 'react'
import { cn } from '@/lib/utils'

const Table = React.forwardRef(({ className, ...props }, ref) => (
    <div className='relative w-full overflow-auto'>
        <table
            ref={ref}
            className={cn("w-full caption-bottom text-sm", className)}
            {...props}
        />
    </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
    <thead
        ref={ref}
        className={cn("text-center align-middle [&_tr]:border-b", className)}
        {...props}
    />
))
TableHeader.displayName = "TableHeader"

const TableRow = React.forwardRef(({ className, ...props }, ref) => (
    <tr
        ref={ref}
        className={cn(
            "border-b border-red-950 transition-colors hover:bg-slate-300 data-[state=selected]:bg-muted ",
            className
        )}
        {...props} />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef(({ className, ...props }, ref) => (
    <th
        ref={ref}
        className={cn(
            "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&:nth-child(n+2)]:border-l border-red-950",
            className
        )}
        {...props} />
))
TableHead.displayName = "TableHead"

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
    <tbody
        ref={ref}
        className={cn("[&_tr:last-child]:border-0", className)}
        {...props} />
))
TableBody.displayName = "TableBody"

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
    <td
        ref={ref}
        className={cn("p-4 text-center align-middle [&:nth-child(1)]:rounded-bl-md [&:nth-last-child(1)]:rounded-br-md [&:nth-child(n+2)]:border-l border-red-950", className)}
        {...props} />
))
TableCell.displayName = "TableCell"

export { Table, TableHeader, TableRow, TableHead, TableBody, TableCell }