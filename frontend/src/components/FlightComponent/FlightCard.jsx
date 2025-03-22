import { Card, CardContent } from "../ui/card";
import { ChevronsRight, Info, Plane, RefreshCw, Luggage, Sofa } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger, DialogOverlay, DialogPortal } from "../ui/dialog";
import { useState } from "react";
import { BsFillAirplaneEnginesFill } from "react-icons/bs";
export function FlightCard({ flights }) {
    const [expandedFlight, setExpandedFlight] = useState(null);
    const [expandedClass, setExpandedClass] = useState(null);
    const [selectedOptionId, setSelectedOptionId] = useState(null);

    const handleExpanded = (flightIndex, classType) => {
        if (expandedFlight === flightIndex && expandedClass === classType) {
            setExpandedFlight(null);
            setExpandedClass(null);
            setSelectedOptionId(null);
        } else {
            setExpandedFlight(flightIndex);
            setExpandedClass(classType);
        }
    };

    return (
        <div className="flex-1 space-y-4">
            {flights.map((flight, index) => (
                <Card key={index} className="border-2 border-border rounded-lg">
                    <CardContent className="p-4">

                        {/* Dialog, info, button */}
                        <div className="flex flex-col">

                            {/* Thông tin cơ bản và button */}
                            <div className="flex justify-between items-center">

                                {/* Các thông tin cơ bản */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex flex-col items-center">
                                            <span className="text-2xl font-bold">{flight.departureTime}</span>
                                            <span className="text-sm text-gray-500">{flight.departureCode}</span>
                                        </div>
                                        <div className="flex-1 relative">
                                            <ChevronsRight className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                                            <div className="border-t border-gray absolute w-full top-4"></div>
                                        </div>
                                        <div className="flex flex-col items-center mr-10">
                                            <span className="text-2xl font-bold">{flight.arrivalTime}</span>
                                            <span className="text-sm text-gray-500">{flight.arrivalCode}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row text-md text-left">
                                        <span>• Thời gian bay dự kiến: {flight.duration}</span>
                                        <span className="md:mx-auto mx-0 ">• Số hiệu: {flight.flightNumber}</span>
                                    </div>

                                </div>

                                {/* Button phổ thông, thương gia */}
                                <div className="flex flex-col gap-y-2 text-right w-44">
                                    <Button className={"flex-1 w-full relative p-3 bg-teal-700 text-white hover:bg-teal-800"}
                                        onClick={() => handleExpanded(index, "economy")}
                                    >
                                        <div>
                                            <div className="font-semibold">Phổ thông</div>
                                            <div>{flight.economyPrice.toLocaleString()} VND</div>
                                        </div>
                                        <span className="absolute -top-2 -right-2 bg-orange text-white text-xs px-1.5 py-0.5 rounded-full">
                                            Còn {flight.numberSeatLeft} ghế
                                        </span>
                                    </Button>
                                    <Button className="flex flex-col p-3 bg-yellow-300 hover:bg-yellow-600"
                                        onClick={() => handleExpanded(index, "business")}
                                    >
                                        <div>
                                            <div className="font-semibold">Thương gia</div>
                                            <div>{flight.businessPrice.toLocaleString()} VND</div>
                                        </div>
                                    </Button>
                                </div>
                            </div>

                            {/* dialog */}
                            <Dialog>
                                <DialogTrigger asChild>
                                    <button className="relative flex items-center text-sm text-blue-600 hover:underline gap-1 w-auto focus:outline-none">
                                        Chi tiết hành trình
                                        <Info className="absolute left-[95px] top-[3px] h-4 w-4" />
                                    </button>
                                </DialogTrigger>
                                <DialogPortal>
                                    <DialogOverlay />
                                    <DialogContent className="">
                                        <DialogTitle>Chi tiết hành trình</DialogTitle>
                                        <DialogDescription>
                                            Đây là thông tin chi tiết về hành trình của bạn.
                                        </DialogDescription>


                                        {/* content */}
                                        <div className="flex flex-col gap-y-6 mt-6">

                                            {/* departure and arrival */}
                                            <div className="flex items-center justify-between bg-gray-100 rounded-lg p-4">
                                                <div className="flex flex-col items-center">
                                                    <div className="text-3xl font-bold text-teal-700">{flight.departureTime}</div>
                                                    <div className="text-lg font-semibold">{flight.departureCode}</div>
                                                    <div className="text-sm text-gray-600">{flight.departureAirport}</div>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <Plane className="text-orange-500 mb-2" />
                                                    <div className="text-sm font-medium">{flight.duration}</div>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <div className="text-3xl font-bold text-teal-700">{flight.arrivalTime}</div>
                                                    <div className="text-lg font-semibold">{flight.arrivalCode}</div>
                                                    <div className="text-sm text-gray-600">{flight.arrivalAirport}</div>
                                                </div>
                                            </div>

                                            {/* info */}
                                            <div className="grid gap-y-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-gray-700">Khởi hành:</span>
                                                    <span>{flight.departureDate}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-gray-700">Số hiệu chuyến bay:</span>
                                                    <span>{flight.flightNumber}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-gray-700">Hãng hàng không:</span>
                                                    <span>{flight.airline}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-gray-700">Loại máy bay:</span>
                                                    <span>{flight.aircraft}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <DialogClose />
                                    </DialogContent>
                                </DialogPortal>
                            </Dialog>


                            {/* Xử lý sự kiện khi nhấn nút price */}
                            {expandedFlight === index && ["economy", "business"].includes(expandedClass) && (
                                <div className="mt-4 border-t border-teal-400">
                                    <h3 className="font-semibold my-4">Chọn giá vé</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {(expandedClass === "economy" ? flight.economyOptions : flight.businessOptions).map((option, optionIndex) => (
                                            <div key={optionIndex}
                                                className={`border border-teal-500 rounded-lg p-4 relative cursor-pointer transition-all 
                                                    ${selectedOptionId === option.id
                                                        ? "ring-2 ring-teal-500 bg-teal-50"
                                                        : "border-teal-500"
                                                    }`}
                                                onClick={() => setSelectedOptionId(option.id)}
                                            >
                                                <div className="text-lg font-semibold mb-2">{option.name}</div>
                                                <div className="text-xl font-bold text-teal-700 mb-4">
                                                    {option.price.toLocaleString()} VND
                                                </div>
                                                <div className="space-y-3 text-sm">
                                                    <div className="flex items-start gap-2">
                                                        <RefreshCw className="h-4 w-4 mt-1" />
                                                        <div>
                                                            <div className="font-medium">Thay đổi vé</div>
                                                            <div className="text-gray-600">
                                                                Phí đổi vé tối đa {option.changeFee.toLocaleString()} VND mỗi hành khách
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <RefreshCw className="h-4 w-4 mt-1" />
                                                        <div>
                                                            <div className="font-medium">Hoàn vé</div>
                                                            <div className="text-gray-600">
                                                                Phí hoàn vé tối đa {option.refundFee.toLocaleString()} VND mỗi hành khách
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <Luggage className="h-4 w-4 mt-1" />
                                                        <div>
                                                            <div className="font-medium">Hành lý ký gửi</div>
                                                            <div className="text-gray-600">{option.checkedBaggage}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <Luggage className="h-4 w-4 mt-1" />
                                                        <div>
                                                            <div className="font-medium">Hành lý xách tay</div>
                                                            <div className="text-gray-600">{option.carryOn}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}


                            {/* xử lý sự kiện chọn vé */}
                            {selectedOptionId && expandedFlight === index && (
                                <div className="grid md:grid-cols-2 border-2 border-border p-6 mt-4">
                                    {/* instructions */}
                                    <div className="relative flex flex-col justify-center items-center border-r border-black">
                                        <BsFillAirplaneEnginesFill className="text-teal-700 h-[120px] w-[120px] scale-y-110" />
                                        <div className="grid grid-cols-2 items-start gap-2 my-6 p-3 border w-full">
                                            {/* seat */}
                                            <div className="text-left">
                                                <div className="flex gap-2 items-center">
                                                    <Sofa className="w-7 h-7 text-orange" />
                                                    <p>Business Seats</p>
                                                </div>
                                                <div className="flex gap-2 items-center">
                                                    <Sofa className="w-7 h-7 text-blue-300" />
                                                    <p>Near Window Seats</p>
                                                </div>
                                                <div className="flex gap-2 items-center">
                                                    <Sofa className="w-7 h-7 " />
                                                    <p>Normal Seats</p>
                                                </div>
                                                <div className="flex gap-2 items-center">
                                                    <Sofa className="w-7 h-7 text-teal-700" />
                                                    <p>Unselected Seats</p>
                                                </div>
                                            </div>

                                            {/* explane seat  */}
                                            <div>
                                                <h1>abc</h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))
            }
        </div >
    )
}