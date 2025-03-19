import { Card, CardContent } from "../ui/card";
import { ChevronsRight, Info, Plane, RefreshCw, Luggage } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FlightCard({ flights }) {
    return (
        <div className="flex-1 space-y-4">
            {flights.map((flight, index) => (
                <Card key={index}>
                    <CardContent className="p-4">
                        <div className="flex flex-col">
                            <div className="flex justify-between items-center">
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex flex-col items-center">
                                            <span className="text-2xl font-bold">{flight.departureTime}</span>
                                            <span className="text-sm text-gray-500">{flight.departureCode}</span>
                                        </div>
                                        <div className="flex-1 relative">
                                            <ChevronsRight className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                                            <div className="border-t border-gray-300 absolute w-full top-4"></div>
                                        </div>
                                        <div className="flex flex-col items-center mr-10">
                                            <span className="text-2xl font-bold">{flight.arrivalTime}</span>
                                            <span className="text-sm text-gray-500">{flight.arrivalCode}</span>
                                        </div>
                                    </div>

                                    
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}