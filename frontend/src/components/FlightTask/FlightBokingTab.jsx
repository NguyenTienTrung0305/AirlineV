import { LuPlane, LuTicket } from "react-icons/lu";
import { FaRegCircleUser } from "react-icons/fa6";
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { Button } from "../ui/button";


import { SearchFlightForm } from "./SearchFlightForm";

const FlightBookingTabs = () => {

    const router = useRouter()
    const [bookingId, setBookingId] = useState('')
    const [email, setEmail] = useState('')

    // click button search
    const handleSearch = (data) => {
        router.push({
            pathname: '/flights',
            
            // forward data to /flights
            query: {
                fromAirport: data.fromAirport,
                toAirport: data.toAirport,
                departureDate: data.departureDate,
                returnDate: data.returnDate,
                tripType: data.tripType,
                passengerCount: data.passengerCount,
            }
        })
    }

    
    // click booking
    const handleBookingManagement = () => {
        if (!bookingId || !email) {
            alert("Please enter a bookingId and email")
            return;
        }

        router.push({
            pathname: "/booking-management",
            query: {
                bookingId: bookingId,
                email: email,
            }
        })
    }

    // click do procedure 
    const handleDoProcedure = () => {
        if (!bookingId || !email) {
            alert("Please enter a bookingId and email")
            return;
        }

        router.push({
            pathname: "/check-in",
            query: {
                bookingId: bookingId,
                email: email,
            }
        })
    }

    return (
        <div className="bg-white w-full flex items-center justify-center rounded-lg">

            <Tabs defaultValue="buy" className="w-full p-5">
                {/* Tab Navigation */}
                <TabsList className="grid w-full grid-cols-3 bg-gray text-textColor h-auto rounded-t-lg">
                    {/* data-[state=active]:bg-orange data-[state=active]:text-white => Màu nền cam và chữ trắng khi tab được chọn*/}
                    {/* khi click value sẽ được truyền cho value trong Tabs*/}
                    <TabsTrigger value="buy" className="flex items-center gap-2 py-4 text-textColor data-[state=active]:bg-orange data-[state=active]:text-white">
                        <LuPlane className="h-5 w-5" />
                        Mua vé
                    </TabsTrigger>
                    <TabsTrigger value="manageTicket" className="flex items-center gap-2 py-4 text-textColor data-[state=active]:bg-orange data-[state=active]:text-white">
                        <LuTicket className="h-5 w-5" />
                        Quản lý đặt vé
                    </TabsTrigger>
                    <TabsTrigger value="checkin" className="flex items-center gap-2 py-4 text-textColor data-[state=active]:bg-orange data-[state=active]:text-white">
                        <FaRegCircleUser className="h-5 w-5" />
                        Làm thủ tục
                    </TabsTrigger>
                </TabsList>

                {/* Mua vé tabs */}
                <TabsContent
                    value="buy"
                    className="w-full rounded-b-lg"
                >   
                    {/* Truyền handleSearch xuống SearchFlightForm qua props onSearch */}
                    <SearchFlightForm onSearch={handleSearch}/> 
                </TabsContent>

                {/* Quản lý đặt vé tabs */}
                <TabsContent
                    value="manageTicket"
                    className="w-full rounded-b-lg"
                >
                    <div className="flex flex-col gap-2 w-full">
                        <Input
                            placeholder="Mã đặt chỗ/Số vé điện tử"
                            value={bookingId}
                            onChange={(e) => setBookingId(e.target.value)}

                        />
                        <Input
                            placeholder="Hòm thư điện tử"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button
                            variant="default"
                            size="default"
                            className="w-full bg-orange"
                            onClick={handleBookingManagement}
                        >
                            TÌM KIẾM
                        </Button>
                    </div>

                </TabsContent>

                {/*Checkin tab */}
                <TabsContent
                    value="checkin"
                    className="w-full rounded-b-lg"
                >
                    <div className="flex flex-col gap-2 w-full">
                        <Input
                            placeholder="Mã đặt chỗ"
                            value={bookingId}
                            onChange={(e) => setBookingId(e.target.value)}
                        />
                        <Input
                            placeholder="Hòm thư điện tử"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Button
                            variant="default"
                            size="default"
                            className="w-full bg-orange"
                            onClick={handleDoProcedure}
                        >
                            LÀM THỦ TỤC
                        </Button>
                    </div>

                </TabsContent>
            </Tabs>
        </div>
    )
}


export default FlightBookingTabs