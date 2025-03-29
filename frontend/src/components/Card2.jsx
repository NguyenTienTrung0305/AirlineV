import React from "react";
import Link from "next/link";
import { MdArrowRight, MdPerson } from "react-icons/md";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { cn } from "@/lib/utils";
import { CalendarIcon } from 'lucide-react';
import Image from 'next/image';

// const HomeCard2 = React.forwardRef(({ className, ...props, slug, image, title, date, author, comments, description }, ref => {
//     return (
//         <Card
//             ref={ref}
//             className={cn("overflow-hidden", className)}
//             {...props}
//         >

//         </Card>
//     )
// }))

const FeaturedCard2 = React.forwardRef((({ slug, image, title, description, date, buttonText, className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("relative h-[400px] md:h-[500px] overflow-hidden rounded-lg shadow-lg", className)}
        {...props}
    >
        <Link
            href={`/news/${slug}`}
        >
            <Image
                src={image}
                alt={title}
                layout="fill"
                objectFit="cover"
                className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 to-transparent pointer-events-none"></div>
        </Link>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white ">
            <h3 className="text-2xl md:text-4xl font-bold mb-2 leading-tight">
                {title}
            </h3>
            <p className="text-lg mb-4 line-clamp-2 md:line-clamp-3 ">
                {description}
            </p>
            <div className="flex md:flex-row flex-col md:items-center justify-between items-start md:gap-0 gap-3 pb-4">
                <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-5 w-5" />
                    <span className="text-sm">{date}</span>
                </div>
                <Button asChild variant="orange" className="p-2 text-lg w-[120px]">
                    <Link href={`/news/${slug}`}>
                        {buttonText}
                    </Link>
                </Button>
            </div>
        </div>
    </div>
)))


const Card2 = React.forwardRef(({ slug, image, title, description, content, buttonText, className, ...props }, ref) => (
    <Card ref={ref} className={cn("border-2 border-border rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 ease-linear",className)} {...props}>
        <Link href={`/news/${slug}`}>
            {image && (
                <Image
                    src={image}
                    alt={title}
                    width={500}
                    height={192}
                    className="w-full h-48 object-cover rounded-t-lg"
                />
            )}
            <CardHeader>
                <CardTitle className="text-xl font-semibold">{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
        </Link>
        {content && (
            <CardContent>
                <p className="text-gray-600 dark:text-gray-300 line-clamp-3">{content}</p>
            </CardContent>
        )}
        <CardFooter>
            <Button asChild variant="orange" className="p-2">
                <Link href={`/news/${slug}`}>
                    {buttonText}
                </Link>
            </Button>
        </CardFooter>
    </Card>
)
);
Card2.displayName = "Card2";
export { FeaturedCard2, Card2 };