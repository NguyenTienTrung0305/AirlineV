"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search } from 'lucide-react'
import { useRouter } from "next/router";
import flights from '@/data/flights.json'
import { Badge } from "@/components/ui/badge";

export default function ScheduledFlights() {


    // getBadge
    const getStatusBadge = (flight) => {
        switch (flight.status) {
            case "OnTime":
                return (
                    <Badge className="bg-green-400 hover:bg-green-400 text-black">Đang Bay</Badge>
                )
            case "Landed":
                return (
                    <Badge className="bg-yellow-400 hover:bg-yellow-400 text-black">Đã Hạ Cánh</Badge>
                )
            default:
        }
    }

    return (
        <div className="lg:mx-auto lg:pl-64 pt-10 space-y-6 mx-0 pl-0">
            <div className="flex flex-col gap-4 mx-5 md:mx-[16%]">
                <div className="flex justify-between w-full">
                    <p className="font-bold text-2xl text-shadow tracking-tighter">QUẢN LÝ CHUYẾN BAY</p>
                    <Button variant="default" className="p-2 w-[160px] bg-orange">
                        <Plus />
                        CHUYẾN BAY MỚI
                    </Button>
                </div>

                <div className="relative mb-6">
                    <Input
                        type="text"
                        placeholder="Tìm kiếm chuyến bay sử dụng tên tàu bay hoặc số hiệu chuyến"
                        // value={searchQuery}
                        // onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-4 pr-10 h-10 border rounded"
                    />
                    <Button
                        size="sm"
                        className="absolute right-0 top-0 h-10 bg-blue-500 hover:bg-blue-600 rounded-l-none"
                    >
                        <Search className="h-4 w-4" />
                    </Button>
                </div>

                {/* Table data*/}
                <div className="border border-red-950 rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-100">
                                <TableHead className="w-[80px] text-center">SỐ HIỆU</TableHead>
                                <TableHead className="text-center">LOẠI MÁY BAY</TableHead>
                                <TableHead className="text-center">CẤT CÁNH</TableHead>
                                <TableHead className="text-center">HẠ CÁNH</TableHead>
                                <TableHead className="text-center">PHỔ THÔNG</TableHead>
                                <TableHead className="text-center">THƯƠNG GIA</TableHead>
                                <TableHead className="text-center">TÙY CHỈNH</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {flights.map((flight, index) => (
                                <TableRow key={flight.id} className={index % 2 === 0 ? "bg-white" : 'bg-slate-200'}>
                                    <TableCell>{flight.flightNumber}</TableCell>
                                    <TableCell>{flight.aircraft}</TableCell>
                                    <TableCell>{flight.departureCode} {flight.departureTime} - {flight.departureDate.split(',').slice(1, 3)}</TableCell>
                                    <TableCell>{flight.arrivalCode} {flight.arrivalTime}</TableCell>
                                    <TableCell>{flight.economyPrice}</TableCell>
                                    <TableCell>{flight.businessPrice}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            {getStatusBadge(flight)}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}