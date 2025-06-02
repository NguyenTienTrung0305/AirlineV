import { Plane, Calendar, Clock, Users, CreditCard, FlameKindling, Droplet, Scissors, FlaskConical, ZapOff, Radiation } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SkeletonFlightCard } from '../FlightComponent/FlightSkeleton'

const prohibitedItems = [
    { icon: FlameKindling, label: "Vật dễ cháy" },
    { icon: Droplet, label: "Chất lỏng" },
    { icon: Scissors, label: "Vật sắc nhọn" },
    { icon: FlaskConical, label: "Hóa chất" },
    { icon: ZapOff, label: "Chất nổ" },
    { icon: Radiation, label: "Vật liệu phóng xạ" },
]

const FlightDetailCard = ({ title, flightDetails, passengerCount }) => {
    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 sm:mb-0 text-blue-400">{title}</h2>
                <span className="text-sm text-zinc-400">{flightDetails.flightCode}</span>
            </div>

            {/* Departure and Arrival Time */}
            <div className="container max-w-3xl mx-auto mt-4 mb-10">
                <div className="flex items-stretch space-x-4 mb-4 sm:mb-0">
                    <div className="flex flex-col items-center text-center">
                        <span className="text-2xl sm:text-3xl font-bold text-gray-800">{flightDetails.departureTime}</span>
                        <span className="text-base sm:text-lg font-medium text-gray-600">{flightDetails.departureCity}</span>
                    </div>
                    <div className="flex-1 relative px-8">
                        <Plane className="text-orange absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rotate-45" />
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <span className="text-2xl sm:text-3xl font-bold text-gray-800">{flightDetails.arrivalTime}</span>
                        <span className="text-base sm:text-lg font-medium text-gray-600">{flightDetails.arrivalCity}</span>
                    </div>
                </div>
            </div>

            {/* Date */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-8 ml-6">
                {/* departure date */}
                <div className="flex items-center space-x-3 ">
                    <Calendar className="text-orange flex-shrink-0" />
                    <div>
                        <div className="text-sm text-gray-500">Ngày khởi hành</div>
                        <div className="font-medium">{flightDetails.flightDate}</div>
                    </div>
                </div>

                {/* flight duration */}
                <div className="flex items-center space-x-3">
                    <Clock className="text-orange flex-shrink-0" />
                    <div>
                        <div className="text-sm text-gray-500">Thời gian bay</div>
                        <div className="font-medium">{flightDetails.duration}</div>
                    </div>
                </div>

                {/* passenger */}
                <div className="flex items-center space-x-3">
                    <Users className="text-orange flex-shrink-0" />
                    <div>
                        <div className="text-sm text-gray-500">Hành khách</div>
                        <div className="font-medium">{passengerCount}</div>
                    </div>
                </div>

                {/* payment */}
                <div className="flex items-center space-x-3">
                    <CreditCard className="text-orange flex-shrink-0" />
                    <div>
                        <div className="text-sm text-gray-500">Phương thức thanh toán</div>
                        <div className="font-medium">Thẻ tín dụng</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default function FlightDetailStep({ flightDetails, passengerCount }) {
    if (!flightDetails) {
        return (
            <SkeletonFlightCard />
        )
    }
    return (
        <div className="min-h-screen bg-zinc-400">
            <div className="max-w-4xl mx-auto p-4 sm:p-6 m-4 relative z-10">
                {/* Chi tiết chuyến đi */}
                <Card className="shadow-lg border-orange mb-8">
                    <CardContent className="p-4 sm:p-6">
                        <FlightDetailCard
                            title="Chi tiết chuyến đi"
                            flightDetails={flightDetails}
                            passengerCount={passengerCount}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}