import { Barcode, Clock, Clock1, MapPin, MapPinCheck, Plane, User } from "lucide-react";
import Image from "next/image";

export function FlightTicket({
    passengerName,
    flightCode,
    flightDate,
    departureTime,
    arrivalTime,

    departureCity,
    arrivalCity,
    seat,
}) {
    return (
        <div className="bg-gradient-to-br from-red-400 to-red-600 text-white shadow-xl rounded-lg overflow-hidden w-full max-w-md ">
            <div className="relative px-6 py-2">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <Image
                        src="/logo-1.png"
                        alt="logo"
                        className="w-36"
                        width={144}
                        height={144}
                    />
                    <h2 className="text-2xl font-bold">QAirlines</h2>
                </div>

                {/* ticket details */}
                <div className="space-y-6">
                    {/* passenger and fligtCode */}
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-zinc-100">Hành Khách</p>
                            <p className="mt-1 text-lg font-semibold flex items-center">
                                <User className="w-5 h-5 mr-2" />
                                <p className="text-sm">{passengerName}</p>
                            </p>
                        </div>

                        <div>
                            <p className="text-xs uppercase tracking-wide text-zinc-100">Chuyến bay</p>
                            <p className="text-lg font-semibold flex items-center mt-1">
                                <Plane className="w-5 h-5 mr-2" />
                                <p className="text-sm font-semibold">{flightCode}</p>
                            </p>
                        </div>
                    </div>

                    {/* Time */}
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-zinc-100">Giờ khởi hành</p>
                            <p className="mt-1 text-lg font-semibold flex items-center">
                                <Clock1 className="w-5 h-5 mr-2" />
                                <p className="text-sm">{departureTime}</p>
                            </p>
                        </div>

                        <div>
                            <p className="text-xs uppercase tracking-wide text-zinc-100">Giờ đến nơi</p>
                            <p className="text-lg font-semibold flex items-center mt-1">
                                <Clock className="w-5 h-5 mr-2" />
                                <p className="text-sm font-semibold">{arrivalTime}</p>
                            </p>
                        </div>
                    </div>

                    {/* from city - to city */}
                    <div className="flex justify-between items-center pb-6">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-zinc-100">Xuất phát từ</p>
                            <p className="mt-1 text-lg font-semibold flex items-center">
                                <MapPin className="w-5 h-5 mr-2" />
                                <p className="text-sm uppercase">{departureCity.split(' ').slice(0, departureCity.split(' ').slice().length - 2).join(' ')}</p>
                            </p>
                        </div>

                        <div>
                            <p className="text-xs uppercase tracking-wide text-zinc-100">Địa điểm đến</p>
                            <p className="text-lg font-semibold flex items-center mt-1">
                                <MapPinCheck className="w-5 h-5 mr-2" />
                                <p className="text-sm uppercase">{arrivalCity.split(' ').slice(0, arrivalCity.split(' ').slice().length - 2).join(' ')}</p>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-white text-zinc-800 p-6 flex justify-between items-center">
                <div>
                    <p className="text-xs uppercase tracking-wide text-zinc-500">Cổng</p>
                    <p className="text-2xl font-bold mt-1">6</p>
                </div>
                <div>
                    <p className="text-xs uppercase tracking-wide text-zinc-500">Chỗ Ngồi</p>
                    <p className="text-2xl font-bold mt-1">{seat}</p>
                </div>
                <Barcode className="w-24 h-24 text-zinc-800" />
            </div>
        </div>
    )
}