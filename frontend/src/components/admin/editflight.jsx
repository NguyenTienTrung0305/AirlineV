'use client'

import { Button } from "../ui/button"
import { Plus } from "lucide-react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from "../ui/dialog"
import { useState } from "react"
import { Input } from "../ui/input"

export function EditFlightDialog({ flight, onClose }) {
    const [flightData, setFlightData] = useState({
        departureTime: '',
        arrivalTime: '',
    })

    const [editFlight, setEditFlight] = useState(flight)

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
        // onOpenChange xảy ra khi click ra ngoài hoặc ấn button 'x' => lúc này sẽ gọi onClose => onClose sẽ setEditingFlight(null) làm cho đóng dialog
        <Dialog open={true} onOpenChange={onClose}>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle>{`Chỉnh sửa thông tin chuyến bay ${editFlight.flightNumber}`}</DialogTitle>
                    </DialogHeader>
                    <form className="mt-5" onSubmit={handleSubmit}>
                        <div className="grid gap-4">
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
                        </div>
                        <DialogFooter className="mt-4">
                            <Button type="submit" variant="default" className="p-2 w-[100px]">Lưu Thay Đổi</Button>
                        </DialogFooter>
                    </form>
                    <DialogClose />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    )
}