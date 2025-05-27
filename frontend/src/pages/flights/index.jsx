'use client'
import { useRouter } from "next/router"
import { FlightHeader } from "@/components/FlightComponent/FlightHeader"
import { FlightFilter } from "@/components/FlightComponent/FlightFilter"
import { FlightSelectionNotice } from "@/components/FlightComponent/FlightSlectionNotice"
import { useState, useEffect } from "react"
import { SkeletonFlightCard } from "@/components/FlightComponent/FlightSkeleton"

// import flights from "@/data/flights.json"

import { FlightCard } from "@/components/FlightComponent/FlightCard"
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import { Button } from "@/components/ui/button"

import { formatDate, useFlightData } from '@/hooks/useFlightData'
import axios from "@/util/axiosCustom.js"


export default function FlightBooking() {
    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter()
    const {
        fromAirport,
        toAirport,

        departureDate,
        returnDate,

        tripType,
        passengerCount,
    } = router.query

    const {
        flights
    } = useFlightData(fromAirport, toAirport, departureDate)

    console.log(flights)

    useEffect(() => {
        AOS.init({
            duration: 1500,
            once: true
        })
    }, [])

    return (
        <div>
            <FlightHeader
                departureCode={fromAirport?.split(" ")[0] || "N/A"}
                arrivalCode={toAirport?.split(" ")[0] || "N/A"}

                departureCity={(() => {
                    const parts = fromAirport?.split(" ")
                    return parts && parts.length >= 2
                        ? parts.slice(1).join(" ")
                        : "Undefine"
                })()}
                arrivalCity={(() => {
                    const parts = toAirport?.split(" ")
                    return parts && parts.length >= 2
                        ? parts.slice(1).join(" ")
                        : "Undefine"
                })()}

                departureDate={formatDate(new Date(departureDate)) || "N/A"}
                returnDate={formatDate(new Date(returnDate)) || "N/A"}

                passengers={`${passengerCount || 1} hành khách`}
                data-aos="fade-up"
            />

            <div className="flex flex-col lg:flex-row gap-4 p-4 bg-gray-100 min-h-screen max-w-7xl m-auto" data-aos="fade-up-left">
                <FlightFilter data-aos="fade-down" />
                <div className="flex-1 gap-y-4">
                    {!isLoading && (
                        <FlightSelectionNotice />
                    )}
                    {isLoading ? (
                        <>
                            <SkeletonFlightCard />
                            <SkeletonFlightCard />
                            <SkeletonFlightCard />
                            <SkeletonFlightCard />
                            <SkeletonFlightCard />
                            <SkeletonFlightCard />
                        </>
                    ) : (
                        <FlightCard
                            flights={flights}
                        />
                    )}

                    <Link href="/" className="w-full">
                        <Button variant="default" className="p-3 bg-orange w-full mt-4">
                            Quay lại trang chủ
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}