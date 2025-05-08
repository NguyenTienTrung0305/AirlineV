'use client'

import { Button } from "../ui/button"
import { Plus } from "lucide-react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from "../ui/dialog"
import { useState } from "react"
import { Input } from "../ui/input"

import { createNewFlightApi } from '@/util/api'
import { toast } from "@/hooks/useToast"
import { useRouter } from "next/router"

export function AddFlightDialog() {

    const [flightData, setFlightData] = useState({
        flightId: '',
        flightCode: '',
        aircraftType: '',

        departureCode: '',
        arrivalCode: '',
        departureTime: '',
        arrivalTime: '',
        departureCity: '',
        arrivalCity: '',

        status: 'Landed',

        rows: '',
        cols: '',
        seatTypes: ['Economy', 'Business', 'Near Window'],
        startRowBus: '',
        startRowEco: '',
        standardPrice: ''
    })


    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFlightData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault() // không tự động làm mới trang và gửi dữ liệu sau khi submit

        try {
            // Chuẩn bị dữ liệu gửi đi
            const dataToSend = {
                flightData: {
                    flightId: flightData.flightId,
                    flightCode: flightData.flightCode,
                    aircraftType: flightData.aircraftType,

                    departureCode: flightData.departureCode,
                    arrivalCode: flightData.arrivalCode,
                    departureTime: new Date(flightData.departureTime).toISOString(),
                    arrivalTime: new Date(flightData.arrivalTime).toISOString(),
                    departureCity: flightData.departureCity,
                    arrivalCity: flightData.arrivalCity,

                    status: flightData.status
                },
                rows: parseInt(flightData.rows),
                cols: parseInt(flightData.cols),
                seatTypes: flightData.seatTypes,
                startRowBus: parseInt(flightData.startRowBus),
                startRowEco: parseInt(flightData.startRowEco),
                standardPrice: parseFloat(flightData.standardPrice)
            }

            // save database
            const response = await createNewFlightApi(dataToSend)
            if (response.status === 200 && response.data.code === 'CREATE_FLIGHT_SUCCESS') {
                toast({
                    title: 'Success',
                    description: 'Thêm chuyến bay thành công!',
                })
            } else {
                toast({
                    title: 'Failed',
                    description: 'Thêm chuyến bay thất bại!',
                    variant: 'destructive'
                })
            }

        } catch (error) {

        }
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
                                <label htmlFor="flightCode" className="text-right">
                                    Số hiệu chuyến
                                </label>
                                <Input
                                    id="flightCode"
                                    name="flightCode"
                                    value={flightData.flightCode}
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
                                <label htmlFor="departureCode" className="text-right">
                                    Sân bay cất cánh
                                </label>
                                <Input
                                    id="departureCode"
                                    name="departureCode"
                                    value={flightData.departureCode}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="arrivalCode" className="text-right">
                                    Sân bay hạ cánh
                                </label>
                                <Input
                                    id="arrivalCode"
                                    name="arrivalCode"
                                    value={flightData.arrivalCode}
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

                            {/* Số hàng ghế của 1 chuyến bay */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="rows" className="text-right">
                                    Số hàng ghế của chuyến bay
                                </label>
                                <Input
                                    id="rows"
                                    name="rows"
                                    type="text"
                                    value={flightData.rows}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                    required
                                />
                            </div>

                            {/* Số dãy ghế của 1 chuyến bay */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="cols" className="text-right">
                                    Số dãy ghế của chuyến bay
                                </label>
                                <Input
                                    id="cols"
                                    name="cols"
                                    type="text"
                                    value={flightData.cols}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                    required
                                />
                            </div>

                            {/* Ghế thương gia bắt đầu từ hàng nào */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="startRowBus" className="text-right">
                                    Hàng ghế bắt đầu của thương gia
                                </label>
                                <Input
                                    id="startRowBus"
                                    name="startRowBus"
                                    type="text"
                                    value={flightData.startRowBus}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                    required
                                />
                            </div>

                            {/* Ghế phổ thông */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="startRowEco" className="text-right">
                                    Hàng ghế bắt đầu của phổ thông
                                </label>
                                <Input
                                    id="startRowEco"
                                    name="startRowEco"
                                    type="text"
                                    value={flightData.startRowEco}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                    required
                                />
                            </div>

                            {/* Giá ghế tiêu chuẩn */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="standardPrice" className="text-right">
                                    Giá ghế tiêu chuẩn
                                </label>
                                <Input
                                    id="standardPrice"
                                    name="standardPrice"
                                    type="text"
                                    value={flightData.standardPrice}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter className="mt-4">
                            <Button type="submit" className="bg-blue-500 hover:bg-blue-600 p-2 w-auto text-white">Tạo chuyến bay</Button>
                        </DialogFooter>
                    </form>
                    <DialogClose />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    )
}