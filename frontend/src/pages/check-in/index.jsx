"use-client"

import { CheckInConfrm } from "@/components/check-in/check-in-confirm"
import FlightDetailStep from "@/components/check-in/flight-detail-step"
import { PassengerList } from "@/components/check-in/passenger-list"
import { PaymentStep } from "@/components/check-in/payment-step"
import { StepIndicator } from "@/components/check-in/step-indicator"
import { formatFlightDuration } from "@/hooks/useFlightData"
import axios from "@/util/axiosCustom"
import { useRouter } from "next/router"
import { useState, useCallback, useEffect } from "react"

const steps = [
    {
        title: "Chi tiết chuyến bay",
        description: "Xem lại thông tin chuyến bay"
    },
    {
        title: "Hành khách",
        description: "Chọn hành khách"
    },
    {
        title: "Thanh toán",
        description: "Thanh toán vé máy bay"
    },
    {
        title: "Xác nhận",
        description: "Xác nhận thông tin và thanh toán"
    }
]



export default function CheckIn() {
    const router = useRouter()
    const {
        flightId,
        seats,
        passengers
    } = router.query

    const [currentStep, setCurrentStep] = useState(0)
    const [departureFlight, setDepartureFlight] = useState(null)
    const [returnFlight, setReturnFlight] = useState(null)

    const [passengersData, setPassengersData] = useState([])

    const [paymentData, setPaymentData] = useState(null)
    const [paymentStatus, setPaymentStatus] = useState("pending")


    const calculateTotalServiceFee = () => {
        const baseFeePerPassenger = 50000
        const passengerCount = Array.isArray(passengers) ? passengers.length : parseInt(passengers)
        return baseFeePerPassenger * passengerCount
    }


    // FETCH API
    const fetchFlight = useCallback(async (flightId, type) => {
        try {
            const response = await axios.get(`/api/flights/?flightId=${flightId}`)
            let flight;
            if (response.status === 200) {
                flight = response.data.data
            } else {
                throw new Error('Failed to fetch flight details')
            }

            const formattedFlight = {
                departureCity: flight.departureCity,
                arrivalCity: flight.arrivalCity,

                // flight.departureTime dạng seconds => phải chuyển về miniseconds 
                departureTime: new Date(flight.departureTime._seconds * 1000).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
                arrivalTime: new Date(flight.arrivalTime._seconds * 1000).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                }),

                flightCode: flight.flightCode,
                flightDate: new Date(flight.departureTime._seconds * 1000).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                }),

                duration: formatFlightDuration(
                    new Date(flight.arrivalTime._seconds * 1000),
                    new Date(flight.departureTime._seconds * 1000)
                )
            }


            if (type === "departure") {
                setDepartureFlight(formattedFlight)
            } else {
                setReturnFlight(formattedFlight)
            }
        } catch (error) {
            error('Error fetching flight details:', error)
        }
    }, [setDepartureFlight, setReturnFlight])


    useEffect(() => {
        if (flightId) {
            fetchFlight(flightId, 'departure');
        }
    }, [fetchFlight, flightId])




    // handle payment
    const handlePayment = async (paymentMethod, paymentDetails) => {
        setPaymentStatus('processing')

        try {
            const paymentPayload = {
                flightId,
                passengers: passengersData,
                amount: calculateTotalServiceFee(),
                paymentMethod,
                paymentDetails,
                transactionId: `CHECKIN_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
            }

            const response = await axios.post('/api/payment/process', paymentPayload)


        } catch (error) {
            console.error('Error processing payment:', error)
            setPaymentStatus('failed')
        }
    }



    // verify payment
    const verifyPayment = async (transactionId) => {
        try {
            const response = await axios.get(`/api/payment/verify/${transactionId}`)
            if (response.status === 200) {
                setPaymentStatus('completed')
                setPaymentData(response.data.paymentInfo)
                return true
            }
            return false
        } catch (error) {
            console.error('Payment verification error:', error)
            return false
        }
    }



    // Điều hướng steps
    const handleContinue = async () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => (prev + 1))
        }
    }

    const handlePassengerContinue = async (passengerList) => {
        const mappedPassengers = mapSeatsWithPassengers(passengerList, seats)
        console.log(mappedPassengers)
        setPassengersData(mappedPassengers)
        if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => (prev + 1))
        }
    }

    const hanldeBack = async () => {
        if (currentStep > 0) {
            // Reset payment status khi quay lại từ bước thanh toán
            if (currentStep === 2) {
                setPaymentStatus('pending')
                setPaymentData(null)
            }
            setCurrentStep((prev) => (prev - 1))
        }
    }






    // map seats with passenger
    const mapSeatsWithPassengers = (passengers, selectedSeats) => {
        const seatsArray = Array.isArray(selectedSeats) ? selectedSeats : [selectedSeats]

        if (seatsArray.length < passengers.length) {
            console.error("Số lượng ghế không đủ cho số lượng hành khách")
            return passengers
        }

        const mappedPassengers = passengers.map((passenger, index) => ({
            ...passenger,
            seat: seatsArray[index] || null
        }))

        return mappedPassengers
    }

    return (
        <div className="container mx-auto p-6">
            <StepIndicator currentStep={currentStep} steps={steps} />

            {currentStep === 0 && (
                <FlightDetailStep
                    flightDetails={departureFlight}
                    passengerCount={passengers}
                    onContinue={handleContinue}
                    onCancel={() => window.history.back()}
                />
            )}

            {currentStep === 1 && (
                <PassengerList
                    passengers={passengers}
                    onContinue={handlePassengerContinue}
                    onBack={hanldeBack}
                />
            )}

            {currentStep == 2 && (
                <PaymentStep
                    amount={calculateTotalServiceFee()}
                    passengerCount={Array.isArray(passengers) ? passengers.length : parseInt(passengers) || 1}
                    paymentStatus={paymentStatus}
                    setPaymentStatus={setPaymentStatus}
                    onPayment={handlePayment}
                    onBack={hanldeBack}
                    onVerifyPayment={verifyPayment}
                />
            )}

            {currentStep === 3 && (
                <CheckInConfrm
                    flight={departureFlight}
                    passengerList={passengersData}
                    onBack={hanldeBack}
                    onHome={() => router.push("/")}
                />
            )}
        </div>
    )
}