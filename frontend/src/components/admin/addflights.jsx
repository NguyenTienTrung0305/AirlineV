'use client'

import { Button } from "../ui/button"
import { Plus } from "lucide-react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from "../ui/dialog"
import { useState } from "react"
import { Input } from "../ui/input"

export function AddFlightDialog() {
    const [flightData, setFlightData] = useState({
        flightId: '',
        flightNumber: '',
        aircraftType: '',
        departureCity: '',
        arrivalCity: '',
        departureTime: '',
        arrivalTime: '',
        basePrice: '',
        status: 'OnTime'
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFlightData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault() // không tự động làm mới trang và gửi dữ liệu sau khi submit

        // save database

        alert("ok")
    }


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium p-2">
                    <Plus className="mr-2 h-4 w-4" />
                    CHUYẾN BAY MỚI
                </Button>
            </DialogTrigger>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle>Thêm chuyến bay mới</DialogTitle>
                        <DialogDescription>Vui lòng nhập đầy đủ các thông tin bên dưới</DialogDescription>
                    </DialogHeader>
                    <form className="mt-5" onSubmit={handleSubmit}>
                        <div className="grid gap-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="flightId" className="text-left">
                                    ID chuyến bay
                                </label>
                                <Input
                                    id="flightId"
                                    name="flightId"
                                    value={flightData.flightId}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="flightNumber" className="text-right">
                                    Số hiệu chuyến
                                </label>
                                <Input
                                    id="flightNumber"
                                    name="flightNumber"
                                    value={flightData.flightNumber}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="aircraftType" className="text-right">
                                    Loại tàu bay
                                </label>
                                <Input
                                    id="aircraftType"
                                    name="aircraftType"
                                    value={flightData.aircraftType}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="departureCity" className="text-right">
                                    Điểm cất cánh
                                </label>
                                <Input
                                    id="departureCity"
                                    name="departureCity"
                                    value={flightData.departureCity}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="arrivalCity" className="text-right">
                                    Điểm hạ cánh
                                </label>
                                <Input
                                    id="arrivalCity"
                                    name="arrivalCity"
                                    value={flightData.arrivalCity}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="departureAirport" className="text-right">
                                    Sân bay cất cánh
                                </label>
                                <Input
                                    id="departureAirport"
                                    name="departureAirport"
                                    value={flightData.departureAirport}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="arrivalAirport" className="text-right">
                                    Sân bay hạ cánh
                                </label>
                                <Input
                                    id="arrivalAirport"
                                    name="arrivalAirport"
                                    value={flightData.arrivalAirport}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="departureTime" className="text-right">
                                    Thời gian cất cánh
                                </label>
                                <Input
                                    id="departureTime"
                                    name="departureTime"
                                    type="datetime-local"
                                    value={flightData.departureTime}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="arrivalTime" className="text-right">
                                    Thời gian hạ cánh
                                </label>
                                <Input
                                    id="arrivalTime"
                                    name="arrivalTime"
                                    type="datetime-local"
                                    value={flightData.arrivalTime}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="basePrice" className="text-right">
                                    Giá cơ sở
                                </label>
                                <Input
                                    id="basePrice"
                                    name="basePrice"
                                    type="number"
                                    step="10"
                                    value={flightData.basePrice}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter className="mt-4">
                            <Button type="submit" className="bg-blue-500 hover:bg-blue-600 p-2 w-[60px]">Lưu</Button>
                        </DialogFooter>
                    </form>
                    <DialogClose />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    )
}