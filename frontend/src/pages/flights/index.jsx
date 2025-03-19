'use client'
import { useRouter } from "next/router"
import { FlightHeader } from "@/components/FlightComponent/FlightHeader"
import { FlightFilter } from "@/components/FlightComponent/FlightFilter"
import { FlightSelectionNotice } from "@/components/FlightComponent/FlightSlectionNotice"
import { useState } from "react"
import { SkeletonFlightCard } from "@/components/FlightComponent/FlightSkeleton"
import flights from "@/data/flights.json"
import { FlightCard } from "@/components/FlightComponent/FlightCard"

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

    return (
        <div>
            <FlightHeader
                departureCode={fromAirport || "N/A"}
                arrivalCode={toAirport || "N/A"}
                departureCity={"Undefine"}
                arrivalCity={"Undefine"}
                departureDate={"N/A"}
                returnDate={"N/A"}
                passengers={`${passengerCount || 1} hành khách`}
            />

            <div className="flex flex-col lg:flex-row gap-4 p-4 bg-gray-100 min-h-screen max-w-7xl m-auto">
                <FlightFilter />
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
                </div>
            </div>
        </div>
    )
}