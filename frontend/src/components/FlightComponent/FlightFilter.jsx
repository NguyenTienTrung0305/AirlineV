import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Slider } from '@/components/ui/slider'
import { RadioGroup } from "../ui/radio";
import { RadioGroupItem } from "../ui/radio";
import { Button } from "../ui/button";

export function FlightFilter() {
    const [budget, setBudget] = useState([100000, 4000000])
    const [departureTime, setDepartureTime] = useState("all")
    const handleResetFilters = () => {
        const defaultBudget = [1000000,4000000]
        const defaultDepartureTime = "all"
        setBudget(defaultBudget)
        setDepartureTime(defaultDepartureTime)
    }

    const handleApplyFilters = () => {
        alert('done')
    }

    return (
        <Card className="w-full lg:w-72 h-fit rounded-md border-2 border-border shadow-lg">
            <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold text-lg"> Filters</h2>
                </div>

                <div className="mb-4">
                    <label className="font-semibold">
                        Budget
                    </label>
                    <div className="flex justify-between text-sm mt-2">
                        <span>{budget[0].toLocaleString()} VND</span>
                        <span>{budget[1].toLocaleString()} VND</span>
                    </div>
                    <Slider
                        min={100000}
                        max={4000000}
                        step={1000}
                        value={budget}
                        onValueChange={setBudget}
                        className="mt-2"
                    />
                </div>

                <div className="mb-4">
                    <label className="font-semibold">
                        Departure time
                    </label>
                    <div className="flex flex-col">
                        <RadioGroup
                            value={departureTime}
                            onValueChange={setDepartureTime}
                        >
                            <div className="flex items-center gap-x-2 mt-2">
                                <RadioGroupItem value="all" id="all" />
                                <label htmlFor="all">Tất cả</label>
                            </div>
                            <div className="flex items-center gap-x-2 mt-2">
                                <RadioGroupItem value="morning" id="morning" />
                                <label htmlFor="morning">00:00 - 11:59 Sáng</label>
                            </div>
                            <div className="flex items-center gap-x-2 mt-2">
                                <RadioGroupItem value="afternoon" id="afternoon" />
                                <label htmlFor="afternoon">12:00 - 17:59 Chiều</label>
                            </div>
                            <div className="flex items-center gap-x-2 mt-2">
                                <RadioGroupItem value="evening" id="evening" />
                                <label htmlFor="evening">18:00 - 23:59 Tối</label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>


                <div className="flex justify-between mt-4">
                    <Button variant="outline" onClick={handleResetFilters} className="p-3 w-[20%] lg:w-auto">
                        Thiết lập lại
                    </Button>
                    <Button variant="default" className="bg-orange text-white p-3 w-[20%] lg:w-auto" onClick={handleApplyFilters}>
                        Áp dụng
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}