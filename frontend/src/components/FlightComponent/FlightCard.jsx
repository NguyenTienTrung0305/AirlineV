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

    const [selectedSeats, setSelectedSeats] = useState([]);

    const handleExpanded = (flightIndex, classType) => {
        setSelectedOptionId(null);
        if (expandedFlight === flightIndex && expandedClass === classType) {
            setExpandedFlight(null);
            setExpandedClass(null);
        } else {
            setExpandedFlight(flightIndex);
            setExpandedClass(classType);
        }
    };

    const handleSeatClick = (col, row) => {
        const seatIdentifier = `${col}-${row}`;
        setSelectedSeats((prev) => {
            if (prev.includes(seatIdentifier)) {
                // Nếu ghế đã được chọn, bỏ chọn
                return prev.filter((seat) => seat !== seatIdentifier);
            } else {
                // Nếu ghế chưa được chọn, thêm vào danh sách
                return [...prev, seatIdentifier];
            }
        });
    };

    const seatCol = [
        {
            'col': 'A',
            'rowBusiness': 4,
            'rowNormal': 10,
            'missBusiness': 0,
            'missNormal': 0,
            'soldoutSeat': [2, 3, 5, 7, 9]
        },
        {
            'col': 'B',
            'rowBusiness': 4,
            'rowNormal': 10,
            'missBusiness': 1,
            'missNormal': 0,
            'soldoutSeat': [1, 2, 5, 8, 9, 11, 12]
        },
        {
            'col': 'C',
            'rowBusiness': 4,
            'rowNormal': 10,
            'missBusiness': 0,
            'missNormal': 0,
            'soldoutSeat': [1, 2, 5, 8, 9, 11, 12]
        },
        {
            'col': '',
            'rowBusiness': 4,
            'rowNormal': 10,
            'missBusiness': 0,
            'missNormal': 0,
            'soldoutSeat': [1, 2, 5, 8, 9, 11, 12]
        },
        {
            'col': 'D',
            'rowBusiness': 4,
            'rowNormal': 10,
            'missBusiness': 0,
            'missNormal': 0,
            'soldoutSeat': [1, 2, 5, 8, 9, 11, 12]
        },
        {
            'col': 'E',
            'rowBusiness': 4,
            'rowNormal': 10,
            'missBusiness': 1,
            'missNormal': 0,
            'soldoutSeat': [1, 2, 5, 8, 9, 11, 12]
        },
        {
            'col': 'F',
            'rowBusiness': 4,
            'rowNormal': 10,
            'missBusiness': 0,
            'missNormal': 2,
            'soldoutSeat': [1, 2, 5, 8, 9, 11, 12]
        },
    ]

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
                                <div className="grid md:grid-cols-2 border-2 border-border p-6 mt-4 rounded-lg">
                                    {/* instructions */}
                                    <div className="relative flex flex-col justify-center items-center">
                                        <div className="absolute left-0 top-0 font-bold ">Chọn ghế ngồi</div>
                                        <BsFillAirplaneEnginesFill className="text-teal-700 h-[120px] w-[120px] scale-y-110 md:mt-0 mt-16" />
                                        <div className="grid grid-cols-2 items-start gap-2 my-6 p-3 w-full">
                                            {/* seat */}
                                            <div className="text-left border-r border-teal-500 grid gap-2">
                                                <div className="flex gap-2 items-center" id="business">
                                                    <Sofa className="w-7 h-7 text-orange" />
                                                    <p>Business Seats</p>
                                                </div>
                                                <div className="flex gap-2 items-center" id="window">
                                                    <Sofa className="w-7 h-7 text-blue-700" />
                                                    <p>Near Window Seats</p>
                                                </div>
                                                <div className="flex gap-2 items-center" id="normal">
                                                    <Sofa className="w-7 h-7 text-[#35AB58]" />
                                                    <p>Normal Seats</p>
                                                </div>
                                                <div className="flex gap-2 items-center" id="unselected">
                                                    <Sofa className="w-7 h-7 text-teal-700" />
                                                    <p>Unselected Seats</p>
                                                </div>
                                                <div className="flex gap-2 items-center" id="soldout">
                                                    <Sofa className="w-7 h-7 text-black" />
                                                    <p>Soldout Seats</p>
                                                </div>
                                            </div>

                                            {/* explane seat  */}
                                            <div className="grid gap-2 text-lg -mt-0.5 mx-auto">
                                                <h1 htmlFor="bisiness">1A to 4F</h1>
                                                <h1 htmlFor="window">7A to 14A and 7F to 14F</h1>
                                                <h1 htmlFor="normal">Remains Seats</h1>
                                                <h1 htmlFor="unselected">Unselected Seats</h1>
                                                <h1 htmlFor="soldout">Soldout Seats</h1>
                                            </div>
                                        </div>
                                    </div>

                                    {/* choose seats */}
                                    <div className={`relative grid grid-cols-${Math.max(1, seatCol.length)} p-2 border-2 shadow-lg rounded-lg`}>
                                        {seatCol.map((seat, index) => (
                                            <div key={index} className="flex flex-col items-center">
                                                <div className="absolute lg:w-2 w-1 bg-orange -left-2 rounded-l-[10px] top-[230px] bottom-[10px]"></div>
                                                <div className="absolute lg:w-2 w-1 bg-orange -right-2 rounded-r-[10px] top-[230px] bottom-[10px]"></div>
                                                <h1 className="min-h-[2rem]">{seat.col}</h1>
                                                <div className="flex flex-col items-center">
                                                    {/* sold out seats */}


                                                    {/* business row */}
                                                    {[...Array(seat.rowBusiness)].map((_, index_) => {
                                                        const rowNumber = index_ + 1
                                                        // miss seats
                                                        if (seat.missBusiness > 0) {
                                                            seat.missBusiness -= 1
                                                            return <div key={index_} className="w-7 h-7 min-h-[1.8rem]"></div>;
                                                        }

                                                        return seat.col !== '' ? (
                                                            seat.soldoutSeat && seat.soldoutSeat.includes(rowNumber) ? (
                                                                <Sofa
                                                                    key={index_}
                                                                    className="w-7 h-7 min-h-[1.8rem] text-black cursor-not-allowed"
                                                                />
                                                            ) : (
                                                                <Sofa
                                                                    key={index_}
                                                                    className={`w-7 h-7 min-h-[1.8rem] cursor-pointer hover:scale-125 ${selectedSeats.includes(`${seat.col}-${rowNumber}`)
                                                                        ? 'text-orange'
                                                                        : 'text-teal-700'
                                                                        }`}
                                                                    onClick={() => handleSeatClick(seat.col, rowNumber)}
                                                                />
                                                            )
                                                        ) : (
                                                            <h1 key={index_} className="h-7 min-h-[1.8rem] pt-[2px]">
                                                                {index_ + 1}
                                                            </h1>
                                                        );
                                                    })}

                                                    {/* Spacer between business row and normal row */}
                                                    <div className="w-7 h-4 min-h-[1rem]"></div>

                                                    {/* normal row */}
                                                    {[...Array(seat.rowNormal)].map((_, index_) => {
                                                        const adjustedIndex = index_ + 4;
                                                        const rowNumber = adjustedIndex + 1
                                                        if (seat.missNormal > 0) {
                                                            seat.missNormal -= 1
                                                            return <div key={index_} className="w-7 h-7 min-h-[1.8rem]"></div>;
                                                        }
                                                        return seat.col !== '' ? (
                                                            seat.soldoutSeat && seat.soldoutSeat.includes(rowNumber) ? (
                                                                <Sofa
                                                                    key={index_}
                                                                    className="w-7 h-7 min-h-[1.8rem] text-[#000000] cursor-not-allowed"
                                                                />
                                                            ) : (
                                                                <Sofa key={adjustedIndex}
                                                                    className={`w-7 h-7 min-h-[1.8rem] cursor-pointer hover:scale-125
                                                                    ${(selectedSeats.includes(`${seat.col}-${rowNumber}`) && (seat.col === 'A' || seat.col === 'F') && rowNumber >= 7)
                                                                            ? 'text-blue-700'
                                                                            : selectedSeats.includes(`${seat.col}-${rowNumber}`) ? 'text-[#35AB58]' : 'text-teal-700'}
                                                                    `}
                                                                    onClick={() => handleSeatClick(seat.col, rowNumber)
                                                                    }
                                                                />
                                                            )
                                                        ) : (
                                                            <h1 key={adjustedIndex} className="h-7 min-h-[1.8rem] pt-[2px]">
                                                                {adjustedIndex + 1}
                                                            </h1>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
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