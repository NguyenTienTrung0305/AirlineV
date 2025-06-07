"use-client"

import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "recharts"

export function PassengerList({ passengers, onContinue, onBack }) {
    const [passengerList, setPassengerList] = useState([])

    // initialize passengerList
    useEffect(() => {
        const initializePassengers = Array.from({ length: passengers }, (_, i) => ({
            name: "",
            cccd: "",
            dob: ""
        }))

        setPassengerList(initializePassengers)
    }, [passengers])


    const handleChange = async (index, field, value) => {
        const updatedList = [...passengerList]
        updatedList[index][field] = value
        setPassengerList(updatedList)
    }

    const handleContinue = async (e) => {
        e.preventDefault()
        onContinue(passengerList)
    }

    return (
        <Card className="w-full max-w-4xl mx-auto mb-8 border-orange">
            <CardContent className="p-6">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 text-zinc-400">Vui lòng điền thông tin các hành khách</h3>
                <form onSubmit={handleContinue}>
                    <div className="space-y-6">
                        {passengerList.map((passenger, index) => (
                            <div key={index} className="space-y-1">
                                <h4 className="font-semibold text-orange">Hành khách {index + 1}</h4>
                                <div key={index} className="border border-zinc-300 p-4 rounded-md">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="name">Họ và tên</label>
                                            <Input
                                                type="text"
                                                name="name"
                                                value={passenger.name}
                                                onChange={(e) => handleChange(index, "name", e.target.value)}
                                                placeholder="John Nguyen"
                                                required
                                            />
                                        </div>


                                        <div>
                                            <label htmlFor="cccd">Số CCCD</label>
                                            <Input
                                                type="text"
                                                name="cccd"
                                                value={passenger.cccd}
                                                onChange={(e) => handleChange(index, "cccd", e.target.value)}
                                                placeholder="0123456789"
                                                required
                                            />
                                        </div>


                                        <div>
                                            <label htmlFor="date">Ngày sinh</label>
                                            <Input
                                                type="date"
                                                name='date'
                                                value={passenger.dob}
                                                onChange={(e) => handleChange(index, "dob", e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* navigate */}
                    <div className="flex justify-end gap-4 mt-6" >
                        <Button variant="outline" className="p-1 w-auto" onClick={onBack}>
                            Quay Lại
                        </Button>
                        <Button variant="orange" className="p-1 w-auto" type="submit">
                            Tiếp Tục
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}