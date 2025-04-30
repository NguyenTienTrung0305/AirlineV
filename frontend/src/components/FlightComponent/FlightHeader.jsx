import Image from "next/image";
import { User } from "lucide-react";

export function FlightHeader({ departureCode, arrivalCode, departureCity, arrivalCity, departureDate, returnDate, passengers, ...props }) {
    return (
        <div {...props}>
            <div className="relative h-[300px] w-full">
                <Image
                    src="/tours_background.jpg"
                    alt="bg-airline"
                    fill
                    objectFit="cover"
                    priority
                />
                <div
                    className="absolute inset-0 flex flex-col justify-center items-center text-white"
                >
                    <h1 className="text-4xl font-bold mb-2">Explore The Worlds</h1>
                    <p className="text-zinc-200">People dont take trips, trips take people</p>
                </div>
            </div>

            <div className="sticky top-24 border-t-2 border-orange bg-white shadow-lg z-40">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-4 m-auto max-w-5xl">
                        <div className="flex items-center gap-14">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">
                                    {departureCode}
                                </span>
                                <span className="text-gray-400">⋯⋯⋯⋯⋯⋯⋯⋯➜</span>
                                <span className="font-semibold">
                                    {arrivalCode}
                                </span>
                            </div>

                            <div className="text-sm flex flex-col items-center justify-center gap-2">
                                <span>
                                    {departureCity}
                                </span>
                                <span>
                                    {arrivalCity}
                                </span>
                            </div>
                        </div>


                        <div className="flex items-center gap-14">
                            <div>
                                <div className="text-sm text-gray-600">Chuyến đi</div>
                                <div className="font-semibold">{departureDate}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600">Chuyến về</div>
                                <div className="font-semibold">{returnDate}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600">Hành khách</div>
                                <div className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    <span className="font-semibold">{passengers}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}