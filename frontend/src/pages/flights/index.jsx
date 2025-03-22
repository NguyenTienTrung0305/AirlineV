'use client'
import { useRouter } from "next/router"
import { FlightHeader } from "@/components/FlightComponent/FlightHeader"
import { FlightFilter } from "@/components/FlightComponent/FlightFilter"
import { FlightSelectionNotice } from "@/components/FlightComponent/FlightSlectionNotice"
import { useState, useEffect } from "react"
import { SkeletonFlightCard } from "@/components/FlightComponent/FlightSkeleton"
import flights from "@/data/flights.json"
import { FlightCard } from "@/components/FlightComponent/FlightCard"
import AOS from "aos";
import "aos/dist/aos.css";

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

    useEffect(() => {
        AOS.init({
            duration: 1500,
            once: true
        });
    }, []);

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
                data-aos="fade-up"
            />

            <div className="flex flex-col lg:flex-row gap-4 p-4 bg-gray-100 min-h-screen max-w-7xl m-auto" data-aos="fade-up-left">
                <FlightFilter data-aos="fade-down"/>
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