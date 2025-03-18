'use client'
import { useRouter } from "next/router"
import { FlightHeader } from "@/components/FlightComponent/FlightHeader"
import { FlightFilter } from "@/components/FlightComponent/FlightFilter"

export default function FlightBooking() {
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

            <div className="flex flex-col md:flex-row gap-4 p-4 bg-gray-100 min-h-screen max-w-7xl m-auto">
                <FlightFilter />
            </div>
        </div>
    )
}