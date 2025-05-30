import { Card, CardContent } from "../ui/card";
import { ChevronsRight, Info, Plane, RefreshCw, Luggage, Sofa, HandPlatter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger, DialogOverlay, DialogPortal } from "../ui/dialog";
import { useState } from "react";
import { BsFillAirplaneEnginesFill } from "react-icons/bs";
import { useRouter } from "next/router";
import { formatFlightDuration, formatTime, formatDate } from "@/hooks/useFlightData";
import axios from "@/util/axiosCustom";



export function FlightCard({ flights }) {
    const [expandedFlight, setExpandedFlight] = useState(null)
    const [expandedClass, setExpandedClass] = useState(null)
    const [selectedOptionId, setSelectedOptionId] = useState(null)

    const [selectedSeats, setSelectedSeats] = useState([])

    const [loadingSeats, setLoadingSeats] = useState({})

    const handleExpanded = (flightId, classType) => {
        setSelectedOptionId(null);
        if (expandedFlight === flightId && expandedClass === classType) {
            setExpandedFlight(null);
            setExpandedClass(null);
        } else {
            setExpandedFlight(flightId);
            setExpandedClass(classType);
        }
    };

    const handleSeatClick = async (flightId, col, row) => {
        const seatIdentifier = `${col}${row}`
        const flight = flights.find((f) => f.flightId === flightId)
        const seat = flight.seats.find(
            (s) =>
                s.seatCode === seatIdentifier &&
                (expandedClass === "Economy" ? s.typeCode.startsWith("E") : s.typeCode.startsWith("B")) // Nếu là hạng economy thì chỉ tìm ghế bắt đầu bằng "E"
        )
        // if ((!seat || !seat.isAvailable || seat.isLocked || seat.soldTo) && seat.soldTo !== "user123") {
        //     return // Ghế không khả dụng, bị khóa, hoặc đã bán
        // }


        console.log(seat)

        if (selectedSeats.includes(seatIdentifier)) {
            // Bỏ chọn ghế và mở khóa ghế
            setLoadingSeats((prev) => ({ ...prev, [seatIdentifier]: true })) // hiển thị trạng thái loading
            try {
                const response = await axios.post('/api/flights/unlock-seat', {
                    flightId,
                    seatCode: seatIdentifier,
                    userId: "user123"
                })

                if (response.status === 200) {
                    setSelectedSeats((prev) => prev.filter((seat) => seat !== seatIdentifier))
                }
            } catch (error) {
                console.log("Lỗi khi mở khóa ghế", error)
            } finally {
                setLoadingSeats((prev) => ({ ...prev, [seatIdentifier]: false }))
            }
            return;
        } else {
            // Khóa ghế nếu chưa được chọn
            setLoadingSeats((prev) => ({ ...prev, [seatIdentifier]: true }))
            try {
                const response = await axios.post("/api/flights/lock-seat", {
                    flightId,
                    seatCode: seatIdentifier,
                    userId: "user123",
                    durationMs: 10 * 60 * 1000,
                })

                if (response.status === 200) {
                    setSelectedSeats((prev) => {
                        setSelectedSeats((prev) => [...prev, seatIdentifier])
                    })
                }
            } catch (error) {
                console.error("Lỗi khi khóa ghế:", error)
            } finally {
                setLoadingSeats((prev) => ({ ...prev, [seatIdentifier]: false }))
            }
        }
    }

    return (
        <div className="flex-1 space-y-4">
            {flights.map((flight, index) => (
                <Card key={flight.flightId} className="border-2 border-border rounded-lg">
                    <CardContent className="p-4">

                        {/* Dialog, info, button */}
                        <div className="flex flex-col">

                            {/* Thông tin cơ bản và button */}
                            <div className="flex justify-between items-center">

                                {/* Các thông tin cơ bản */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex flex-col items-center">
                                            <span className="text-2xl font-bold">{formatTime(flight.departureTime)}</span>
                                            <span className="text-sm text-gray-500">{flight.departureCode}</span>
                                        </div>
                                        <div className="flex-1 relative">
                                            <ChevronsRight className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                                            <div className="border-t border-gray absolute w-full top-4"></div>
                                        </div>
                                        <div className="flex flex-col items-center mr-10">
                                            <span className="text-2xl font-bold">{formatTime(flight.arrivalTime)}</span>
                                            <span className="text-sm text-gray-500">{flight.arrivalCode}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row text-md text-left">
                                        <span>• Thời gian bay dự kiến: {formatFlightDuration(flight.arrivalTime, flight.departureTime)}</span>
                                        <span className="md:mx-auto mx-0 ">• Số hiệu: {flight.flightCode}</span>
                                    </div>

                                </div>

                                {/* Button phổ thông, thương gia */}
                                <div className="flex flex-col gap-y-2 text-right w-44">
                                    <Button className={"flex-1 w-full relative p-3 bg-teal-700 text-white hover:bg-teal-800"}
                                        onClick={() => handleExpanded(flight.flightId, "Economy")}
                                    >
                                        <div>
                                            <div className="font-semibold">Phổ thông</div>
                                            <div>{(parseFloat(flight.economyOptions[0]?.price) + parseFloat(flight.standardPrice)).toLocaleString()} VND</div>
                                        </div>
                                        <span className="absolute -top-2 -right-2 bg-orange text-white text-xs px-1.5 py-0.5 rounded-full">
                                            Còn 36 ghế
                                        </span>
                                    </Button>
                                    <Button className="flex flex-col p-3 bg-yellow-300 hover:bg-yellow-600"
                                        onClick={() => handleExpanded(flight.flightId, "Business")}
                                    >
                                        <div>
                                            <div className="font-semibold">Thương gia</div>
                                            <div>{(parseFloat(flight.businessOptions[0]?.price) + parseFloat(flight.standardPrice)).toLocaleString()} VND</div>
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
                                                    <div className="text-3xl font-bold text-teal-700">{formatTime(flight.departureTime)}</div>
                                                    <div className="text-lg font-semibold">{flight.departureCode}</div>
                                                    <div className="text-sm text-gray-600">{flight.departureCity}</div>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <Plane className="text-orange-500 mb-2" />
                                                    <div className="text-sm font-medium">{formatFlightDuration(flight.arrivalTime, flight.departureTime)}</div>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <div className="text-3xl font-bold text-teal-700">{formatTime(flight.arrivalTime)}</div>
                                                    <div className="text-lg font-semibold">{flight.arrivalCode}</div>
                                                    <div className="text-sm text-gray-600">{flight.arrivalCity}</div>
                                                </div>
                                            </div>

                                            {/* info */}
                                            <div className="grid gap-y-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-gray-700">Khởi hành:</span>
                                                    <span>{formatDate(flight.departureTime)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-gray-700">Số hiệu chuyến bay:</span>
                                                    <span>{flight.flightCode}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-gray-700">Loại máy bay:</span>
                                                    <span>{flight.aircraftType}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <DialogClose />
                                    </DialogContent>
                                </DialogPortal>
                            </Dialog>


                            {/* Xử lý sự kiện khi nhấn nút price */}
                            {expandedFlight === flight.flightId && ["Economy", "Business"].includes(expandedClass) && (
                                <div className="mt-4 border-t border-teal-400">
                                    <h3 className="font-semibold my-4">Chọn giá vé</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {(expandedClass === "Economy" ? flight.economyOptions : flight.businessOptions).map((option, optionIndex) => (
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
                                                    +{parseFloat(option.price).toLocaleString()} VND
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
                                                    <div className="flex items-start gap-2">
                                                        <HandPlatter className="h-4 w-4 mt-1" />
                                                        <div>
                                                            <div className="font-medium">Các dịch vụ</div>
                                                            <ul className="text-gray-600 list-disc pl-5">
                                                                {option.service.map((ele, index) => (
                                                                    <li key={index}>{ele}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}


                            {/* xử lý sự kiện chọn vé */}
                            {selectedOptionId && expandedFlight === flight.flightId && (
                                <div className="grid md:grid-cols-2 border-2 border-border p-6 mt-4 rounded-lg md:gap-2 gap-8 items-start">
                                    {/* instructions */}
                                    <div className="relative flex flex-col justify-center ">
                                        <div className="text-left font-semibold text-xl tracking-tighter shadow-xl w-full">Chọn ghế ngồi</div>

                                        <div className="flex items-center justify-center md:mt-7 mt-16">
                                            <BsFillAirplaneEnginesFill className="text-teal-700 h-[120px] w-[120px] scale-y-110 " />
                                        </div>

                                        <div className="grid grid-cols-2 items-start gap-2 my-6 p-3 w-full">
                                            {/* seat */}
                                            <div className="text-left border-r border-teal-500 grid gap-2">
                                                <div className="flex gap-2 items-center" id="Business">
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
                                                <h1 htmlFor="bisiness">1A to {flight.startRowEco - 1}F</h1>
                                                <h1 htmlFor="window">7A to {flight.rows}A and 7{flight.nameCols[flight.nameCols.length - 1]} to {flight.rows}{flight.nameCols[flight.nameCols.length - 1]}</h1>
                                                <h1 htmlFor="normal">Remains Seats</h1>
                                                <h1 htmlFor="unselected">Unselected Seats</h1>
                                                <h1 htmlFor="soldout">Soldout Seats</h1>
                                            </div>
                                        </div>


                                        {/* Thanh toán */}
                                        <div className="flex flex-col gap-y-4 max-h-[200px] overflow-y-auto">
                                            <div className="sticky top-0 z-10 text-left w-full font-semibold text-xl tracking-tighter shadow-xl bg-white">Các vé đã chọn</div>
                                            {(selectedSeats && selectedSeats.length > 0)
                                                ? (
                                                    <div className="space-y-3">
                                                        {selectedSeats.map((ele, index) => (
                                                            <div key={index} className="w-[90%] rounded-md bg-slate-100 p-2">{ele}</div>
                                                        ))}
                                                        <p className="w-[90%] p-2 border-t border-teal-500">Total</p>
                                                        <Button className="p-2 bg-blue-500 w-[90%] text-white hover:bg-blue-800 transition-all duration-300">Continue to Payment</Button>
                                                    </div>
                                                )
                                                : (
                                                    <div className="space-y-2">
                                                        <div className="text-teal-500 transition-all duration-300">Chưa ghế nào được chọn</div>
                                                        <Button className="p-2 bg-teal-300 cursor-not-allowed w-[90%] text-white">Continue to Payment</Button>
                                                    </div>
                                                )
                                            }
                                        </div>

                                    </div>

                                    {/* choose seats */}
                                    <div className={`relative grid grid-cols-${Math.max(1, flight.seatCol.length)} p-2 border-2 shadow-lg rounded-lg `}>
                                        {flight.seatCol.map((seat, index) => {
                                            let businessMissed = 0;
                                            let normalMissed = 0;
                                            return (
                                                <div key={index} className="flex flex-col items-center">
                                                    <div className="absolute lg:w-2 w-1 bg-orange -left-2 rounded-l-[10px] top-[230px] bottom-[10px]"></div>
                                                    <div className="absolute lg:w-2 w-1 bg-orange -right-2 rounded-r-[10px] top-[230px] bottom-[10px]"></div>
                                                    <h1 className="min-h-[2rem]">{seat.col}</h1>
                                                    <div className="flex flex-col items-center">

                                                        {/* business row */}
                                                        {[...Array(seat.rowBusiness)].map((_, index_) => {
                                                            const rowNumber = index_ + 1
                                                            const seatIdentifier = `${seat.col}${rowNumber}`
                                                            const seatData = flight.seats.find((s) => s.seatCode === seatIdentifier)

                                                            // miss seats
                                                            if (businessMissed < seat.missBusiness) {
                                                                businessMissed += 1;
                                                                return <div key={index_} className="w-7 h-7 min-h-[1.8rem]"></div>;
                                                            }

                                                            return seat.col !== '' ? (
                                                                !seatData || !seatData.isAvailable || seatData.soldTo ? ( // soldout seats
                                                                    <Sofa
                                                                        key={index_}
                                                                        className="w-7 h-7 min-h-[1.8rem] text-black cursor-not-allowed"
                                                                    />
                                                                ) : (
                                                                    <Sofa
                                                                        key={index_}
                                                                        className={`w-7 h-7 min-h-[1.8rem]
                                                                            ${selectedSeats.includes(`${seat.col}${rowNumber}`)
                                                                                ? 'text-orange'
                                                                                : 'text-teal-700'
                                                                            }
                                                                            ${expandedClass === 'Economy'
                                                                                ? 'cursor-not-allowed'
                                                                                : 'cursor-pointer hover:scale-125 '
                                                                            }
                                                                        `}
                                                                        onClick={
                                                                            expandedClass === "Economy" || loadingSeats[seatIdentifier]
                                                                                ? undefined // Không cho phép click
                                                                                : () => handleSeatClick(flight.flightId, seat.col, rowNumber)
                                                                        }
                                                                    />
                                                                )
                                                            ) : (
                                                                <h1 key={index_} className="h-7 min-h-[1.8rem] pt-[2px]">
                                                                    {rowNumber}
                                                                </h1>
                                                            );
                                                        })}

                                                        {/* Spacer between business row and normal row */}
                                                        <div className="w-7 h-4 min-h-[1rem]"></div>

                                                        {/* normal row */}
                                                        {[...Array(seat.rowNormal)].map((_, index_) => {
                                                            const rowNumber = index_ + flight.startRowEco
                                                            const seatIdentifier = `${seat.col}${rowNumber}`
                                                            const seatData = flight.seats.find((s) => s.seatCode === seatIdentifier)

                                                            if (normalMissed < seat.missNormal) {
                                                                normalMissed += 1
                                                                return <div key={index_} className="w-7 h-7 min-h-[1.8rem]"></div>;
                                                            }

                                                            return seat.col !== '' ? (
                                                                !seatData || !seatData.isAvailable || seatData.soldTo ? (
                                                                    <Sofa
                                                                        key={index_}
                                                                        className="w-7 h-7 min-h-[1.8rem] text-[#000000] cursor-not-allowed"
                                                                    />
                                                                ) : (
                                                                    <Sofa
                                                                        key={index_}
                                                                        className={`w-7 h-7 min-h-[1.8rem] ${expandedClass === 'Business'
                                                                            ? 'cursor-not-allowed'
                                                                            : 'cursor-pointer hover:scale-125'
                                                                            } ${selectedSeats.includes(`${seat.col}${rowNumber}`) &&
                                                                                (seat.col === 'A' || seat.col === 'F') &&
                                                                                rowNumber >= 7
                                                                                ? 'text-blue-700'
                                                                                : selectedSeats.includes(`${seat.col}${rowNumber}`)
                                                                                    ? 'text-[#35AB58]'
                                                                                    : 'text-teal-700'
                                                                            }`}
                                                                        onClick={
                                                                            expandedClass === "Business" || loadingSeats[seatIdentifier]
                                                                                ? undefined // Không cho phép click
                                                                                : () => handleSeatClick(flight.flightId, seat.col, rowNumber)
                                                                        }
                                                                    />
                                                                )
                                                            ) : (
                                                                <h1 key={index_} className="h-7 min-h-[1.8rem] pt-[2px]">
                                                                    {rowNumber}
                                                                </h1>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )
                                        })}
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